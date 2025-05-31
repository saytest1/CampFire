const Router = require('restify-router').Router;
const router = new Router();
const { authenticated } = require('./middleware/authenticate');
const Guest = require('../models/guest');

router.get('/api/guests', async (req, res) => {
    try {
        const result = await Guest.getAllGuests();
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

router.get('/api/guests/booking/:bookingId', async (req, res) => {
    try {
        const bookingId = parseInt(req.params.bookingId);
        const result = await Guest.getGuestsByBookingId(bookingId);
        if (result.success) {
            res.send(200, {
                success: true,
                message: "Guests retrieved successfully",
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

router.post('/api/guests', async (req, res) => {
    try {
        const result = await Guest.createGuest(req.body);
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
