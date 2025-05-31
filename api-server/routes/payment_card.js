const Router = require('restify-router').Router;
const router = new Router();
const PaymentCard = require('../models/payment_card');

router.get('/api/paymentcard/customer/:id', async (req, res) => {
    try {
        const customerId = parseInt(req.params.id);
        const result = await PaymentCard.getCustomerCards(customerId);
        res.send(200, { success: true, data: result.data });
    } catch (error) {
        res.send(500, { success: false, message: error.message });
    }
});

router.post('/api/paymentcard/customer/:id', async (req, res) => {
    try {
        const customerId = parseInt(req.params.id);
        const result = await PaymentCard.addCustomerCard(customerId, req.body);
        res.send(201, { success: true, data: result.data });
    } catch (error) {
        res.send(500, { success: false, message: error.message });
    }
});

router.patch('/api/paymentcard/customer/:id/:cardId', async (req, res) => {
    try {
        const customerId = parseInt(req.params.id);
        const cardId = parseInt(req.params.cardId);
        const result = await PaymentCard.updateCustomerCard(customerId, cardId, req.body);
        res.send(200, { success: true, data: result.data });
    } catch (error) {
        res.send(500, { success: false, message: error.message });
    }
});

router.del('/api/paymentcard/customer/:id/:cardId', async (req, res) => {
    try {
        const customerId = parseInt(req.params.id);
        const cardId = parseInt(req.params.cardId);
        await PaymentCard.deleteCustomerCard(customerId, cardId);
        res.send(200, { success: true, message: 'Card deleted successfully' });
    } catch (error) {
        res.send(500, { success: false, message: error.message });
    }
});

module.exports = router;
