import { Category } from "./models/index.js";

const db = {
  categories: {
    getAll: async () => {
      const items = await Category.find();
      return items;
    },
    create: async ({ name }) => {
      const created = await Category.create({
        name: name,
      });
      return created;
    },
    findById: async (id) => {
      const item = await Category.findById(id);
    },
  }, 
};

export { db };