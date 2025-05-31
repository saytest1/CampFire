exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE TABLE "Service" (
      "ServiceID" SERIAL PRIMARY KEY,
      "ServiceName" VARCHAR(100),
      "ServiceType" VARCHAR(50),
      "Unit" VARCHAR(20),
      "UnitPrice" NUMERIC(10, 2) DEFAULT 0 CHECK ("UnitPrice" >= 0),
      "Description" TEXT
    );
  `);
};

exports.down = function (knex) {
  return knex.schema.raw('DROP TABLE "Service";');
};
  