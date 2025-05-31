exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE TABLE "RoomTypeImages" (
      "RoomTypeID" INTEGER REFERENCES "RoomType"("RoomTypeID"),
      "ImagePath" VARCHAR(255),
      PRIMARY KEY ("RoomTypeID", "ImagePath")
    );
  `);
};

exports.down = function (knex) {
  return knex.schema.raw('DROP TABLE "RoomTypeImages";');
};
  