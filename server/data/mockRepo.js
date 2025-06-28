const mockData = {
    categories: [
      { id: 1, name: "Tent" },
      { id: 2, name: "Shoes" },
      { id: 3, name: "Clothes" },
      { id: 4, name: "Pliers" },
    ],
    products: [
      { id: 1,  name: "Tent",   price: 100, manufacturer: "NatureHike" },
      { id: 2,  name: "Tent",   price: 100, manufacturer: "Coleman" },
      { id: 3,  name: "Tent",   price: 100, manufacturer: "MSR" },
      { id: 4,  name: "Shoes",  price: 50,  manufacturer: "Nike" },
      { id: 5,  name: "Shoes",  price: 50,  manufacturer: "Adidas" },
      { id: 6,  name: "Shoes",  price: 50,  manufacturer: "New Balance" },
      { id: 7,  name: "Clothes",price: 30,  manufacturer: "The North Face" },
      { id: 8,  name: "Clothes",price: 30,  manufacturer: "Patagonia" },
      { id: 9,  name: "Clothes",price: 30,  manufacturer: "Columbia" },
      { id: 10, name: "Pliers", price: 20,  manufacturer: "Stanley" },
      { id: 11, name: "Pliers", price: 20,  manufacturer: "Knipex" },
      { id: 12, name: "Pliers", price: 20,  manufacturer: "Channellock" },
    ],
 };

  const db = {
    categories: {
      getAll: () => mockData.categories,
      findById: (id) => mockData.categories.find((item) => item.id == id),
      create: (name) => {
        const newCategory = { id: mockData.categories.length + 1, name };
        mockData.categories.push(newCategory);
        return newCategory;
      },
      update: (id, input) => {
        const index = mockData.categories.findIndex((item) => item.id == id);
        if (index >= 0) {
            Object.keys(input).map((key) => {
              const value = input[key];
              mockData.categories[index][key] = value;
            });
            return mockData.categories[index];
          }
          return null;
      },
      deleteById: (id) => {
        const index = mockData.categories.findIndex((item) => item.id == id);
        if (index !== -1) {
          return mockData.categories.splice(index, 1);
        }
        return null;
      },
    },
    products: {
      getAll: () => mockData.products,
      findById: (id) => mockData.products.find((item) => item.id == id),
      create: (input) => {
        const newProduct = { id: mockData.products.length + 1, ...input };
        mockData.products.push(newProduct);
        return newProduct;
      },
      update: (id, input) => {
        const index = mockData.products.findIndex((item) => item.id == id);
        if (index >= 0) {
          Object.keys(input).map((key) => {
            const value = input[key];
            mockData.products[index][key] = value;
          });
          return mockData.products[index];
        }
        return null;
      },
      deleteById: (id) => {
        const index = mockData.products.findIndex((item) => item.id == id);
        if (index !== -1) {
          return mockData.products.splice(index, 1);
        }
        return null;
      },
    },
    manufacturers: {
      getAll: () => mockData.manufacturers,
      findById: (id) => mockData.manufacturers.find((item) => item.id == id),
      create: (input) => {
        const newManufacturer = { id: mockData.manufacturers.length + 1, ...input };
        mockData.manufacturers.push(newManufacturer);
        return newManufacturer;
      },
      update: (id, input) => {
        const index = mockData.manufacturers.findIndex((item) => item.id == id);
        if (index >= 0) {
          Object.keys(input).map((key) => {
            const value = input[key];
            mockData.manufacturers[index][key] = value;
          });
          return mockData.manufacturers[index];
        }
        return null;
      },
      deleteById: (id) => {
        const index = mockData.manufacturers.findIndex((item) => item.id == id);
        if (index !== -1) {
          return mockData.manufacturers.splice(index, 1);
        }
        return null;
      },
    },
  };

  export default db;