exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE TABLE "Amenity" (
      "AmenityID" SERIAL PRIMARY KEY,
      "AmenityName" VARCHAR(50)
    );
  `);
};

exports.down = function (knex) {
  return knex.schema.raw('DROP TABLE "Amenity";');
};
