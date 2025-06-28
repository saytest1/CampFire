const mockData = {
    categories: [
      { id: 1, name: "Tent" },
      { id: 2, name: "Shoes" },
      { id: 3, name: "Clothes" },
      { id: 4, name: "Pliers" },
    ],
    products: [
      { id: 1, name: "Tent", price: 100, categoryId: 1, manufacturer: "Tent Company" },
      { id: 2, name: "Shoes", price: 50, categoryId: 2, manufacturer: "Shoes Company" },
      { id: 3, name: "Clothes", price: 30, categoryId: 3, manufacturer: "Clothes Company" },
      { id: 4, name: "Pliers", price: 20, categoryId: 4, manufacturer: "Pliers Company" },
    ],
    manufacturers: [
      { id: 1, name: "Tent Company" },
      { id: 2, name: "Shoes Company" },
      { id: 3, name: "Clothes Company" },
      { id: 4, name: "Pliers Company" },
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