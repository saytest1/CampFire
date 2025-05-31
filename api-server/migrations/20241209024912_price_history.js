exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE TABLE "PriceHistory" (
      "PriceHistoryID" SERIAL PRIMARY KEY,
      "RoomTypeID" INTEGER REFERENCES "RoomType"("RoomTypeID"),
      "Price" NUMERIC(10, 2) CHECK ("Price" > 0),
      "EffectiveDate" DATE CHECK ("EffectiveDate" <= CURRENT_DATE)
    );
  `);
};

exports.down = function (knex) {
  return knex.schema.raw('DROP TABLE "PriceHistory";');
};
