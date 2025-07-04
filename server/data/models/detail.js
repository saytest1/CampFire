import mongoose from "mongoose";
let Schema = mongoose.Schema;
let String = Schema.Types.String;
let Number = Schema.Types.Number;
let ObjectId = Schema.Types.ObjectId;

export const DetailSchema = new Schema(
  {
    orderId: { type: ObjectId, ref: 'order' },
    productId: { type: ObjectId, ref: 'product' },
    quantity: Number,
    price: Number,
  },
  {
    collection: "details",
  }
);

export const Detail = mongoose.model("detail", DetailSchema);