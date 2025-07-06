export default {
  async up(db, client) {
    await db.collection("categories").insertMany([
      { name: "Tent" },
      { name: "Shoes" },
      { name: "Clothes" },
      { name: "Pliers" },
    ]);
  },
};