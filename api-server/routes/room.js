var Router = require('restify-router').Router;
const router = new Router();
var format = require('pg-format');
var {authenticated} = require('./middleware/authenticate'); 
const {authorized} = require('./middleware/authorize');
const {validated} = require('./middleware/validated');
const Room = require('../models/room');
const {getPgClient} = require('../models/db')

router.get('/api/room', async (req, res) => {
    try {
        const result = await Room.getAllRooms();
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

router.get('/api/room/:id', async (req, res) => {
    try {
        const roomId = parseInt(req.params.id);
        const result = await Room.getRoomById(roomId);
        
        if (result.success) {
            res.send(200, {
                success: true,
                data: result.data
            });
        } else {
            res.send(404, {
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

router.get('/api/roomtypes', async (req, res) => {
    try {
        const result = await Room.getRoomTypes();
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


module.exports = router;
