const { getKnex } = require('./db.js');

const getAllGuests = async () => {
    const knex = getKnex();
    try {
        const guests = await knex('Guest')
            .select(
                'GuestID',
                'CustomerID',
                'FirstName',
                'MiddleName',
                'LastName',
                'DateOfBirth',
                'IDNumber',
                'GuardianIDNumber'
            );
        return { success: true, data: guests };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const getGuestsByBookingId = async (bookingId) => {
    const knex = getKnex();
    try {
        const guests = await knex('Guest')
            .join('BookingDetail', 'Guest.GuestID', '=', 'BookingDetail.GuestID')
            .select(
                'Guest.GuestID',
                'Guest.CustomerID',
                'Guest.FirstName',
                'Guest.MiddleName',
                'Guest.LastName',
                'Guest.DateOfBirth',
                'Guest.IDNumber',
                'Guest.GuardianIDNumber'
            )
            .distinct()
            .where('BookingDetail.BookingID', bookingId);
        return { success: true, data: guests };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const createGuest = async (guestData) => {
    const knex = getKnex();
    try {
        const [guest] = await knex('Guest')
            .insert(guestData)
            .returning('*');
        return { success: true, data: guest };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

module.exports = {
    getAllGuests,
    createGuest,
    getGuestsByBookingId
};
