// routes/orders.js
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { 
  Order, 
  OrderItem, 
  Cart, 
  CartItem, 
  CampingProduct, 
  User,
  sequelize 
} = require('../models');
const { authenticateToken, authenticateAdmin } = require('./middleware/auth');
const { body, validationResult } = require('express-validator');
const { sendEmail, emailTemplates } = require('../utils/email');

// Create order validation
const createOrderValidation = [
  body('shippingFullName').notEmpty().trim(),
  body('shippingPhone').notEmpty().trim(),
  body('shippingAddress').notEmpty().trim(),
  body('shippingCity').notEmpty().trim(),
  body('paymentMethod').isIn(['cod', 'bank-transfer', 'credit-card', 'e-wallet'])
];

// Create order from cart
router.post('/', authenticateToken, createOrderValidation, async (req, res) => {
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

    // Get user's cart
    const cart = await Cart.findOne({
      where: { userId: req.user.userId },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{
          model: CampingProduct,
          as: 'product'
        }]
      }],
      transaction: t
    });

    if (!cart || cart.items.length === 0) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Check stock availability
    for (const item of cart.items) {
      if (item.type === 'purchase' && item.product.stockQuantity < item.quantity) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.product.name}`
        });
      }
      
      if (item.type === 'rental' && item.product.stockForRent < item.quantity) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Insufficient rental stock for ${item.product.name}`
        });
      }
    }

    // Calculate order totals
    let subtotal = 0;
    let hasRentals = false;
    let hasPurchases = false;
    let rentalDeposit = 0;

    cart.items.forEach(item => {
      if (item.type === 'rental') {
        hasRentals = true;
        const itemTotal = item.price * item.quantity * item.rentalDays;
        subtotal += itemTotal;
        rentalDeposit += (item.product.rentalDeposit || 0) * item.quantity;
      } else {
        hasPurchases = true;
        subtotal += item.price * item.quantity;
      }
    });

    const shippingFee = req.body.shippingMethod === 'express' ? 50000 : 
                       req.body.shippingMethod === 'pickup' ? 0 : 30000;
    
    const discount = 0; // TODO: Implement discount codes
    const total = subtotal + shippingFee - discount + rentalDeposit;

    // Determine order type
    const orderType = hasRentals && !hasPurchases ? 'rental' : 'purchase';

    // Create order
    const orderData = {
      userId: req.user.userId,
      type: orderType,
      subtotal,
      shippingFee,
      discount,
      total,
      ...req.body,
      status: 'pending',
      paymentStatus: req.body.paymentMethod === 'cod' ? 'pending' : 'processing'
    };

    // Add rental dates if it's a rental order
    if (hasRentals) {
      const rentalItems = cart.items.filter(i => i.type === 'rental');
      orderData.rentalStartDate = rentalItems[0].rentalStartDate;
      orderData.rentalEndDate = rentalItems[0].rentalEndDate;
      orderData.rentalStatus = 'reserved';
      orderData.rentalDeposit = rentalDeposit;
      orderData.depositStatus = 'pending';
    }

    const order = await Order.create(orderData, { transaction: t });

    // Create order items
    const orderItems = [];
    for (const cartItem of cart.items) {
      const orderItem = await OrderItem.create({
        orderId: order.id,
        productId: cartItem.productId,
        productName: cartItem.product.name,
        productSku: cartItem.product.sku,
        productImage: cartItem.product.mainImage,
        quantity: cartItem.quantity,
        price: cartItem.price,
        subtotal: cartItem.type === 'rental' ? 
          cartItem.price * cartItem.quantity * cartItem.rentalDays : 
          cartItem.price * cartItem.quantity,
        type: cartItem.type,
        rentalStartDate: cartItem.rentalStartDate,
        rentalEndDate: cartItem.rentalEndDate,
        rentalDays: cartItem.rentalDays,
        rentalPricePerDay: cartItem.type === 'rental' ? cartItem.price : null
      }, { transaction: t });

      orderItems.push(orderItem);

      // Update product stock
      if (cartItem.type === 'purchase') {
        await cartItem.product.decrement('stockQuantity', { 
          by: cartItem.quantity,
          transaction: t 
        });
        
        await cartItem.product.increment('soldCount', { 
          by: cartItem.quantity,
          transaction: t 
        });
      } else {
        // For rentals, we'll manage availability separately
        await cartItem.product.increment('rentCount', { 
          by: 1,
          transaction: t 
        });
      }
    }

    // Clear cart
    await CartItem.destroy({
      where: { cartId: cart.id },
      transaction: t
    });

    await cart.update({
      totalItems: 0,
      subtotal: 0
    }, { transaction: t });

    await t.commit();

    // Send confirmation email
    try {
      const user = await User.findByPk(req.user.userId);
      const emailContent = emailTemplates.orderConfirmation({
        ...order.toJSON(),
        items: orderItems,
        user
      });
      
      await sendEmail({
        to: user.email,
        ...emailContent
      });
    } catch (emailError) {
      console.error('Order confirmation email error:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order }
    });

  } catch (error) {
    await t.rollback();
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
});

// Get user's orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { 
      status, 
      type,
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      order = 'DESC'
    } = req.query;

    const where = { userId: req.user.userId };
    
    if (status) where.status = status;
    if (type) where.type = type;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: CampingProduct,
          as: 'product',
          attributes: ['id', 'name', 'slug', 'mainImage']
        }]
      }],
      order: [[sortBy, order]],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// Get single order
