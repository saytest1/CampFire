var Router = require('restify-router').Router;
const router = new Router();
var {getPgClient} = require('../models/db');
const Service = require('../models/service');
const { authenticated } = require('./middleware/authenticate');
const { authorized } = require('./middleware/authorize');

router.get('/api/service', authenticated, authorized, async (req, res) => {
    try {
        const result = await Service.getAllServices();
        if (result.success) {
            res.send(200, {
                success: true,
                message: "Services retrieved successfully",
                data: result.data
            });
        } else {
            res.send(500, {
                success: false,
                message: "Failed to retrieve services"
            });
        }
    } catch (error) {
        res.send(500, {
            success: false,
            message: "Error retrieving services: " + error.message
        });
    }
});

router.get('/api/service/:id', authenticated, authorized, async (req, res) => {
    try {
        const serviceId = parseInt(req.params.id);
        const result = await Service.getServiceById(serviceId);
        if (result.success) {
            res.send(200, {
                success: true,
                message: "Service retrieved successfully",
                data: result.data
            });
        } else {
            res.send(404, {
                success: false,
                message: "Service not found"
            });
        }
    } catch (error) {
        res.send(500, {
            success: false,
            message: "Error retrieving service: " + error.message
        });
    }
});


router.post('/api/service', authenticated, authorized, async (req, res) => {
    try {
        const result = await Service.createService(req.body);
        if (result.success) {
            res.send(201, {
                success: true,
                message: "Service created successfully",
                data: result.data
            });
        } else {
            res.send(400, {
                success: false,
                message: "Failed to create service"
            });
        }
    } catch (error) {
        res.send(500, {
            success: false,
            message: "Error creating service: " + error.message
        });
    }
});

router.patch('/api/service/:id', authenticated, authorized, async (req, res) => {
    try {
        const serviceId = parseInt(req.params.id);
        const result = await Service.updateService(serviceId, req.body);
        if (result.success) {
            res.send(200, {
                success: true,
                message: "Service updated successfully",
                data: result.data
            });
        } else {
            res.send(400, {
                success: false,
                message: "Failed to update service"
            });
        }
    } catch (error) {
        res.send(500, {
            success: false,
            message: "Error updating service: " + error.message
        });
    }
});

router.del('/api/service/:id', authenticated, authorized, async (req, res) => {
    try {
        const serviceId = parseInt(req.params.id);
        const result = await Service.deleteService(serviceId);
        if (result.success) {
            res.send(200, {
                success: true,
                message: "Service deleted successfully"
            });
        } else {
            res.send(400, {
                success: false,
                message: "Failed to delete service"
            });
        }
    } catch (error) {
        res.send(500, {
            success: false,
            message: "Error deleting service: " + error.message
        });
    }
});

router.get('/api/service-usages', async (req, res) => {
    try {
        const result = await Service.getAllServiceUsages();
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

router.get('/api/service-usages/booking/:bookingId', async (req, res) => {
    try {
        const bookingId = parseInt(req.params.bookingId);
        const result = await Service.getServiceUsagesByBookingId(bookingId);
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

router.post('/api/service-usages', async (req, res) => {
    try {
        const result = await Service.createServiceUsage(req.body);
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
