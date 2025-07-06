export default {
  async up(db, client) {
    await db.collection("manufacturers").insertMany([
      { name: "NatureHike" },
      { name: "Coleman" },
      { name: "MSR" },
      { name: "Nike" },
      { name: "Adidas" },
      { name: "New Balance" },
      { name: "The North Face" },
      { name: "Patagonia" },
      { name: "Columbia" },
      { name: "Stanley" },
      { name: "Knipex" },
      { name: "Channellock" },
    ]);
  },
};