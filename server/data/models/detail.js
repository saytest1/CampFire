import mongoose from "mongoose";
let Schema = mongoose.Schema;
let String = Schema.Types.String;
let Number = Schema.Types.Number;

export const DetailSchema = new Schema(
  {
    name: String,
    orderId: Number,
    productId: Number,
    quantity: Number,
    price: Number,
  },
  {
    collection: "details",
  }
);

export const Detail = mongoose.model("detail", DetailSchema);