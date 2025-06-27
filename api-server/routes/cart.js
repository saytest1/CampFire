// routes/cart.js
const express = require('express');
const router = express.Router();
const { Cart, CartItem, CampingProduct, sequelize } = require('../models');
const { authenticateToken } = require('./middleware/auth');
const { body, validationResult } = require('express-validator');

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({
      where: { userId: req.user.userId },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{
          model: CampingProduct,
          as: 'product',
          attributes: ['id', 'name', 'slug', 'mainImage', 'salePrice', 'stockQuantity', 'stockForRent', 'rentalPriceDaily', 'rentalPriceWeekly']
        }]
      }]
    });

    // Create cart if doesn't exist
    if (!cart) {
      cart = await Cart.create({ userId: req.user.userId });
      cart.items = [];
    }

    // Recalculate totals
    let totalItems = 0;
    let subtotal = 0;

    cart.items.forEach(item => {
      totalItems += item.quantity;
      subtotal += parseFloat(item.subtotal);
    });

    // Update cart totals if changed
    if (cart.totalItems !== totalItems || cart.subtotal !== subtotal) {
      await cart.update({ totalItems, subtotal });
    }

    res.json({
      success: true,
      data: { cart }
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart'
    });
  }
});

// Add item to cart
router.post('/items', 
  authenticateToken,
  [
    body('productId').isInt(),
    body('quantity').isInt({ min: 1 }),
    body('type').isIn(['purchase', 'rental']),
    body('rentalStartDate').optional().isISO8601(),
    body('rentalEndDate').optional().isISO8601()
  ],
  async (req, res) => {
    const t = await sequelize.transaction();
    
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        await t.rollback();
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const { productId, quantity, type, rentalStartDate, rentalEndDate } = req.body;

      // Get product
      const product = await CampingProduct.findByPk(productId);
      if (!product || !product.isActive) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Check stock
      if (type === 'purchase' && product.stockQuantity < quantity) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock'
        });
      }

      if (type === 'rental') {
        if (!product.isAvailableForRent) {
          await t.rollback();
          return res.status(400).json({
            success: false,
            message: 'Product not available for rent'
          });
        }

        if (!rentalStartDate || !rentalEndDate) {
          await t.rollback();
          return res.status(400).json({
            success: false,
            message: 'Rental dates required'
          });
        }

        // Check rental stock
        if (product.stockForRent < quantity) {
          await t.rollback();
          return res.status(400).json({
            success: false,
            message: 'Insufficient rental stock'
          });
        }
      }

      // Get or create cart
      let cart = await Cart.findOne({ 
        where: { userId: req.user.userId },
        transaction: t
      });
      
      if (!cart) {
        cart = await Cart.create({ 
          userId: req.user.userId 
        }, { transaction: t });
      }

      // Calculate rental days and price
      let rentalDays = 0;
      let price = product.salePrice;

      if (type === 'rental') {
        const start = new Date(rentalStartDate);
        const end = new Date(rentalEndDate);
        rentalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        
        if (rentalDays < 1) {
          await t.rollback();
          return res.status(400).json({
            success: false,
            message: 'Invalid rental period'
          });
        }

        // Calculate rental price
        if (rentalDays >= 7 && product.rentalPriceWeekly) {
          const weeks = Math.floor(rentalDays / 7);
          const extraDays = rentalDays % 7;
          price = (weeks * product.rentalPriceWeekly) + (extraDays * product.rentalPriceDaily);
        } else {
          price = rentalDays * product.rentalPriceDaily;
        }
        
        price = price / rentalDays; // Price per day for display
      }

      // Check if item already in cart
      let cartItem = await CartItem.findOne({
        where: {
          cartId: cart.id,
          productId,
          type
        },
        transaction: t
      });

      if (cartItem) {
        // Update existing item
        cartItem.quantity += quantity;
        
        if (type === 'rental') {
          cartItem.rentalStartDate = rentalStartDate;
          cartItem.rentalEndDate = rentalEndDate;
          cartItem.rentalDays = rentalDays;
        }
        
        await cartItem.save({ transaction: t });
      } else {
        // Create new item
        cartItem = await CartItem.create({
          cartId: cart.id,
          productId,
          quantity,
          type,
          price,
          rentalStartDate: type === 'rental' ? rentalStartDate : null,
          rentalEndDate: type === 'rental' ? rentalEndDate : null,
          rentalDays: type === 'rental' ? rentalDays : null
        }, { transaction: t });
      }

      // Update cart totals
      const items = await CartItem.findAll({
        where: { cartId: cart.id },
        transaction: t
      });

      let totalItems = 0;
      let subtotal = 0;

      items.forEach(item => {
        totalItems += item.quantity;
        if (item.type === 'rental' && item.rentalDays) {
          subtotal += item.price * item.quantity * item.rentalDays;
        } else {
          subtotal += item.price * item.quantity;
        }
      });

      await cart.update({ totalItems, subtotal }, { transaction: t });

      await t.commit();

      // Fetch updated cart
      const updatedCart = await Cart.findByPk(cart.id, {
        include: [{
          model: CartItem,
          as: 'items',
          include: [{
            model: CampingProduct,
            as: 'product'
          }]
        }]
      });

      res.json({
        success: true,
        message: 'Item added to cart',
        data: { cart: updatedCart }
      });

    } catch (error) {
      await t.rollback();
      console.error('Add to cart error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add item to cart'
      });
    }
});

