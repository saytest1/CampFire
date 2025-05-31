exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE TABLE "Manager" (
      "ManagerID" INTEGER PRIMARY KEY REFERENCES "Employee"("EmployeeID"),
      "YearsOfExperience" INTEGER DEFAULT 0 CHECK ("YearsOfExperience" >= 0)
    );
  `);
};

exports.down = function (knex) {
  return knex.schema.raw('DROP TABLE "Manager";');
};
