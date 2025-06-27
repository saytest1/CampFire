// routes/wishlist.js
const express = require('express');
const router = express.Router();
const { Wishlist, CampingProduct, Category } = require('../models');
const { authenticateToken } = require('./middleware/auth');

// Get user's wishlist
router.get('/', authenticateToken, async (req, res) => {
  try {
    const wishlistItems = await Wishlist.findAll({
      where: { userId: req.user.userId },
      include: [{
        model: CampingProduct,
        as: 'product',
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: { 
        wishlist: wishlistItems,
        count: wishlistItems.length
      }
    });

  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist'
    });
  }
});

// Add to wishlist
router.post('/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if product exists
    const product = await CampingProduct.findByPk(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if already in wishlist
    const existing = await Wishlist.findOne({
      where: {
        userId: req.user.userId,
        productId
      }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    // Add to wishlist
    const wishlistItem = await Wishlist.create({
      userId: req.user.userId,
      productId
    });

    // Get with product details
    const item = await Wishlist.findByPk(wishlistItem.id, {
      include: [{
        model: CampingProduct,
        as: 'product',
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }]
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Added to wishlist',
      data: { wishlistItem: item }
    });

  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to wishlist'
    });
  }
});

// Remove from wishlist
router.delete('/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await Wishlist.destroy({
      where: {
        userId: req.user.userId,
        productId
      }
    });

    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not in wishlist'
      });
    }

    res.json({
      success: true,
      message: 'Removed from wishlist'
    });

  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove from wishlist'
    });
  }
});

// Check if products are in wishlist
router.post('/check', authenticateToken, async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!Array.isArray(productIds)) {
      return res.status(400).json({
        success: false,
        message: 'productIds must be an array'
      });
    }

    const wishlistItems = await Wishlist.findAll({
      where: {
        userId: req.user.userId,
        productId: productIds
      },
      attributes: ['productId']
    });

    const inWishlist = wishlistItems.map(item => item.productId);

    res.json({
      success: true,
      data: { inWishlist }
    });

  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check wishlist'
    });
  }
});

// Clear wishlist
router.delete('/', authenticateToken, async (req, res) => {
  try {
    await Wishlist.destroy({
      where: { userId: req.user.userId }
    });

    res.json({
      success: true,
      message: 'Wishlist cleared'
    });

  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear wishlist'
    });
  }
});

module.exports = router;