// Update cart item quantity
router.put('/items/:itemId', 
  authenticateToken,
  body('quantity').isInt({ min: 0 }),
  async (req, res) => {
    const t = await sequelize.transaction();
    
    try {
      const { itemId } = req.params;
      const { quantity } = req.body;

      // Get cart item
      const cartItem = await CartItem.findByPk(itemId, {
        include: [
          { model: Cart, as: 'cart' },
          { model: CampingProduct, as: 'product' }
        ],
        transaction: t
      });

      if (!cartItem || cartItem.cart.userId !== req.user.userId) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: 'Cart item not found'
        });
      }

      // If quantity is 0, remove item
      if (quantity === 0) {
        await cartItem.destroy({ transaction: t });
      } else {
        // Check stock
        if (cartItem.type === 'purchase' && cartItem.product.stockQuantity < quantity) {
          await t.rollback();
          return res.status(400).json({
            success: false,
            message: 'Insufficient stock'
          });
        }

        if (cartItem.type === 'rental' && cartItem.product.stockForRent < quantity) {
          await t.rollback();
          return res.status(400).json({
            success: false,
            message: 'Insufficient rental stock'
          });
        }

        await cartItem.update({ quantity }, { transaction: t });
      }

      // Recalculate cart totals
      const cart = cartItem.cart;
      const items = await CartItem.findAll({
        where: { cartId: cart.id },
        transaction: t
      });

      let totalItems = 0;
      let subtotal = 0;

      items.forEach(item => {
        totalItems += item.quantity;
        if (item.type === 'rental' && item.rentalDays) {
          subtotal += item.price * item.quantity * item.rentalDays;
        } else {
          subtotal += item.price * item.quantity;
        }
      });

      await cart.update({ totalItems, subtotal }, { transaction: t });

      await t.commit();

      // Fetch updated cart
      const updatedCart = await Cart.findByPk(cart.id, {
        include: [{
          model: CartItem,
          as: 'items',
          include: [{
            model: CampingProduct,
            as: 'product'
          }]
        }]
      });

      res.json({
        success: true,
        message: quantity === 0 ? 'Item removed from cart' : 'Cart updated',
        data: { cart: updatedCart }
      });

    } catch (error) {
      await t.rollback();
      console.error('Update cart error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update cart'
      });
    }
});

// Remove item from cart
router.delete('/items/:itemId', authenticateToken, async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { itemId } = req.params;

    const cartItem = await CartItem.findByPk(itemId, {
      include: [{ model: Cart, as: 'cart' }],
      transaction: t
    });

    if (!cartItem || cartItem.cart.userId !== req.user.userId) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    await cartItem.destroy({ transaction: t });

    // Update cart totals
    const cart = cartItem.cart;
    const items = await CartItem.findAll({
      where: { cartId: cart.id },
      transaction: t
    });

    let totalItems = 0;
    let subtotal = 0;

    items.forEach(item => {
      totalItems += item.quantity;
      if (item.type === 'rental' && item.rentalDays) {
        subtotal += item.price * item.quantity * item.rentalDays;
      } else {
        subtotal += item.price * item.quantity;
      }
    });

    await cart.update({ totalItems, subtotal }, { transaction: t });

    await t.commit();

    res.json({
      success: true,
      message: 'Item removed from cart'
    });

  } catch (error) {
    await t.rollback();
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item'
    });
  }
});

// Clear cart
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { userId: req.user.userId }
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    await CartItem.destroy({
      where: { cartId: cart.id }
    });

    await cart.update({
      totalItems: 0,
      subtotal: 0
    });

    res.json({
      success: true,
      message: 'Cart cleared'
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart'
    });
  }
});

module.exports = router;