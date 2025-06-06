// api-server/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const { Product, Category } = require('../models');
const { authenticateToken, authorizeAdmin } = require('../middlewares/auth');

// GET /products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, as: 'category' },
        { model: require('../models').Admin, as: 'admin', attributes: ['id', 'username', 'email'] }
      ]
    });
    return res.json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /products/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id, {
      include: [
        { model: Category, as: 'category' },
        { model: require('../models').Admin, as: 'admin', attributes: ['id', 'username'] }
      ]
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /products
router.post(
  '/',
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    const { name, description, price, stock_quantity, category_id, image_url, is_active } = req.body;
    try {
      const adminId = req.admin.id;
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(400).json({ message: 'Invalid category_id' });
      }

      const newProduct = await Product.create({
        name,
        description,
        price,
        stock_quantity,
        category_id,
        image_url,
        is_active: is_active !== undefined ? is_active : true,
        admin_id: adminId
      });
      return res.status(201).json(newProduct);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

// PUT /products/:id
router.put(
  '/:id',
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock_quantity, category_id, image_url, is_active } = req.body;
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      await product.update({
        name: name !== undefined ? name : product.name,
        description: description !== undefined ? description : product.description,
        price: price !== undefined ? price : product.price,
        stock_quantity: stock_quantity !== undefined ? stock_quantity : product.stock_quantity,
        category_id: category_id !== undefined ? category_id : product.category_id,
        image_url: image_url !== undefined ? image_url : product.image_url,
        is_active: is_active !== undefined ? is_active : product.is_active,
        admin_id: req.admin.id
      });

      return res.json(product);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

// DELETE /products/:id
router.delete(
  '/:id',
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    const { id } = req.params;
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      await product.destroy();
      return res.json({ message: 'Product deleted successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
