// routes/reviews.js
const express = require('express');
const router = express.Router();
const { Review, User, CampingProduct, Order, OrderItem } = require('../models');
const { authenticateToken, optionalAuth, authenticateAdmin } = require('./middleware/auth');
const { upload } = require('../utils/upload');
const { body, validationResult } = require('express-validator');

// Get reviews for a product
router.get('/product/:productId', optionalAuth, async (req, res) => {
  try {
    const { productId } = req.params;
    const { 
      page = 1, 
      limit = 10,
      rating,
      verified,
      sortBy = 'createdAt',
      order = 'DESC'
    } = req.query;

    const where = { 
      productId,
      isApproved: true 
    };

    if (rating) where.rating = rating;
    if (verified === 'true') where.isVerifiedPurchase = true;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: reviews } = await Review.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'avatarUrl']
      }],
      order: [
        sortBy === 'helpful' ? ['helpfulCount', 'DESC'] : [sortBy, order]
      ],
      limit: parseInt(limit),
      offset
    });

    // If user is logged in, check which reviews they found helpful
    let userHelpfulReviews = [];
    if (req.user) {
      // This would require a ReviewHelpful table to track
      // For now, we'll skip this feature
    }

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
});

// Create review
router.post('/', 
  authenticateToken,
  upload.array('images', 5),
  [
    body('productId').isInt(),
    body('orderId').optional().isInt(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('title').optional().trim().isLength({ max: 200 }),
    body('comment').notEmpty().trim(),
    body('pros').optional().trim(),
    body('cons').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const { productId, orderId, rating, title, comment, pros, cons } = req.body;

      // Check if product exists
      const product = await CampingProduct.findByPk(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Check if user already reviewed this product
      const existingReview = await Review.findOne({
        where: {
          userId: req.user.userId,
          productId
        }
      });

      if (existingReview) {
        return res.status(400).json({
          success: false,
          message: 'You have already reviewed this product'
        });
      }

      // Verify purchase if orderId provided
      let isVerifiedPurchase = false;
      if (orderId) {
        const order = await Order.findOne({
          where: {
            id: orderId,
            userId: req.user.userId,
            status: 'delivered'
          },
          include: [{
            model: OrderItem,
            as: 'items',
            where: { productId }
          }]
        });

        if (order) {
          isVerifiedPurchase = true;
        }
      }

      // Handle images
      let images = [];
      if (req.files && req.files.length > 0) {
        images = req.files.map(file => `/uploads/reviews/${file.filename}`);
      }

      // Create review
      const review = await Review.create({
        userId: req.user.userId,
        productId,
        orderId: isVerifiedPurchase ? orderId : null,
        rating,
        title,
        comment,
        pros,
        cons,
        images,
        isVerifiedPurchase,
        isApproved: true // Auto-approve for now, can add moderation later
      });

      // Get review with user info
      const reviewWithUser = await Review.findByPk(review.id, {
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'avatarUrl']
        }]
      });

      res.status(201).json({
        success: true,
        message: 'Review submitted successfully',
        data: { review: reviewWithUser }
      });

    } catch (error) {
      console.error('Create review error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit review'
      });
    }
});

// Update review
router.put('/:id',
  authenticateToken,
  upload.array('images', 5),
  [
    body('rating').optional().isInt({ min: 1, max: 5 }),
    body('title').optional().trim().isLength({ max: 200 }),
    body('comment').optional().notEmpty().trim(),
    body('pros').optional().trim(),
    body('cons').optional().trim()
  ],
  async (req, res) => {
    try {
      const { id } = req.params;
      
      const review = await Review.findOne({
        where: { 
          id,
          userId: req.user.userId 
        }
      });

      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      const updateData = { ...req.body };

      // Handle new images
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => `/uploads/reviews/${file.filename}`);
        updateData.images = [...(review.images || []), ...newImages];
      }

      // Remove images if specified
      if (req.body.removeImages) {
        const removeImages = JSON.parse(req.body.removeImages);
        updateData.images = review.images.filter(img => !removeImages.includes(img));
      }

      await review.update(updateData);

      const updatedReview = await Review.findByPk(review.id, {
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'avatarUrl']
        }]
      });

      res.json({
        success: true,
        message: 'Review updated successfully',
        data: { review: updatedReview }
      });

    } catch (error) {
      console.error('Update review error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update review'
      });
    }
});

// Delete review
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const review = await Review.findOne({
      where: { 
        id,
        userId: req.user.userId 
      }
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.destroy();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review'
    });
  }
});

// Mark review as helpful
router.post('/:id/helpful', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // In a real app, you'd track who marked it helpful
    // to prevent multiple votes from same user
    await review.increment('helpfulCount');

    res.json({
      success: true,
      message: 'Review marked as helpful',
      data: { helpfulCount: review.helpfulCount + 1 }
    });

  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark review as helpful'
    });
  }
});

// Admin routes
// Get all reviews (admin)
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const {
      isApproved,
      productId,
      userId,
      rating,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      order = 'DESC'
    } = req.query;

    const where = {};
    
    if (isApproved !== undefined) where.isApproved = isApproved === 'true';
    if (productId) where.productId = productId;
    if (userId) where.userId = userId;
    if (rating) where.rating = rating;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: reviews } = await Review.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'fullName']
        },
        {
          model: CampingProduct,
          as: 'product',
          attributes: ['id', 'name', 'slug']
        }
      ],
      order: [[sortBy, order]],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Admin get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
});

// Approve/reject review (admin)
router.patch('/admin/:id/approve', 
  authenticateAdmin,
  body('isApproved').isBoolean(),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { isApproved } = req.body;
      
      const review = await Review.findByPk(id);
      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      await review.update({ isApproved });

      res.json({
        success: true,
        message: `Review ${isApproved ? 'approved' : 'rejected'}`,
        data: { review }
      });

    } catch (error) {
      console.error('Approve review error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update review status'
      });
    }
});

// Add admin response (admin)
router.post('/admin/:id/response', 
  authenticateAdmin,
  body('adminResponse').notEmpty().trim(),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { adminResponse } = req.body;
      
      const review = await Review.findByPk(id, {
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'fullName']
        }]
      });

      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      await review.update({
        adminResponse,
        adminResponseAt: new Date()
      });

      res.json({
        success: true,
        message: 'Admin response added',
        data: { review }
      });

    } catch (error) {
      console.error('Add admin response error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add admin response'
      });
    }
});

module.exports = router;