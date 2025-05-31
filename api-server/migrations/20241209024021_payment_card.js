exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE TABLE "PaymentCard" (
      "CardID" SERIAL PRIMARY KEY,
      "CustomerID" INTEGER REFERENCES "Customer"("CustomerID"),
      "EncryptedCardNumber" TEXT UNIQUE,
      "BankName" VARCHAR(50),
      "ExpiryDate" DATE CHECK ("ExpiryDate" > CURRENT_DATE)
    );
  `);
};


exports.down = function (knex) {
  return knex.schema.raw('DROP TABLE "PaymentCard";');
};
