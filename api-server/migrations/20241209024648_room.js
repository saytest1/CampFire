exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE TABLE "Room" (
      "RoomID" SERIAL PRIMARY KEY,
      "RoomTypeID" INTEGER REFERENCES "RoomType"("RoomTypeID"),
      "RoomNumber" VARCHAR(10) UNIQUE,
      "Status" VARCHAR(15) CHECK ("Status" IN ('Available', 'Booked', 'Maintenance'))
    );
  `);
};

exports.down = function (knex) {
  return knex.schema.raw('DROP TABLE "Room";');
};
