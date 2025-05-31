exports.seed = async function (knex) {
  await knex("Amenity").del();
  await knex("Amenity").insert([
    {AmenityName: "Wi-Fi" },
    {AmenityName: "Bathtub" },
    {AmenityName: "Fridge" },
    {AmenityName: "Hot Tub" }
  ]);
};
