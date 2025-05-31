exports.seed = async function (knex) {
  await knex("PaymentCard").del();
  await knex("PaymentCard").insert([
    {
      CustomerID: 1,
      EncryptedCardNumber: "4111111111111111",
      BankName: "Techcombank",
      ExpiryDate: "2026-12-31"
    },
    {
      CustomerID: 2,
      EncryptedCardNumber: "5555555555554444",
      BankName: "Vietcombank",
      ExpiryDate: "2025-06-30"
    },
    {
      CustomerID: 3,
      EncryptedCardNumber: "6011111111111117",
      BankName: "ACB",
      ExpiryDate: "2027-09-15"
    }
  ]);
};
