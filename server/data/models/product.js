import mongoose from "mongoose";
let Schema = mongoose.Schema;
let String = Schema.Types.String;
let Number = Schema.Types.Number;

export const ProductSchema = new Schema(
  {
    name: String,
    price: Number,
    categoryId: Number,
    manufacturerId: Number, 
  },
  {
    collection: "products",
  }
);

export const Product = mongoose.model("product", ProductSchema);