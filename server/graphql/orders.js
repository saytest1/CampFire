import { ObjectId } from "mongodb";

export const typeDef = `
  extend type Query {
    orders(
      page: Int = 1
      limit: Int = 20
      onlyUnpaid: Boolean     
      status: OrderStatus    
      fromDate: DateTime
      toDate: DateTime
      search: String         
    ): OrderPage!

    order(id: ID!): Order!
  }

  extend type Mutation {
    createOrder(input: CreateOrderInput!): Order!
    deleteOrder(id: ID!): Boolean!
    updateOrder(id: ID!, input: UpdateOrderInput!): Order!
    addOrderItem(orderId: ID!, input: OrderItemInput!): OrderItem!
    updateOrderItem(orderId: ID!, itemId: ID!, input: UpdateOrderItemInput!): OrderItem!
    deleteOrderItem(orderId: ID!, itemId: ID!): Boolean!
  }
`;

export const resolvers = {
  Query: {
    orders: async (_, {
      page = 1,
      limit = 20,
      onlyUnpaid,
      status,
      fromDate,
      toDate,
      search
    }, { db, user }) => {
      if (!user || user.role !== "admin") throw new Error("Không có quyền");
      const filter = { isDeleted: false };
      if (onlyUnpaid) filter.status = "PENDING";
      else if (status) filter.status = status;
      if (fromDate || toDate) {
        filter.createdAt = {};
        if (fromDate) filter.createdAt.$gte = new Date(fromDate);
        if (toDate)   filter.createdAt.$lte = new Date(toDate);
      }
      if (search) {
        const re = new RegExp(search, "i");
        filter.$or = [
          { customerName: re },
          { customerPhone: re }
        ];
      }
      const totalCount = await db.orders.countDocuments(filter);
      const items = await db.orders.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();
      return { items, totalCount };
    },

    order: async (_, { id }, { db, user }) => {
      if (!user || user.role !== "admin") throw new Error("Không có quyền");
      const o = await db.orders.findOne({ _id: new ObjectId(id), isDeleted: false });
      if (!o) throw new Error("Không tìm thấy đơn");
      return o;
    },
  },

  Mutation: {
    createOrder: async (_, { input }, { db, user }) => {
      if (!user || user.role !== "admin") throw new Error("Không có quyền");
      const { customerName, customerPhone, items } = input;
      const total = items.reduce((sum, it) => sum + it.quantity * it.price, 0);
      const newOrder = {
        customerName,
        customerPhone,
        items,
        total,
        status: "PENDING",
        isDeleted: false,
        createdAt: new Date()
      };
      const { insertedId } = await db.orders.insertOne(newOrder);
      return { id: insertedId, ...newOrder };
    },

    deleteOrder: async (_, { id }, { db, user }) => {
      if (!user || user.role !== "admin") throw new Error("Không có quyền");
      const { modifiedCount } = await db.orders.updateOne(
        { _id: new ObjectId(id) },
        { $set: { isDeleted: true } }
      );
      return modifiedCount === 1;
    },

    updateOrder: async (_, { id, input }, { db, user }) => {
      if (!user || user.role !== "admin") throw new Error("Không có quyền");
      const update = {};
      ["customerName", "customerPhone", "status"].forEach(field => {
        if (input[field] !== undefined) update[field] = input[field];
      });
      const res = await db.orders.findOneAndUpdate(
        { _id: new ObjectId(id), isDeleted: false },
        { $set: update },
        { returnDocument: "after" }
      );
      if (!res.value) throw new Error("Cập nhật thất bại");
      return res.value;
    },

    addOrderItem: async (_, { orderId, input }, { db, user }) => {
      if (!user || user.role !== "admin") throw new Error("Không có quyền");
      const item = { id: new ObjectId(), ...input };
      await db.orders.updateOne(
        { _id: new ObjectId(orderId), isDeleted: false },
        { $push: { items: item } }
      );
      return item;
    },

    updateOrderItem: async (_, { orderId, itemId, input }, { db, user }) => {
      if (!user || user.role !== "admin") throw new Error("Không có quyền");
      const setOps = {};
      Object.entries(input).forEach(([key, value]) => {
        if (value !== undefined) setOps[`items.$.${key}`] = value;
      });
      await db.orders.updateOne(
        { _id: new ObjectId(orderId), "items.id": new ObjectId(itemId) },
        { $set: setOps }
      );
      const order = await db.orders.findOne({ _id: new ObjectId(orderId) });
      return order.items.find(i => i.id.toString() === itemId);
    },

    deleteOrderItem: async (_, { orderId, itemId }, { db, user }) => {
      if (!user || user.role !== "admin") throw new Error("Không có quyền");
      const { modifiedCount } = await db.orders.updateOne(
        { _id: new ObjectId(orderId) },
        { $pull: { items: { id: new ObjectId(itemId) } } }
      );
      return modifiedCount === 1;
    },
  }
};
