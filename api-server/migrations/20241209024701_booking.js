exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE TABLE "Booking" (
      "BookingID" SERIAL PRIMARY KEY,
      "CustomerID" INTEGER REFERENCES "Customer"("CustomerID"),
      "EmployeeID" INTEGER REFERENCES "Employee"("EmployeeID"),
      "BookingDate" DATE,
      "CheckInDate" DATE CHECK ("CheckInDate" <= "CheckOutDate"),
      "CheckOutDate" DATE,
      "TotalAmount" NUMERIC(10, 2) DEFAULT 0 CHECK ("TotalAmount" >= 0),
      "Status" VARCHAR(15) CHECK ("Status" IN ('Confirmed', 'Cancelled', 'Completed')),
      "PaymentStatus" VARCHAR(10) CHECK ("PaymentStatus" IN ('Paid', 'Unpaid'))
    );
  `);
};

exports.down = function (knex) {
  return knex.schema.raw('DROP TABLE "Booking";');
};
