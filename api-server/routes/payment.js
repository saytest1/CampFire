const Router = require('restify-router').Router;
const router = new Router();
const Payment = require('../models/payment');

router.get('/api/payments', async (req, res) => {
    try {
        const result = await Payment.getAllPayments();
        if (result.success) {
            res.send(200, {
                success: true,
                data: result.data
            });
        } else {
            res.send(500, {
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        res.send(500, {
            success: false,
            message: error.message
        });
    }
});

router.get('/api/payments/booking/:bookingId', async (req, res) => {
    try {
        const bookingId = parseInt(req.params.bookingId);
        const result = await Payment.getPaymentByBookingId(bookingId);
        if (result.success) {
            res.send(200, {
                success: true,
                data: result.data
            });
        } else {
            res.send(500, {
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        res.send(500, {
            success: false,
            message: error.message
        });
    }
});

router.post('/api/payments', async (req, res) => {
    try {
        const result = await Payment.createPayment(req.body);
        if (result.success) {
            res.send(201, {
                success: true,
                data: result.data
            });
        } else {
            res.send(400, {
                success: false,
                message: result.message
            });
        }
    } catch (error) {
        res.send(500, {
            success: false,
            message: error.message
        });
    }
});


module.exports = router;
