exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE TABLE "RoomTypeAmenities" (
      "RoomTypeID" INTEGER REFERENCES "RoomType"("RoomTypeID"),
      "AmenityID" INTEGER REFERENCES "Amenity"("AmenityID"),
      PRIMARY KEY ("RoomTypeID", "AmenityID")
    );
  `);
};


exports.down = function (knex) {
  return knex.schema.raw('DROP TABLE "RoomTypeAmenities";');
};
