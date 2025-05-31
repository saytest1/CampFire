exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE TABLE "Payment" (
      "PaymentID" SERIAL PRIMARY KEY,
      "BookingID" INTEGER REFERENCES "Booking"("BookingID"),
      "Amount" NUMERIC(10, 2) CHECK ("Amount" > 0),
      "PaymentMethod" VARCHAR(20) CHECK ("PaymentMethod" IN ('Credit Card', 'Cash', 'Bank Transfer')),
      "TransactionNumber" VARCHAR(50),
      "PaymentDate" DATE
    );
  `);
};

exports.down = function (knex) {
  return knex.schema.raw('DROP TABLE "Payment";');
};
