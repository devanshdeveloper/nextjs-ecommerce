import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
  },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },
  price: {
    type: Number,
    required: [true, "Please enter product price"],
  },
  actualPrice: {
    type: Number,
  },
  images: [{ type: String }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Please enter product category"],
  },
  variants: [
    {
      name: {
        type: String,
        required: [true, "Please enter variant name"],
      },
      options: [
        {
          type: String,
          required: [true, "Please enter variant option"],
        },
      ],
    },
  ],
  ratings: {
    type: Number,
    default: 0,
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
