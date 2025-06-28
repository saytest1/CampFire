import { Category } from "./models/index.js";
import { Product } from "./models/index.js";
import { Manufacturer } from "./models/index.js";
import { Detail } from "./models/index.js";
import { Order } from "./models/index.js";

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
    updateById: async (id, { name }) => {
      const updated = await Category.findByIdAndUpdate(id, { name }, { new: true });
      if (updated != null) {
        return await Category.findById(id);
      }
      return updated;
    },
    deleteById: async (id) => {
      const deleted = await Category.findByIdAndDelete(id);
      return deleted;
    },
  },
  products: {
    getAll: async () => {
      const items = await Product.find();
      return items;
    },
    create: async ({ name, price, categoryId, manufacturerId }) => {
      const created = await Product.create({
        name: name,
        price: price,
        categoryId: categoryId,
        manufacturerId: manufacturerId,
      });
      return created;
    },
    findById: async (id) => {
      const item = await Product.findById(id);
      return item;
    },
    updateById: async (id, { name, price, categoryId, manufacturerId }) => {
      const updated = await Product.findByIdAndUpdate(id, { name, price, categoryId, manufacturerId }, { new: true });
      if (updated != null) {
        return await Product.findById(id);
      }
      return updated;
    },
    deleteById: async (id) => {
      const deleted = await Product.findByIdAndDelete(id);
      return deleted;
    },
  },
  manufacturers: {
    getAll: async () => {
      const items = await Manufacturer.find();
      return items;
    },
    create: async ({ name }) => {
      const created = await Manufacturer.create({
        name: name,
      });
      return created;
    },
    findById: async (id) => {
      const item = await Manufacturer.findById(id);
      return item;
    },
    updateById: async (id, { name }) => {
      const updated = await Manufacturer.findByIdAndUpdate(id, { name }, { new: true });
      if (updated != null) {
        return await Manufacturer.findById(id);
      }
      return updated;
    },
    deleteById: async (id) => {
      const deleted = await Manufacturer.findByIdAndDelete(id);
      return deleted;
    },
  },
  details: {
    getAll: async () => {
      const items = await Detail.find();
      return items;
    },
    create: async ({ name, orderId, productId, quantity, price }) => {
      const created = await Detail.create({
        name: name,
        orderId: orderId,
        productId: productId,
        quantity: quantity,
        price: price,
      });
      return created;
    },
    findById: async (id) => {
      const item = await Detail.findById(id);
      return item;
    },
    updateById: async (id, { name, orderId, productId, quantity, price }) => {
      const updated = await Detail.findByIdAndUpdate(id, { name, orderId, productId, quantity, price }, { new: true });
      if (updated != null) {
        return await Detail.findById(id);
      }
      return updated;
    },
    deleteById: async (id) => {
      const deleted = await Detail.findByIdAndDelete(id);
      return deleted;
    },
  },
  orders: {
    getAll: async () => {
      const items = await Order.find();
      return items;
    },
    create: async ({ customerId, orderDate, totalAmount }) => {
      const created = await Order.create({
        customerId: customerId,
        orderDate: orderDate,
        totalAmount: totalAmount,
      });
      return created;
    },
    findById: async (id) => {
      const item = await Order.findById(id);
      return item;
    },
    updateById: async (id, { customerId, orderDate, totalAmount }) => {
      const updated = await Order.findByIdAndUpdate(id, { customerId, orderDate, totalAmount }, { new: true });
      if (updated != null) {
        return await Order.findById(id);
      }
      return updated;
    },
    deleteById: async (id) => {
      const deleted = await Order.findByIdAndDelete(id);
      return deleted;
    },
  },
};

export { db };