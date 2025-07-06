export default {
  async up(db, client) {
    // 1. Fetch categories and manufacturers
    const categories = await db.collection("categories").find({}).toArray();
    const manufacturers = await db.collection("manufacturers").find({}).toArray();

    // 2. Create lookup maps
    const categoryMap = {};
    categories.forEach(cat => { categoryMap[cat.name] = cat._id; });

    const manufacturerMap = {};
    manufacturers.forEach(manu => { manufacturerMap[manu.name] = manu._id; });

    // 3. Define your products (add as many as you want)
    const products = [
      { name: "Naturehike Cloud Up 2", price: 54.23, categoryName: "Tent", manufacturerName: "NatureHike" },
      { name: "Coleman Sundome 4P", price: 92.11, categoryName: "Tent", manufacturerName: "Coleman" },
      { name: "MSR Hubba Hubba NX", price: 81.77, categoryName: "Tent", manufacturerName: "MSR" },
      { name: "Nike Air Zoom", price: 49.99, categoryName: "Shoes", manufacturerName: "Nike" },
      { name: "Adidas Ultraboost", price: 59.99, categoryName: "Shoes", manufacturerName: "Adidas" },
      { name: "New Balance 1080", price: 39.99, categoryName: "Shoes", manufacturerName: "New Balance" },
      { name: "The North Face Jacket", price: 79.99, categoryName: "Clothes", manufacturerName: "The North Face" },
      { name: "Patagonia Nano Puff", price: 89.99, categoryName: "Clothes", manufacturerName: "Patagonia" },
      { name: "Columbia Silver Ridge", price: 29.99, categoryName: "Clothes", manufacturerName: "Columbia" },
      { name: "Stanley 10-in-1", price: 19.99, categoryName: "Pliers", manufacturerName: "Stanley" },
      { name: "Knipex 10-in-1", price: 19.99, categoryName: "Pliers", manufacturerName: "Knipex" },
      { name: "Channellock 10-in-1", price: 19.99, categoryName: "Pliers", manufacturerName: "Channellock" },
    ];

    // 4. Map names to IDs for insertion
    const productsToInsert = products.map(p => ({
      name: p.name,
      price: p.price,
      categoryId: categoryMap[p.categoryName],
      manufacturerId: manufacturerMap[p.manufacturerName]
    }));

    // 5. Insert products
    await db.collection("products").insertMany(productsToInsert);
  },
};