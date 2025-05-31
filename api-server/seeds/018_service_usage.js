exports.seed = async function (knex) {
  await knex("ServiceUsage").del();
  await knex("ServiceUsage").insert([
    {
      BookingDetailID: 1,
      ServiceID: 1, // Laundry
      Amount: 2,
      UsageDate: "2024-12-10"
    },
    {
      BookingDetailID: 2,
      ServiceID: 2, // In-room dining
      Amount: 1,
      UsageDate: "2024-12-11"
    },
    {
      BookingDetailID: 3,
      ServiceID: 3, // Spa treatments
      Amount: 1,
      UsageDate: "2024-12-12"
    },
    {
      BookingDetailID: 4,
      ServiceID: 4, // Airport shuttle
      Amount: 2,
      UsageDate: "2024-12-13"
    },
    {
      BookingDetailID: 5,
      ServiceID: 5, // Bike Rentals
      Amount: 1,
      UsageDate: "2024-12-14"
    }
  ]);
};
