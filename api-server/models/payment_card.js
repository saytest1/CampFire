const { getKnex } = require('./db.js');

const getCustomerCards = async (customerId) => {
    const knex = getKnex();
    const cards = await knex('PaymentCard')
        .select('CardID', 'EncryptedCardNumber', 'BankName', 'ExpiryDate')
        .where('CustomerID', customerId);
    return { success: true, data: cards };
};

const addCustomerCard = async (customerId, cardData) => {
    const knex = getKnex();
    const [card] = await knex('PaymentCard')
        .insert({
            CustomerID: customerId,
            EncryptedCardNumber: cardData.cardNumber,
            BankName: cardData.bankName,
            ExpiryDate: cardData.expiryDate
        })
        .returning(['CardID', 'EncryptedCardNumber', 'BankName', 'ExpiryDate']);
    return { success: true, data: card };
};

const updateCustomerCard = async (customerId, cardId, cardData) => {
    const knex = getKnex();
    const [card] = await knex('PaymentCard')
        .where({ 
            CardID: cardId,
            CustomerID: customerId 
        })
        .update({
            EncryptedCardNumber: cardData.cardNumber,
            BankName: cardData.bankName,
            ExpiryDate: cardData.expiryDate
        })
        .returning(['CardID', 'EncryptedCardNumber', 'BankName', 'ExpiryDate']);
    return { success: true, data: card };
};

const deleteCustomerCard = async (customerId, cardId) => {
    const knex = getKnex();
    await knex('PaymentCard')
        .where({ 
            CardID: cardId,
            CustomerID: customerId 
        })
        .del();
    return { success: true };
};

module.exports = {
    getCustomerCards,
    addCustomerCard,
    updateCustomerCard,
    deleteCustomerCard
};
