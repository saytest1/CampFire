exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE TABLE "Customer" (
      "CustomerID" SERIAL PRIMARY KEY,
      "AccountID" INTEGER REFERENCES "Account"("AccountID"),
      "RewardPoints" INTEGER DEFAULT 0 CHECK ("RewardPoints" >= 0)
    );
  `);
};

exports.down = function (knex) {
  return knex.schema.raw('DROP TABLE "Customer";');
};
