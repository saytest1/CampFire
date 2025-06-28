const mockData = {
    categories: [
      { id: 1, name: "Tent" },
      { id: 2, name: "Shoes" },
      { id: 3, name: "Clothes" },
      { id: 4, name: "Pliers" },
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
  };

  export default db;