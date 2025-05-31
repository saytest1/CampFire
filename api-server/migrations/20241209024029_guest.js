exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE TABLE "Guest" (
      "GuestID" SERIAL PRIMARY KEY,
      "CustomerID" INTEGER REFERENCES "Customer"("CustomerID"),
      "FirstName" VARCHAR(50),
      "MiddleName" VARCHAR(50),
      "LastName" VARCHAR(50),
      "DateOfBirth" DATE CHECK ("DateOfBirth" <= CURRENT_DATE),
      "IDNumber" CHAR(15) UNIQUE,
      "GuardianIDNumber" CHAR(15)
    );
  `);
};

exports.down = function (knex) {
  return knex.schema.raw('DROP TABLE "Guest";');
};
