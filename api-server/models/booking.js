// test/api-server/models/booking.js
const { getKnex } = require('./db.js');
const { rowFilter } = require('./security/row.js');
const { columnFilter } = require('./security/column.js');

const getCustomerBookings = async (customerId) => {
    const knex = getKnex();
    try {
        const bookings = await knex('Booking')
            .leftJoin('BookingDetail', 'Booking.BookingID', '=', 'BookingDetail.BookingID')
            .leftJoin('Room', 'BookingDetail.RoomID', '=', 'Room.RoomID')
            .leftJoin('RoomType', 'Room.RoomTypeID', '=', 'RoomType.RoomTypeID')
            .leftJoin('Guest', 'BookingDetail.GuestID', '=', 'Guest.GuestID')
            .join('Customer', 'Booking.CustomerID', '=', 'Customer.CustomerID')
            .join('Account', 'Customer.AccountID', '=', 'Account.AccountID')
            .select(
                'Booking.BookingID',
                'Account.FirstName',
                'Account.MiddleName',
                'Account.LastName',
                'Customer.CustomerID',
                'Booking.BookingDate',
                'Booking.CheckInDate',
                'Booking.CheckOutDate',
                'Booking.TotalAmount',
                'Booking.Status',
                'Booking.PaymentStatus',
                knex.raw(`
                    COALESCE(json_agg(
                        CASE WHEN "Guest"."GuestID" IS NOT NULL THEN
                            json_build_object(
                                'GuestID', "Guest"."GuestID",
                                'FirstName', "Guest"."FirstName",
                                'MiddleName', "Guest"."MiddleName",
                                'LastName', "Guest"."LastName",
                                'DateOfBirth', "Guest"."DateOfBirth",
                                'IDNumber', "Guest"."IDNumber",
                                'GuardianIDNumber', "Guest"."GuardianIDNumber"
                            )
                        ELSE NULL END
                    ) FILTER (WHERE "Guest"."GuestID" IS NOT NULL), '[]') as guests
                `)
            )
            .where('Booking.CustomerID', customerId)
            .groupBy(
                'Booking.BookingID',
                'Account.FirstName',
                'Account.MiddleName',
                'Account.LastName',
                'Customer.CustomerID'
            )
            .orderBy('Booking.BookingDate', 'desc');

        return { success: true, data: bookings };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const getBookingDetailsById = async (bookingId) => {
    const knex = getKnex();
    try {
        const bookingDetails = await knex('BookingDetail')
            .join('Room', 'BookingDetail.RoomID', '=', 'Room.RoomID')
            .join('Guest', 'BookingDetail.GuestID', '=', 'Guest.GuestID')
            .join('RoomType', 'Room.RoomTypeID', '=', 'RoomType.RoomTypeID')
            .where('BookingDetail.BookingID', bookingId)
            .select(
                'BookingDetail.BookingDetailID',
                'BookingDetail.BookingID',
                'Room.RoomNumber',
                'RoomType.TypeName',
                'RoomType.BasePrice',
                'Guest.FirstName',
                'Guest.LastName',
                'Guest.IDNumber'
            );

        return { success: true, data: bookingDetails };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const getCustomerBookingHistory = async (customerId) => {
    const knex = getKnex();
    try {
        const bookings = await knex('Booking')
            .join('BookingDetail', 'Booking.BookingID', '=', 'BookingDetail.BookingID')
            .join('Room', 'BookingDetail.RoomID', '=', 'Room.RoomID')
            .join('RoomType', 'Room.RoomTypeID', '=', 'RoomType.RoomTypeID')
            .leftJoin('ServiceUsage', 'BookingDetail.BookingDetailID', '=', 'ServiceUsage.BookingDetailID')
            .leftJoin('Service', 'ServiceUsage.ServiceID', '=', 'Service.ServiceID')
            .where('Booking.CustomerID', customerId)
            .select(
                'Booking.BookingID',
                'Booking.PaymentStatus',
                'Booking.BookingDate',
                'Booking.CheckInDate',
                'Booking.CheckOutDate',
                'RoomType.TypeName',
                'RoomType.BasePrice',
                knex.raw('COUNT(DISTINCT "BookingDetail"."GuestID") as total_guests'),
                knex.raw(`DATE_PART('day', "CheckOutDate"::timestamp - "CheckInDate"::timestamp) as total_nights`),
                knex.raw(`
                    json_agg(DISTINCT jsonb_build_object(
                        'ServiceName', "Service"."ServiceName",
                        'UnitPrice', "Service"."UnitPrice"
                    )) as services
                `),
                knex.raw(`
                    "RoomType"."BasePrice" * 
                    DATE_PART('day', "CheckOutDate"::timestamp - "CheckInDate"::timestamp) +
                    COALESCE(SUM(DISTINCT "Service"."UnitPrice"), 0) as total_price
                `)
            )
            .groupBy(
                'Booking.BookingID',
                'Booking.PaymentStatus',
                'Booking.BookingDate',
                'Booking.CheckInDate',
                'Booking.CheckOutDate',
                'RoomType.TypeName',
                'RoomType.BasePrice'
            )
            .orderBy('Booking.BookingDate', 'desc');

        return { success: true, data: bookings };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// const createInitialBooking = async (customerID) => {
//     const knex = getKnex();
//     try {
//         const [booking] = await knex('Booking')
//             .insert({
//                 CustomerID: customerID,
//                 BookingDate: knex.fn.now(),
//                 Status: 'Confirmed',
//                 PaymentStatus: 'Unpaid'
//             })
//             .returning('*');

//         return { success: true, data: booking };
//     } catch (error) {
//         return { success: false, message: error.message };
//     }
// };

const createBooking = async (bookingData) => {
    const knex = getKnex();
    try {
        const result = await knex.transaction(async (trx) => {
            const [booking] = await trx('Booking')
                .insert({
                    CustomerID: bookingData.CustomerID,
                    EmployeeID: bookingData.EmployeeID || null,
                    BookingDate: knex.fn.now(),
                    CheckInDate: bookingData.CheckInDate || null,
                    CheckOutDate: bookingData.CheckOutDate || null,
                    Status: 'Confirmed',
                    PaymentStatus: 'Unpaid'
                })
                .returning('*');

            await trx.raw('SELECT calculate_booking_total_cost(?)', [booking.BookingID]);

            return booking;
        });

        return { success: true, data: result };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// const updateBookingInitial = async (bookingId, bookingData) => {
//     const knex = getKnex();
//     try {
//         const [updatedBooking] = await knex('Booking')
//             .where('BookingID', bookingId)
//             .update({
//                 EmployeeID: bookingData.EmployeeID,
//                 CheckInDate: bookingData.CheckInDate,
//                 CheckOutDate: bookingData.CheckOutDate,
//                 TotalAmount: bookingData.TotalAmount,
//                 PaymentStatus: "Paid"
//             })
//             .returning('*');

//         return { success: true, data: updatedBooking };
//     } catch (error) {
//         return { success: false, message: error.message };
//     }
// };

const updateBooking = async (bookingId, bookingData) => {
    const knex = getKnex();
    try {
        const [updatedBooking] = await knex('Booking')
            .where('BookingID', bookingId)
            .update({
                EmployeeID: bookingData.EmployeeID,
                CheckInDate: bookingData.CheckInDate ? new Date(bookingData.CheckInDate) : null,
                CheckOutDate: bookingData.CheckOutDate ? new Date(bookingData.CheckOutDate) : null,
                Status: bookingData.Status,
                PaymentStatus: bookingData.PaymentStatus
            })
            .returning('*');

        await knex.raw('SELECT calculate_booking_total_cost(?)', [bookingId]);

        return { success: true, data: updatedBooking };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const createBookingDetail = async (bookingDetailData) => {
    const knex = getKnex();
    try {
        const [bookingDetail] = await knex('BookingDetail')
            .insert({
                BookingID: bookingDetailData.BookingID,
                RoomID: bookingDetailData.RoomID,
                GuestID: bookingDetailData.GuestID
            })
            .returning('*');

        return { success: true, data: bookingDetail };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const deleteBookingDetail = async (bookingDetailId) => {
    const knex = getKnex();
    try {
        await knex('BookingDetail')
            .where('BookingDetailID', bookingDetailId)
            .del();

        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const deleteBooking = async (bookingId) => {
    const knex = getKnex();
    try {
        await knex.transaction(async (trx) => {
            // Delete all booking details first
            await trx('BookingDetail')
                .where('BookingID', bookingId)
                .del();

            // Then delete the booking
            await trx('Booking')
                .where('BookingID', bookingId)
                .del();
        });

        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

module.exports = {
    getCustomerBookings,
    getBookingDetailsById,
    getCustomerBookingHistory,
    // createInitialBooking,
    updateBooking,
    createBookingDetail,
    deleteBookingDetail,
    createBooking,
    deleteBooking,
    // updateBookingInitial
};