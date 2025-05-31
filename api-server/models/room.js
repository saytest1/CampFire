const {getPgClient, getKnex} = require('./db.js');
const _ = require('lodash');
var format = require('pg-format');

const baseUrl = 'http://10.11.10.13/api';

const getAllRooms = async () => {
    const knex = getKnex();
    try {
        const rooms = await knex('Room')
            .join('RoomType', 'Room.RoomTypeID', '=', 'RoomType.RoomTypeID')
            .leftJoin('RoomTypeAmenities', 'RoomType.RoomTypeID', '=', 'RoomTypeAmenities.RoomTypeID')
            .leftJoin('Amenity', 'RoomTypeAmenities.AmenityID', '=', 'Amenity.AmenityID')
            .leftJoin('RoomTypeImages', 'RoomType.RoomTypeID', '=', 'RoomTypeImages.RoomTypeID')
            .select(
                'Room.RoomID',
                'Room.RoomNumber',
                'Room.Status',
                'RoomType.TypeName',
                'RoomType.BasePrice',
                'RoomType.MaxOccupancy',
                'RoomType.Area',
                knex.raw('array_agg(DISTINCT "Amenity"."AmenityName") as amenities'),
                knex.raw(`array_agg(DISTINCT
                    CASE 
                        WHEN "RoomTypeImages"."ImagePath" IS NOT NULL 
                        THEN concat('${baseUrl}/uploads/', "RoomTypeImages"."ImagePath")
                        ELSE NULL 
                    END
                ) as images`)
            )
            .groupBy(
                'Room.RoomID',
                'Room.RoomNumber',
                'Room.Status',
                'RoomType.TypeName',
                'RoomType.BasePrice',
                'RoomType.MaxOccupancy',
                'RoomType.Area'
            );

        return { success: true, data: rooms };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const getRoomById = async (roomId) => {
    const knex = getKnex();
    try {
        const room = await knex('Room')
            .join('RoomType', 'Room.RoomTypeID', '=', 'RoomType.RoomTypeID')
            .leftJoin('RoomTypeAmenities', 'RoomType.RoomTypeID', '=', 'RoomTypeAmenities.RoomTypeID')
            .leftJoin('Amenity', 'RoomTypeAmenities.AmenityID', '=', 'Amenity.AmenityID')
            .leftJoin('RoomTypeImages', 'RoomType.RoomTypeID', '=', 'RoomTypeImages.RoomTypeID')
            .select(
                'Room.RoomID',
                'Room.RoomNumber',
                'Room.Status',
                'RoomType.TypeName',
                'RoomType.BasePrice',
                'RoomType.MaxOccupancy',
                'RoomType.Area',
                knex.raw('array_agg(DISTINCT "Amenity"."AmenityName") as amenities'),
                knex.raw(`array_agg(DISTINCT
                    CASE 
                        WHEN "RoomTypeImages"."ImagePath" IS NOT NULL 
                        THEN concat('${baseUrl}/uploads/', "RoomTypeImages"."ImagePath")
                        ELSE NULL 
                    END
                ) as images`)
            )
            .where('Room.RoomID', roomId)
            .groupBy(
                'Room.RoomID',
                'Room.RoomNumber',
                'Room.Status',
                'RoomType.TypeName',
                'RoomType.BasePrice',
                'RoomType.MaxOccupancy',
                'RoomType.Area'
            )
            .first();

        if (!room) {
            return { success: false, message: 'Room not found' };
        }

        return { success: true, data: room };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const getRoomTypes = async () => {
    const knex = getKnex();
    try {
        const roomTypes = await knex('RoomType')
            .leftJoin('RoomTypeImages', 'RoomType.RoomTypeID', '=', 'RoomTypeImages.RoomTypeID')
            .select(
                'RoomType.RoomTypeID',
                'RoomType.TypeName',
                'RoomType.BasePrice',
                'RoomType.MaxOccupancy',
                'RoomType.Area',
                knex.raw(`array_agg(
                    CASE 
                        WHEN "RoomTypeImages"."ImagePath" IS NOT NULL 
                        THEN concat('${baseUrl}/uploads/', "RoomTypeImages"."ImagePath")
                        ELSE NULL 
                    END
                ) as images`)
            )
            .groupBy(
                'RoomType.RoomTypeID',
                'RoomType.TypeName',
                'RoomType.BasePrice', 
                'RoomType.MaxOccupancy',
                'RoomType.Area'
            );

        return { success: true, data: roomTypes };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

module.exports = {
    getAllRooms,
    getRoomById,
    getRoomTypes
}