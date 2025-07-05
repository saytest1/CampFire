import mongoose from "mongoose";
let Schema = mongoose.Schema;
let String = Schema.Types.String;
let Number = Schema.Types.Number;
let ObjectId = Schema.Types.ObjectId;

export const ReviewSchema = new Schema(
    {
        customerId: { type: ObjectId, ref: 'customer' },
        productId: { type: ObjectId, ref: 'product' },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
        },
        comment: {
            type: String,
            required: false,
            default: null,
        },
        imageFile: {
            type: String,
            required: false,
            default: null,
        }
    },
    {
        collection: "reviews",
    }
);

export const Review = mongoose.model("review", ReviewSchema);