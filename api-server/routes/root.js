// routes/root.js
const express = require('express');
const router = express.Router();
const { CampingProduct, Category, Order } = require('../models');
const { Op } = require('sequelize');

// API info
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'CampReady Rentals API',
    version: '1.0.0',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        profile: 'GET /api/auth/me',
        forgotPassword: 'POST /api/auth/forgot-password',
        resetPassword: 'POST /api/auth/reset-password'
      },
      products: {
        list: 'GET /api/products',
        detail: 'GET /api/products/:slug',
        brands: 'GET /api/products/filters/brands'
      },
      categories: {
        list: 'GET /api/categories',
        tree: 'GET /api/categories/tree',
        detail: 'GET /api/categories/:slug'
      },
      cart: {
        get: 'GET /api/cart',
        addItem: 'POST /api/cart/items',
        updateItem: 'PUT /api/cart/items/:itemId',
        removeItem: 'DELETE /api/cart/items/:itemId',
        clear: 'DELETE /api/cart'
      },
      orders: {
        create: 'POST /api/orders',
        list: 'GET /api/orders',
        detail: 'GET /api/orders/:orderNumber',
        cancel: 'POST /api/orders/:orderNumber/cancel'
      },
      reviews: {
        productReviews: 'GET /api/reviews/product/:productId',
        create: 'POST /api/reviews',
        update: 'PUT /api/reviews/:id',
        delete: 'DELETE /api/reviews/:id',
        markHelpful: 'POST /api/reviews/:id/helpful'
      },
      wishlist: {
        get: 'GET /api/wishlist',
        add: 'POST /api/wishlist/:productId',
        remove: 'DELETE /api/wishlist/:productId',
        check: 'POST /api/wishlist/check',
        clear: 'DELETE /api/wishlist'
      },
      users: {
        profile: 'GET /api/users/profile',
        updateProfile: 'PUT /api/users/profile',
        changePassword: 'POST /api/users/change-password',
        addresses: 'GET /api/users/addresses'
      },
      admin: {
        login: 'POST /api/admin/login',
        dashboard: 'GET /api/admin/dashboard',
        profile: 'GET /api/admin/profile'
      }
    }
  });
});

// Health check
router.get('/health', async (req, res) => {
  try {
    // Check database connection
    await require('../models').sequelize.authenticate();
    
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

// Homepage data
router.get('/homepage', async (req, res) => {
  try {
    const [
      featuredProducts,
      newArrivals,
      bestSellers,
      featuredCategories
    ] = await Promise.all([
      // Featured products
      CampingProduct.findAll({
        where: {
          isActive: true,
          isFeatured: true
        },
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }],
        limit: 8,
        order: [['createdAt', 'DESC']]
      }),
      
      // New arrivals
      CampingProduct.findAll({
        where: {
          isActive: true,
          isNewArrival: true
        },
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }],
        limit: 8,
        order: [['createdAt', 'DESC']]
      }),
      
      // Best sellers
      CampingProduct.findAll({
        where: {
          isActive: true,
          isBestSeller: true
        },
        include: [{
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }],
        limit: 8,
        order: [['soldCount', 'DESC']]
      }),
      
      // Featured categories
      Category.findAll({
        where: {
          isActive: true,
          isFeatured: true,
          parentId: null
        },
        limit: 6,
        order: [['displayOrder', 'ASC']]
      })
    ]);

    res.json({
      success: true,
      data: {
        featuredProducts,
        newArrivals,
        bestSellers,
        featuredCategories,
        banners: [
          {
            id: 1,
            title: 'Summer Camping Sale',
            subtitle: 'Up to 30% off on selected items',
            image: '/images/banners/summer-sale.jpg',
            link: '/products?sale=true',
            buttonText: 'Shop Now'
          },
          {
            id: 2,
            title: 'Rent Premium Gear',
            subtitle: 'Try before you buy with our rental service',
            image: '/images/banners/rental-service.jpg',
            link: '/products?forRent=true',
            buttonText: 'Browse Rentals'
          }
        ]
      }
    });

  } catch (error) {
    console.error('Homepage data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch homepage data'
    });
  }
});

// Search suggestions
router.get('/search/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: { suggestions: [] }
      });
    }

    const [products, categories] = await Promise.all([
      // Product suggestions
      CampingProduct.findAll({
        where: {
          isActive: true,
          name: { [Op.like]: `%${q}%` }
        },
        attributes: ['id', 'name', 'slug', 'mainImage', 'salePrice'],
        limit: 5
      }),
      
      // Category suggestions
      Category.findAll({
        where: {
          isActive: true,
          name: { [Op.like]: `%${q}%` }
        },
        attributes: ['id', 'name', 'slug'],
        limit: 3
      })
    ]);

    res.json({
      success: true,
      data: {
        suggestions: {
          products,
          categories
        }
      }
    });

  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch suggestions'
    });
  }
});

// Site statistics (public)
router.get('/stats', async (req, res) => {
  try {
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      totalCategories
    ] = await Promise.all([
      CampingProduct.count({ where: { isActive: true } }),
      Order.count({ where: { status: 'delivered' } }),
      require('../models').User.count({ where: { isActive: true } }),
      Category.count({ where: { isActive: true } })
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        happyCustomers: totalUsers,
        ordersCompleted: totalOrders,
        categories: totalCategories
      }
    });

  } catch (error) {
    console.error('Site stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

module.exports = router;