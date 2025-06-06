const Router = require('restify-router').Router;
const router = new Router();
const { Product } = require('../models');

router.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.send(200, products);
    } catch (err) {
        res.send(500, { error: 'Lỗi server khi lấy danh sách products' });
    }
});

module.exports = router;