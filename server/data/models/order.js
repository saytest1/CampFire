import mongoose from "mongoose";
let Schema = mongoose.Schema;
let String = Schema.Types.String;
let Number = Schema.Types.Number;

export const OrderSchema = new Schema(
  {
    customerId: Number,
    orderDate: String,
    totalAmount: Number,
  },
  {
    collection: "orders",
  }
);

export const Order = mongoose.model("order", OrderSchema);