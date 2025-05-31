exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE TABLE "RoomType" (
      "RoomTypeID" SERIAL PRIMARY KEY,
      "TypeName" VARCHAR(50),
      "BasePrice" NUMERIC(10, 2) CHECK ("BasePrice" > 0),
      "MaxOccupancy" INTEGER CHECK ("MaxOccupancy" > 0),
      "Area" NUMERIC(10, 2)
    );
  `);
};

exports.down = function (knex) {
  return knex.schema.raw('DROP TABLE "RoomType";');
};
