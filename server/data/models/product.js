import mongoose from "mongoose";
let Schema = mongoose.Schema;
let String = Schema.Types.String;
let Number = Schema.Types.Number;
let ObjectId = Schema.Types.ObjectId;

export const ProductSchema = new Schema(
  {
    name: String,
    price: Number,
    categoryId: { type: ObjectId, ref: 'category' },
    categoryName: { type: String, ref: 'category' },
    manufacturerId: { type: ObjectId, ref: 'manufacturer' }, 
    manufacturerName: { type: String, ref: 'manufacturer' },
    imageUrl: String,
  },
  {
    collection: "products",
  }
);

export const Product = mongoose.model("product", ProductSchema);
