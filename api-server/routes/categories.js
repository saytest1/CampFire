const Router = require('restify-router').Router;
const router = new Router();
const { Category } = require('../models');

router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.send(200, categories);
    } catch (err) {
        res.send(500, { error: 'Lỗi server khi lấy danh sách categories' });
    }
});

module.exports = router;