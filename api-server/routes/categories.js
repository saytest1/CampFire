// routes/categories.js
const express = require('express');
const router = express.Router();
const { Category, CampingProduct, sequelize } = require('../models');
const { authenticateAdmin } = require('./middleware/auth');
const { upload } = require('../utils/upload');
const { body, validationResult } = require('express-validator');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const { 
      includeInactive = false,
      parentId,
      featured
    } = req.query;

    const where = {};
    
    if (!includeInactive || includeInactive === 'false') {
      where.isActive = true;
    }
    
    if (parentId !== undefined) {
      where.parentId = parentId === 'null' ? null : parentId;
    }
    
    if (featured === 'true') {
      where.isFeatured = true;
    }

    const categories = await Category.findAll({
      where,
      include: [
        {
          model: Category,
          as: 'subcategories',
          where: { isActive: true },
          required: false
        },
        {
          model: CampingProduct,
          as: 'products',
          attributes: [],
          required: false
        }
      ],
      attributes: {
        include: [
          [
            sequelize.fn('COUNT', sequelize.col('products.id')),
            'productCount'
          ]
        ]
      },
      group: ['Category.id', 'subcategories.id'],
      order: [['displayOrder', 'ASC'], ['name', 'ASC']]
    });

    res.json({
      success: true,
      data: { categories }
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

// Get category tree (hierarchical structure)
router.get('/tree', async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { 
        isActive: true,
        parentId: null 
      },
      include: [{
        model: Category,
        as: 'subcategories',
        where: { isActive: true },
        required: false,
        include: [{
          model: Category,
          as: 'subcategories',
          where: { isActive: true },
          required: false
        }]
      }],
      order: [
        ['displayOrder', 'ASC'],
        ['name', 'ASC'],
        ['subcategories', 'displayOrder', 'ASC'],
        ['subcategories', 'name', 'ASC']
      ]
    });

    res.json({
      success: true,
      data: { categories }
    });

  } catch (error) {
    console.error('Get category tree error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category tree'
    });
  }
});

// Get single category
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({
      where: { slug, isActive: true },
      include: [
        {
          model: Category,
          as: 'parent',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: Category,
          as: 'subcategories',
          where: { isActive: true },
          required: false
        }
      ]
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get breadcrumb path
    const breadcrumbs = [];
    let currentCategory = category;
    
    while (currentCategory) {
      breadcrumbs.unshift({
        id: currentCategory.id,
        name: currentCategory.name,
        slug: currentCategory.slug
      });
      currentCategory = currentCategory.parent;
    }

    // Get product count
    const productCount = await CampingProduct.count({
      where: { 
        categoryId: category.id,
        isActive: true 
      }
    });

    res.json({
      success: true,
      data: { 
        category: {
          ...category.toJSON(),
          productCount
        },
        breadcrumbs
      }
    });

  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category'
    });
  }
});

// Admin routes
// Create category
router.post('/', 
  authenticateAdmin,
  upload.single('image'),
  [
    body('name').notEmpty().trim(),
    body('description').optional().trim(),
    body('parentId').optional().isInt(),
    body('displayOrder').optional().isInt()
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

      const categoryData = {
        ...req.body,
        adminId: req.admin.id
      };

      // Handle image upload
      if (req.file) {
        categoryData.imageUrl = `/uploads/categories/${req.file.filename}`;
      }

      // Check if parent exists
      if (categoryData.parentId) {
        const parent = await Category.findByPk(categoryData.parentId);
        if (!parent) {
          return res.status(400).json({
            success: false,
            message: 'Parent category not found'
          });
        }
      }

      const category = await Category.create(categoryData);

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: { category }
      });

    } catch (error) {
      console.error('Create category error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create category'
      });
    }
});

// Update category
router.put('/:id',
  authenticateAdmin,
  upload.single('image'),
  [
    body('name').optional().trim(),
    body('description').optional().trim(),
    body('parentId').optional().isInt(),
    body('displayOrder').optional().isInt()
  ],
  async (req, res) => {
    try {
      const { id } = req.params;
      
      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      const updateData = { ...req.body };

      // Handle image upload
      if (req.file) {
        updateData.imageUrl = `/uploads/categories/${req.file.filename}`;
      }

      // Check for circular reference
      if (updateData.parentId) {
        if (updateData.parentId == id) {
          return res.status(400).json({
            success: false,
            message: 'Category cannot be its own parent'
          });
        }

        // Check if new parent is a descendant
        const isDescendant = async (catId, targetId) => {
          const cat = await Category.findByPk(catId, {
            include: [{
              model: Category,
              as: 'subcategories'
            }]
          });
          
          if (!cat) return false;
          
          for (const sub of cat.subcategories) {
            if (sub.id == targetId) return true;
            if (await isDescendant(sub.id, targetId)) return true;
          }
          
          return false;
        };

        if (await isDescendant(id, updateData.parentId)) {
          return res.status(400).json({
            success: false,
            message: 'Cannot set descendant as parent'
          });
        }
      }

      await category.update(updateData);

      res.json({
        success: true,
        message: 'Category updated successfully',
        data: { category }
      });

    } catch (error) {
      console.error('Update category error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update category'
      });
    }
});

// Delete category
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findByPk(id, {
      include: [{
        model: Category,
        as: 'subcategories'
      }]
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has subcategories
    if (category.subcategories.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with subcategories'
      });
    }

    // Check if category has products
    const productCount = await CampingProduct.count({
      where: { categoryId: id }
    });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with products'
      });
    }

    // Soft delete
    await category.update({ isActive: false });

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category'
    });
  }
});

// Toggle category status
router.patch('/:id/toggle/:field', authenticateAdmin, async (req, res) => {
  try {
    const { id, field } = req.params;
    const allowedFields = ['isActive', 'isFeatured'];
    
    if (!allowedFields.includes(field)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid field'
      });
    }

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    await category.update({ [field]: !category[field] });

    res.json({
      success: true,
      message: `Category ${field} toggled successfully`,
      data: { [field]: category[field] }
    });

  } catch (error) {
    console.error('Toggle category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle category status'
    });
  }
});

// Reorder categories
router.post('/reorder', authenticateAdmin, async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const { categories } = req.body; // Array of { id, displayOrder }

    if (!Array.isArray(categories)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Categories array required'
      });
    }

    for (const cat of categories) {
      await Category.update(
        { displayOrder: cat.displayOrder },
        { 
          where: { id: cat.id },
          transaction: t 
        }
      );
    }

    await t.commit();

    res.json({
      success: true,
      message: 'Categories reordered successfully'
    });

  } catch (error) {
    await t.rollback();
    console.error('Reorder categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder categories'
    });
  }
});

module.exports = router;