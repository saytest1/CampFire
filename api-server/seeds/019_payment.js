exports.seed = async function (knex) {
  await knex("Payment").del();
  await knex("Payment").insert([
    {
      BookingID: 1,
      Amount: 500.0,
      PaymentMethod: "Credit Card",
      TransactionNumber: "T123456789",
      PaymentDate: "2024-12-10"
    },
    {
      BookingID: 2,
      Amount: 600.0,
      PaymentMethod: "Cash",
      TransactionNumber: null,
      PaymentDate: "2024-12-12"
    },
    {
      BookingID: 3,
      Amount: 750.0,
      PaymentMethod: "Bank Transfer",
      TransactionNumber: "T246813579",
      PaymentDate: "2024-12-14"
    }
  ]);
};
