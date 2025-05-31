exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE TABLE "Shift" (
      "ShiftID" SERIAL PRIMARY KEY,
      "EmployeeID" INTEGER REFERENCES "Employee"("EmployeeID"),
      "StartTime" TIMESTAMP,
      "EndTime" TIMESTAMP CHECK ("StartTime" < "EndTime")
    );
  `);
};

exports.down = function (knex) {
  return knex.schema.raw('DROP TABLE "Shift";');
};
