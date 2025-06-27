// routes/products.js
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { CampingProduct, Category, Review, sequelize } = require('../models');
const { authenticateAdmin, optionalAuth } = require('./middleware/auth');
const { upload } = require('../utils/upload');
const { body, query, validationResult } = require('express-validator');

// Get all products with filters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      order = 'DESC',
      page = 1,
      limit = 12,
      featured,
      bestSeller,
      newArrival,
      forRent
    } = req.query;

    // Build where clause
    const where = { isActive: true };

    if (category) {
      where.categoryId = category;
    }

    if (brand) {
      where.brand = brand;
    }

    if (minPrice || maxPrice) {
      where.salePrice = {};
      if (minPrice) where.salePrice[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.salePrice[Op.lte] = parseFloat(maxPrice);
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { brand: { [Op.like]: `%${search}%` } }
      ];
    }

    if (featured === 'true') where.isFeatured = true;
    if (bestSeller === 'true') where.isBestSeller = true;
    if (newArrival === 'true') where.isNewArrival = true;
    if (forRent === 'true') where.isAvailableForRent = true;

    // Calculate offset
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Get products with pagination
    const { count, rows: products } = await CampingProduct.findAndCountAll({
      where,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: Review,
          as: 'reviews',
          attributes: [],
          required: false
        }
      ],
      attributes: {
        include: [
          // Calculate average rating
          [
            sequelize.fn('AVG', sequelize.col('reviews.rating')),
            'averageRating'
          ],
          [
            sequelize.fn('COUNT', sequelize.col('reviews.id')),
            'reviewCount'
          ]
        ]
      },
      group: ['CampingProduct.id', 'category.id'],
      order: [[sortBy, order]],
      limit: parseInt(limit),
      offset,
      subQuery: false
    });

    // Track view if user is logged in
    if (req.user && products.length > 0) {
      // Log product impressions for recommendation engine
      // This could be done asynchronously
    }

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total: count.length, // Because of GROUP BY
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count.length / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
});

// Get single product
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await CampingProduct.findOne({
      where: { slug, isActive: true },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug', 'description']
        },
        {
          model: Review,
          as: 'reviews',
          include: [{
            model: require('../models').User,
            as: 'user',
            attributes: ['id', 'fullName']
          }],
          where: { isApproved: true },
          required: false,
          order: [['createdAt', 'DESC']],
          limit: 10
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment view count
    await product.increment('viewCount');

    // Calculate review stats
    const reviewStats = await Review.findOne({
      where: { productId: product.id, isApproved: true },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN rating = 5 THEN 1 ELSE 0 END')), 'fiveStars'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN rating = 4 THEN 1 ELSE 0 END')), 'fourStars'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN rating = 3 THEN 1 ELSE 0 END')), 'threeStars'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN rating = 2 THEN 1 ELSE 0 END')), 'twoStars'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN rating = 1 THEN 1 ELSE 0 END')), 'oneStar']
      ]
    });

    // Get related products
    const relatedProducts = await CampingProduct.findAll({
      where: {
        categoryId: product.categoryId,
        id: { [Op.ne]: product.id },
        isActive: true
      },
      limit: 4,
      order: sequelize.random()
    });

    res.json({
      success: true,
      data: {
        product: product.toJSON(),
        reviewStats: reviewStats || {
          averageRating: 0,
          totalReviews: 0,
          fiveStars: 0,
          fourStars: 0,
          threeStars: 0,
          twoStars: 0,
          oneStar: 0
        },
        relatedProducts
      }
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
});

// Get brands
router.get('/filters/brands', async (req, res) => {
  try {
    const brands = await CampingProduct.findAll({
      where: { isActive: true },
      attributes: [
        'brand',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['brand'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
    });

    res.json({
      success: true,
      data: { brands }
    });

  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch brands'
    });
  }
});

// Admin routes
// Create product
router.post('/', 
  authenticateAdmin,
  upload.array('images', 10),
  [
    body('name').notEmpty().trim(),
    body('description').notEmpty(),
    body('categoryId').isInt(),
    body('brand').notEmpty().trim(),
    body('salePrice').isFloat({ min: 0 }),
    body('stockQuantity').isInt({ min: 0 })
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

      const productData = {
        ...req.body,
        adminId: req.admin.id
      };

      // Handle images
      if (req.files && req.files.length > 0) {
        productData.mainImage = `/uploads/products/${req.files[0].filename}`;
        productData.images = req.files.map(file => `/uploads/products/${file.filename}`);
      }

      // Parse JSON fields
      if (productData.features) {
        productData.features = JSON.parse(productData.features);
      }
      if (productData.specifications) {
        productData.specifications = JSON.parse(productData.specifications);
      }

      const product = await CampingProduct.create(productData);

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: { product }
      });

    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create product'
      });
    }
});

// Update product
router.put('/:id',
  authenticateAdmin,
  upload.array('images', 10),
  async (req, res) => {
    try {
      const { id } = req.params;
      
      const product = await CampingProduct.findByPk(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      const updateData = { ...req.body };

      // Handle new images
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => `/uploads/products/${file.filename}`);
        
        // If main image is being replaced
        if (req.body.replaceMainImage === 'true') {
          updateData.mainImage = newImages[0];
          updateData.images = [...newImages, ...(product.images || [])];
        } else {
          updateData.images = [...(product.images || []), ...newImages];
        }
      }

      // Parse JSON fields
      if (updateData.features && typeof updateData.features === 'string') {
        updateData.features = JSON.parse(updateData.features);
      }
      if (updateData.specifications && typeof updateData.specifications === 'string') {
        updateData.specifications = JSON.parse(updateData.specifications);
      }

      await product.update(updateData);

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: { product }
      });

    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update product'
      });
    }
});

// Delete product
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await CampingProduct.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Soft delete
    await product.update({ isActive: false });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
});

// Toggle product status (featured, bestseller, etc)
router.patch('/:id/toggle/:field', authenticateAdmin, async (req, res) => {
  try {
    const { id, field } = req.params;
    const allowedFields = ['isFeatured', 'isBestSeller', 'isNewArrival', 'isAvailableForRent', 'isActive'];
    
    if (!allowedFields.includes(field)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid field'
      });
    }

    const product = await CampingProduct.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.update({ [field]: !product[field] });

    res.json({
      success: true,
      message: `Product ${field} toggled successfully`,
      data: { [field]: product[field] }
    });

  } catch (error) {
    console.error('Toggle product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle product status'
    });
  }
});

module.exports = router;