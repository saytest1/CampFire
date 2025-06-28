import mongoose from "mongoose";
let Schema = mongoose.Schema;
let String = Schema.Types.String;
let Number = Schema.Types.Number;
let Float = Schema.Types.Float;

export const OrderSchema = new Schema(
  {
    customerId: Number,
    orderDate: String,
    totalAmount: Float,
  },
  {
    collection: "orders",
  }
);

export const Order = mongoose.model("order", OrderSchema);