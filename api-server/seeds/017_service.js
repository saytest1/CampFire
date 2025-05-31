exports.seed = async function (knex) {
  await knex("Service").del();
  await knex("Service").insert([
    {
      ServiceName: "Laundry",
      ServiceType: "Laundry",
      Unit: "Load",
      UnitPrice: 25.0,
      Description: "Professional laundry and dry cleaning service"
    },
    {
      ServiceName: "In-room dining",
      ServiceType: "Food Service",
      Unit: "Order",
      UnitPrice: 35.0,
      Description: "24/7 room service dining"
    },
    {
      ServiceName: "Spa treatments",
      ServiceType: "Wellness",
      Unit: "Session",
      UnitPrice: 80.0,
      Description: "Massage and spa therapy services"
    },
    {
      ServiceName: "Airport shuttle",
      ServiceType: "Transportation",
      Unit: "Trip",
      UnitPrice: 30.0,
      Description: "Round-trip airport transfer service"
    },
    {
      ServiceName: "Bike Rentals",
      ServiceType: "Recreation",
      Unit: "Day",
      UnitPrice: 15.0,
      Description: "City bikes available for guest use"
    }
  ]);
};
