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
      return item;
    },
    update: async (id, { name }) => {
      const updated = await Category.findByIdAndUpdate(id, { name }, { new: true });
      return updated;
    },
    deleteById: async (id) => {
      const deleted = await Category.findByIdAndDelete(id);
      return deleted;
    },
  },
};

export { db };