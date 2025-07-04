import mongoose from "mongoose";
let Schema = mongoose.Schema;
let String = Schema.Types.String;
let Number = Schema.Types.Number;
let ObjectId = Schema.Types.ObjectId;

export const OrderSchema = new Schema(
  {
    customerId: Number,
    orderDate: String,
    totalAmount: Number,
    customer: { type: ObjectId, ref: 'customer' },
  },
  {
    collection: "orders",
  }
);

export const Order = mongoose.model("order", OrderSchema);