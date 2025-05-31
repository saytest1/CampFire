const { getKnex } = require('./db.js');

const getAllPayments = async () => {
    const knex = getKnex();
    try {
        const payments = await knex('Payment')
            .select(
                'PaymentID',
                'BookingID',
                'Amount',
                'PaymentMethod',
                'TransactionNumber',
                'PaymentDate'
            );
        return { success: true, data: payments };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const getPaymentByBookingId = async (bookingId) => {
    const knex = getKnex();
    try {
        const payment = await knex('Payment')
            .select(
                'PaymentID',
                'BookingID',
                'Amount',
                'PaymentMethod',
                'TransactionNumber',
                'PaymentDate'
            )
            .where('BookingID', bookingId);
        return { success: true, data: payment };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const createPayment = async (paymentData) => {
    const knex = getKnex();
    try {
        const [payment] = await knex('Payment')
            .insert({
                BookingID: paymentData.BookingID,
                Amount: paymentData.Amount,
                PaymentMethod: paymentData.PaymentMethod,
                TransactionNumber: paymentData.TransactionNumber,
                PaymentDate: paymentData.PaymentDate || knex.fn.now()
            })
            .returning('*');

        return { success: true, data: payment };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

module.exports = {
    getAllPayments,
    getPaymentByBookingId,
    createPayment
};

