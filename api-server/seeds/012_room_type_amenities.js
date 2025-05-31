exports.seed = async function (knex) {
  await knex("RoomTypeAmenities").del();
  await knex("RoomTypeAmenities").insert([
    { RoomTypeID: 1, AmenityID: 1 }, // Single Room: WiFi, Hairdryer
    { RoomTypeID: 1, AmenityID: 3 },
    
    { RoomTypeID: 2, AmenityID: 1 }, // Double Room: WiFi, Fridge, Hairdryer
    { RoomTypeID: 2, AmenityID: 2 },
    { RoomTypeID: 2, AmenityID: 3 },
    
    { RoomTypeID: 3, AmenityID: 1 }, // Twin Room: WiFi, Fridge, Hairdryer
    { RoomTypeID: 3, AmenityID: 2 },
    { RoomTypeID: 3, AmenityID: 3 },
    
    { RoomTypeID: 4, AmenityID: 1 }, // King Room: All amenities
    { RoomTypeID: 4, AmenityID: 2 },
    { RoomTypeID: 4, AmenityID: 3 },
    { RoomTypeID: 4, AmenityID: 4 },
    
    { RoomTypeID: 5, AmenityID: 1 }, // Family Room: All amenities
    { RoomTypeID: 5, AmenityID: 2 },
    { RoomTypeID: 5, AmenityID: 3 },
    { RoomTypeID: 5, AmenityID: 4 },
    
    { RoomTypeID: 6, AmenityID: 1 }, // Deluxe Room: All amenities
    { RoomTypeID: 6, AmenityID: 2 },
    { RoomTypeID: 6, AmenityID: 3 },
    { RoomTypeID: 6, AmenityID: 4 }
  ]);
};
