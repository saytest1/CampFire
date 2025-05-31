const Router = require('restify-router').Router;
const router = new Router();
const { authenticated } = require('./middleware/authenticate');
const { authorized } = require('./middleware/authorize');
const { validated } = require('./middleware/validated');
const Booking = require('../models/booking');

router.get('/api/booking/customer/:id', async (req, res) => {
    try {
        const customerId = parseInt(req.params.id);
        const result = await Booking.getCustomerBookings(customerId);
        
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

router.get('/api/booking/:bookingId/details', async (req, res) => {
    try {
        const bookingId = parseInt(req.params.bookingId);
        const result = await Booking.getBookingDetailsById(bookingId);
        
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

router.get('/api/booking/history/:customerId', async (req, res) => {
    try {
        const customerId = parseInt(req.params.customerId);
        const result = await Booking.getCustomerBookingHistory(customerId);
        
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

// router.post('/api/bookinginitial', async (req, res) => {
//     try {
//         const { CustomerID } = req.body;
//         const result = await Booking.createInitialBooking(CustomerID);
        
//         if (result.success) {
//             res.send(201, {
//                 success: true,
//                 data: result.data
//             });
//         } else {
//             res.send(400, {
//                 success: false,
//                 message: result.message
//             });
//         }
//     } catch (error) {
//         res.send(500, {
//             success: false,
//             message: error.message
//         });
//     }
// });

// router.patch('/api/bookinginitial/:bookingId', async (req, res) => {
//     try {
//         const bookingId = parseInt(req.params.bookingId);
//         const result = await Booking.updateBookingInitial(bookingId, req.body);
        
//         if (result.success) {
//             res.send(200, {
//                 success: true,
//                 data: result.data
//             });
//         } else {
//             res.send(400, {
//                 success: false,
//                 message: result.message
//             });
//         }
//     } catch (error) {
//         res.send(500, {
//             success: false,
//             message: error.message
//         });
//     }
// });

router.post('/api/booking/:bookingId/detail', async (req, res) => {
    try {
        const bookingId = parseInt(req.params.bookingId);
        const bookingDetailData = {
            BookingID: bookingId,
            RoomID: req.body.RoomID,
            GuestID: req.body.GuestID
        };
        
        const result = await Booking.createBookingDetail(bookingDetailData);
        
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

router.del('/api/booking/detail/:bookingDetailId', async (req, res) => {
    try {
        const bookingDetailId = parseInt(req.params.bookingDetailId);
        const result = await Booking.deleteBookingDetail(bookingDetailId);
        
        if (result.success) {
            res.send(200, {
                success: true,
                message: "Booking detail deleted successfully"
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

router.post('/api/booking', async (req, res) => {
    try {
        const result = await Booking.createBooking(req.body);
        
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

router.del('/api/booking/:bookingId', async (req, res) => {
    try {
        const bookingId = parseInt(req.params.bookingId);
        const result = await Booking.deleteBooking(bookingId);
        
        if (result.success) {
            res.send(200, {
                success: true,
                message: "Booking deleted successfully"
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

router.patch('/api/booking/:bookingId', async (req, res) => {
    try {
        const bookingId = parseInt(req.params.bookingId);
        const result = await Booking.updateBooking(bookingId, req.body);
        
        if (result.success) {
            res.send(200, {
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