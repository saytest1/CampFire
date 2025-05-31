const Router = require('restify-router').Router;
const router = new Router();
const { authenticated } = require('./middleware/authenticate');
const { authorized } = require('./middleware/authorize');
const { validated } = require('./middleware/validated');

const Customer = require('../models/customer');

// Endpoint GET /customer - Lấy danh sách khách hàng
router.get('/api/customer', async (req, res) => {
    try {
        const result = await Customer.getOne(req);

        if (result.length > 0) {
            res.send({
                success: true,
                code: 200,
                data: result,
            });
        } else {
            res.send({
                success: true,
                code: 404,
                message: 'No customers found',
            });
        }
    } catch (error) {
        res.send({
            success: false,
            code: 500,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
});

module.exports = router;