// api-server/routes/categoryRoutes.js

const express = require('express');
const router = express.Router();
const { Category } = require('../models');
const { authenticateToken, authorizeAdmin } = require('../middlewares/auth');

// GET /categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: require('../models').Admin, as: 'admin', attributes: ['id', 'username'] }]
    });
    return res.json(categories);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /categories/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByPk(id, {
      include: [{ model: require('../models').Admin, as: 'admin', attributes: ['id', 'username'] }]
    });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    return res.json(category);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /categories
router.post(
  '/',
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    const { name, description, image_url, is_active } = req.body;
    try {
      const adminId = req.admin.id;

      const newCategory = await Category.create({
        name,
        description,
        image_url,
        is_active: is_active !== undefined ? is_active : true,
        admin_id: adminId
      });
      return res.status(201).json(newCategory);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

// PUT /categories/:id
router.put(
  '/:id',
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { name, description, image_url, is_active } = req.body;
    try {
      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      await category.update({
        name: name !== undefined ? name : category.name,
        description: description !== undefined ? description : category.description,
        image_url: image_url !== undefined ? image_url : category.image_url,
        is_active: is_active !== undefined ? is_active : category.is_active,
        admin_id: req.admin.id
      });

      return res.json(category);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

// DELETE /categories/:id
router.delete(
  '/:id',
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    const { id } = req.params;
    try {
      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      await category.destroy();
      return res.json({ message: 'Category deleted successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