router.get('/:orderNumber', authenticateToken, async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const order = await Order.findOne({
      where: { 
        orderNumber,
        userId: req.user.userId 
      },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{
            model: CampingProduct,
            as: 'product',
            attributes: ['id', 'name', 'slug', 'mainImage', 'brand']
          }]
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'fullName', 'phone']
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: { order }
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
});

// Cancel order
router.post('/:orderNumber/cancel', 
  authenticateToken,
  body('reason').optional().trim(),
  async (req, res) => {
    const t = await sequelize.transaction();
    
    try {
      const { orderNumber } = req.params;
      const { reason } = req.body;

      const order = await Order.findOne({
        where: { 
          orderNumber,
          userId: req.user.userId 
        },
        include: [{
          model: OrderItem,
          as: 'items',
          include: [{
            model: CampingProduct,
            as: 'product'
          }]
        }],
        transaction: t
      });

      if (!order) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Check if order can be cancelled
      if (!['pending', 'confirmed'].includes(order.status)) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: 'Order cannot be cancelled at this stage'
        });
      }

      // Restore stock
      for (const item of order.items) {
        if (item.type === 'purchase') {
          await item.product.increment('stockQuantity', { 
            by: item.quantity,
            transaction: t 
          });
          
          await item.product.decrement('soldCount', { 
            by: item.quantity,
            transaction: t 
          });
        }
      }

      // Update order
      await order.update({
        status: 'cancelled',
        cancelReason: reason,
        cancelledAt: new Date()
      }, { transaction: t });

      // Handle refund if payment was made
      if (order.paymentStatus === 'completed') {
        await order.update({
          paymentStatus: 'refunded'
        }, { transaction: t });
        
        // TODO: Process actual refund through payment gateway
      }

      await t.commit();

      res.json({
        success: true,
        message: 'Order cancelled successfully',
        data: { order }
      });

    } catch (error) {
      await t.rollback();
      console.error('Cancel order error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cancel order'
      });
    }
});

// Admin routes
// Get all orders (admin)
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const {
      status,
      type,
      paymentStatus,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      order = 'DESC'
    } = req.query;

    const where = {};
    
    if (status) where.status = status;
    if (type) where.type = type;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    if (search) {
      where[Op.or] = [
        { orderNumber: { [Op.like]: `%${search}%` } },
        { shippingFullName: { [Op.like]: `%${search}%` } },
        { shippingPhone: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'fullName']
        },
        {
          model: OrderItem,
          as: 'items'
        }
      ],
      order: [[sortBy, order]],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Admin get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// Update order status (admin)
router.patch('/admin/:orderNumber/status', 
  authenticateAdmin,
  body('status').isIn(['confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
  async (req, res) => {
    try {
      const { orderNumber } = req.params;
      const { status } = req.body;

      const order = await Order.findOne({
        where: { orderNumber },
        include: [{
          model: User,
          as: 'user'
        }]
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      const updateData = { status };

      // Update timestamps based on status
      switch (status) {
        case 'confirmed':
          updateData.confirmedAt = new Date();
          break;
        case 'shipped':
          updateData.shippedAt = new Date();
          break;
        case 'delivered':
          updateData.deliveredAt = new Date();
          if (order.paymentMethod === 'cod') {
            updateData.paymentStatus = 'completed';
            updateData.paidAt = new Date();
          }
          break;
        case 'cancelled':
          updateData.cancelledAt = new Date();
          break;
      }

      await order.update(updateData);

      // Send status update email
      try {
        await sendEmail({
          to: order.user.email,
          subject: `Order ${orderNumber} - Status Updated`,
          html: `
            <h2>Order Status Update</h2>
            <p>Your order ${orderNumber} status has been updated to: <strong>${status}</strong></p>
            <p>Track your order in your account dashboard.</p>
          `
        });
      } catch (emailError) {
        console.error('Status update email error:', emailError);
      }

      res.json({
        success: true,
        message: 'Order status updated',
        data: { order }
      });

    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update order status'
      });
    }
});

// Update rental return status (admin)
router.patch('/admin/:orderNumber/rental-return', 
  authenticateAdmin,
  [
    body('returnCondition').optional().trim(),
    body('damageNotes').optional().trim(),
    body('damageFee').optional().isFloat({ min: 0 })
  ],
  async (req, res) => {
    const t = await sequelize.transaction();
    
    try {
      const { orderNumber } = req.params;
      const { returnCondition, damageNotes, damageFee } = req.body;

      const order = await Order.findOne({
        where: { orderNumber, type: 'rental' },
        include: [{
          model: OrderItem,
          as: 'items',
          where: { type: 'rental' }
        }],
        transaction: t
      });

      if (!order) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: 'Rental order not found'
        });
      }

      // Update rental status
      await order.update({
        rentalStatus: 'returned'
      }, { transaction: t });

      // Update return info for items
      for (const item of order.items) {
        await item.update({
          returnDate: new Date(),
          returnCondition,
          damageNotes,
          damageFee: damageFee || 0
        }, { transaction: t });
      }

      // Handle deposit refund
      if (order.depositStatus === 'paid') {
        const totalDamageFee = damageFee || 0;
        const refundAmount = order.rentalDeposit - totalDamageFee;
        
        await order.update({
          depositStatus: refundAmount === order.rentalDeposit ? 'refunded' : 'partially-refunded'
        }, { transaction: t });
      }

      await t.commit();

      res.json({
        success: true,
        message: 'Rental return processed',
        data: { order }
      });

    } catch (error) {
      await t.rollback();
      console.error('Process rental return error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process rental return'
      });
    }
});

module.exports = router;