const Router = require('restify-router').Router;
const router = new Router();
const { authenticated } = require('./middleware/authenticate');
const { authorized } = require('./middleware/authorize');
const { validated } = require('./middleware/validated');
const {sign} = require('./middleware/authenticate');
const Account = require('../models/account');
var jwt = require('jsonwebtoken');

router.post('/api/register', async (req, res) => {
    try {
        const { FirstName, LastName, Username, Phone, Password } = req.body;
        const result = await Account.register(FirstName, LastName, Username, Phone, Password);

        if (result.success) {
            res.send({
                success: true,
                code: 201,
                message: 'Account registered successfully',
                data: result.data
            });
        } else {
            res.send({
                success: false,
                code: 400,
                message: result.message
            });
        }
    } catch (error) {
        res.send({
            success: false,
            code: 500,
            message: 'Internal Server Error',
            error: error.message
        });
    }
});

router.post('/api/login', async (req, res) => {
    var {username = "", password = ""} = req.body;

    if ((username.length == 0) || (password.length == 0)) {
        res.send({
            success: false,
            code: 401,
            message: "Invalid username or password"
        })
    }

    const result = await Account.login(username, password);

    if (result.success) {
        res.send({
            success: true,
            code: 200,
            message: "Login successfully",
            token: result.token,
            customerID: result.customerID,
            role: result.role
        })
    } else {
        res.send({
            success: false,
            code: 401,
            message: "Invalid username or password"
        });
    }
});


router.get('/api/account/:customerID', async (req, res) => {
    try {
        const customerId = parseInt(req.params.customerID);
        const result = await Account.getCustomerAccount(customerId);
        
        if (result.data) {
            res.send(200, {
                success: true,
                data: result.data
            });
        } else {
            res.send(404, {
                success: false,
                message: 'Customer not found'
            });
        }
    } catch (error) {
        res.send(500, {
            success: false,
            message: error.message
        });
    }
});

router.patch('/api/account/:customerID', async (req, res) => {
    try {
        const customerId = parseInt(req.params.customerID);
        const result = await Account.updateCustomerAccount(customerId, req.body);
        
        res.send(200, {
            success: true,
            data: result.data
        });
    } catch (error) {
        res.send(500, {
            success: false,
            message: error.message
        });
    }
});

router.del('/api/account/:customerID', async (req, res) => {
    try {
        const customerId = parseInt(req.params.customerID);
        await Account.deleteCustomerAccount(customerId);
        
        res.send(200, {
            success: true,
            message: 'Customer account deleted successfully'
        });
    } catch (error) {
        res.send(500, {
            success: false,
            message: error.message
        });
    }
});


module.exports = router;