exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE TABLE "Account" (
      "AccountID" SERIAL PRIMARY KEY,
      "FirstName" VARCHAR(50),
      "MiddleName" VARCHAR(50),
      "LastName" VARCHAR(50),
      "Username" VARCHAR(50) UNIQUE CHECK (LENGTH("Username") >= 5),
      "Status" VARCHAR(10) CHECK ("Status" IN ('Active', 'Locked')),
      "DateOfBirth" DATE CHECK ("DateOfBirth" <= CURRENT_DATE),
      "Gender" CHAR(1) CHECK ("Gender" IN ('M', 'F', 'O')),
      "Email" VARCHAR(100) UNIQUE CHECK ("Email" ~ '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
      "Phone" VARCHAR(15) CHECK ("Phone" ~ '[0-9]+'),
      "Address" TEXT,
      "IDNumber" CHAR(15) UNIQUE,
      "Role" VARCHAR(20)
    );
  `);
};

exports.down = function (knex) {
  return knex.schema.raw('DROP TABLE "Account";');
};
