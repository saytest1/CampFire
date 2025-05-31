exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE TABLE "ReceptionistLanguages" (
      "ReceptionistID" INTEGER REFERENCES "Receptionist"("ReceptionistID"),
      "Language" VARCHAR(50),
      PRIMARY KEY ("ReceptionistID", "Language")
    );
  `);
};

exports.down = function (knex) {
  return knex.schema.raw('DROP TABLE "ReceptionistLanguages";');
};
