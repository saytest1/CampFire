exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE TABLE "BookingDetail" (
      "BookingDetailID" SERIAL PRIMARY KEY,
      "BookingID" INTEGER REFERENCES "Booking"("BookingID"),
      "RoomID" INTEGER REFERENCES "Room"("RoomID"),
      "GuestID" INTEGER REFERENCES "Guest"("GuestID")
    );
  `);
};

exports.down = function (knex) {
  return knex.schema.raw('DROP TABLE "BookingDetail";');
};
