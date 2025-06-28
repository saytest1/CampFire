import mongoose from "mongoose";
let Schema = mongoose.Schema;
let String = Schema.Types.String;
let Number = Schema.Types.Number;
let Float = Schema.Types.Float;

export const ProductSchema = new Schema(
  {
    name: String,
    price: Float,
    categoryId: Number,
    manufacturerId: Number, 
  },
  {
    collection: "products",
  }
);

export const Product = mongoose.model("product", ProductSchema);