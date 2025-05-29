import { Category } from "./models/index.js";

const db = {
  categories: {
    getAll: async () => {
      return await Category.find();
    },
    create: async ({ name }) => {
      return await Category.create({ name });
    },
    findById: async (id) => {
      return await Category.findById(id);
    },
    deleteById: async (id) => {
      return await Category.findByIdAndDelete(id);
    },
    updateById: async (id, input) => {
      return await Category.findByIdAndUpdate(id, input, { new: true });
    }
  },
};

export { db };
