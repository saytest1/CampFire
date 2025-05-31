exports.seed = async function (knex) {
  await knex("PriceHistory").del();
  await knex("PriceHistory").insert([
    {
      RoomTypeID: 1,
      Price: 100.0,
      EffectiveDate: "2024-12-01"
    },
    {
      RoomTypeID: 2,
      Price: 150.0,
      EffectiveDate: "2024-12-01"
    },
    {
      RoomTypeID: 3,
      Price: 120.0,
      EffectiveDate: "2024-12-01"
    },
    {
      RoomTypeID: 4,
      Price: 200.0,
      EffectiveDate: "2024-12-01"
    },
    {
      RoomTypeID: 5,
      Price: 250.0,
      EffectiveDate: "2024-12-01"
    },
    {
      RoomTypeID: 6,
      Price: 300.0,
      EffectiveDate: "2024-12-01"
    }
  ]);
};
