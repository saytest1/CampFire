exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE TABLE "Employee" (
      "EmployeeID" SERIAL PRIMARY KEY,
      "AccountID" INTEGER REFERENCES "Account"("AccountID"),
      "HireDate" DATE,
      "Salary" NUMERIC(10, 2) CHECK ("Salary" > 0)
    );
  `);
};

exports.down = function (knex) {
  return knex.schema.raw('DROP TABLE "Employee";');
};
