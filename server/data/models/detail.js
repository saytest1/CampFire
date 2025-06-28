import mongoose from "mongoose";
let Schema = mongoose.Schema;
let String = Schema.Types.String;
let Number = Schema.Types.Number;
let Float = Schema.Types.Float;

export const DetailSchema = new Schema(
  {
    name: String,
    orderId: Number,
    productId: Number,
    quantity: Number,
    price: Float,
  },
  {
    collection: "details",
  }
);

export const Detail = mongoose.model("detail", DetailSchema);