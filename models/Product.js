import { getObjectURL } from "@/utils/s3-bucket";
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
  isPreOrderable: {
    type: Boolean,
    default: false,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  variants: [
    {
      name: {
        type: String,
        required: [true, "Please enter variant name"],
      },
      inventory: {
        type: Number,
        required: [true, "Please enter variant inventory"],
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

// async function populateS3SignedURLs(data, next) {

//   if (!data) {
//     next();
//     return;
//   }
//   for (let i = 0; i < data.length; i++) {
//     const product = data[i];
//     const images = product.images;
//     if (!images?.length) {
//       console.log("No images found for product " + product.name);
//       continue;
//     }

//     for (let j = 0; j < images.length; j++) {
//       const imageURL = images[j];
//       if (imageURL.startsWith("/") || imageURL.startsWith("http")) {
//         continue;
//       } else {
//         data[i].images[j] = (
//           await getObjectURL({
//             Bucket: process.env.AWS_BUCKET_NAME,
//             Key: imageURL,
//           })
//         )[imageURL];
//       }
//     }
//   }
//   next();
// }

// ProductSchema.post("find", populateS3SignedURLs);
// ProductSchema.post("findOne", populateS3SignedURLs);
// ProductSchema.post("findById", populateS3SignedURLs);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
