const {getPgClient, getKnex} = require('./db.js');

const getAllServices = async () => {
    const knex = getKnex();
    try {
        const services = await knex('Service')
            .select(
                'ServiceID',
                'ServiceName',
                'ServiceType',
                'Unit',
                'UnitPrice',
                'Description'
            );
        return { success: true, data: services };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const getServiceById = async (serviceId) => {
    const knex = getKnex();
    try {
        const service = await knex('Service')
            .select(
                'ServiceID',
                'ServiceName',
                'ServiceType',
                'Unit',
                'UnitPrice',
                'Description'
            )
            .where('ServiceID', serviceId)
            .first();
        return { success: true, data: service };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const createService = async (serviceData) => {
    const knex = getKnex();
    try {
        const [service] = await knex('Service')
            .insert(serviceData)
            .returning('*');
        return { success: true, data: service };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const updateService = async (serviceId, serviceData) => {
    const knex = getKnex();
    try {
        const [service] = await knex('Service')
            .where('ServiceID', serviceId)
            .update(serviceData)
            .returning('*');
        return { success: true, data: service };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const deleteService = async (serviceId) => {
    const knex = getKnex();
    try {
        await knex('Service')
            .where('ServiceID', serviceId)
            .del();
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const getAllServiceUsages = async () => {
    const knex = getKnex();
    try {
        const serviceUsages = await knex('ServiceUsage')
            .join('Service', 'ServiceUsage.ServiceID', '=', 'Service.ServiceID')
            .join('BookingDetail', 'ServiceUsage.BookingDetailID', '=', 'BookingDetail.BookingDetailID')
            .select(
                'ServiceUsage.ServiceUsageID',
                'ServiceUsage.BookingDetailID',
                'ServiceUsage.Amount',
                'ServiceUsage.UsageDate',
                'Service.ServiceName',
                'Service.ServiceType',
                'Service.Unit',
                'Service.UnitPrice',
                'BookingDetail.BookingID'
            );
        return { success: true, data: serviceUsages };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const getServiceUsagesByBookingId = async (bookingId) => {
    const knex = getKnex();
    try {
        const serviceUsages = await knex('ServiceUsage')
            .join('Service', 'ServiceUsage.ServiceID', '=', 'Service.ServiceID')
            .join('BookingDetail', 'ServiceUsage.BookingDetailID', '=', 'BookingDetail.BookingDetailID')
            .where('BookingDetail.BookingID', bookingId)
            .select(
                'Service.ServiceName',
                'Service.ServiceType',
                'Service.Unit',
                'Service.UnitPrice'
            )
            .distinct();
        return { success: true, data: serviceUsages };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const createServiceUsage = async (serviceUsageData) => {
    const knex = getKnex();
    try {
        const [serviceUsage] = await knex('ServiceUsage')
            .insert({
                BookingDetailID: serviceUsageData.BookingDetailID,
                ServiceID: serviceUsageData.ServiceID,
                Amount: serviceUsageData.Amount,
                UsageDate: serviceUsageData.UsageDate || knex.fn.now()
            })
            .returning('*');
        return { success: true, data: serviceUsage };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

module.exports = {
    getAllServices,
    getAllServiceUsages,
    getServiceUsagesByBookingId,
    createServiceUsage,
    createService,
    updateService,
    deleteService,
    getServiceById
}

