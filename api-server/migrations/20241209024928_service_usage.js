exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE TABLE "ServiceUsage" (
      "ServiceUsageID" SERIAL PRIMARY KEY,
      "BookingDetailID" INTEGER REFERENCES "BookingDetail"("BookingDetailID"),
      "ServiceID" INTEGER REFERENCES "Service"("ServiceID"),
      "Amount" INTEGER DEFAULT 1 CHECK ("Amount" > 0),
      "UsageDate" DATE
    );
  `);
};

exports.down = function (knex) {
  return knex.schema.raw('DROP TABLE "ServiceUsage";');
};
