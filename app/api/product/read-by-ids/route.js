import Product from "@/models/Product";
import paginateModel from "@/utils/paginateModel";
import mongoose from "mongoose";

export async function POST(request) {
  return Response.json(
    ...(await paginateModel({
      Model: Product,
      request,
      bodyElements: ["productIds"],
      URLSearchParams: [],
      queryFunc: (productIds) => {
        if (!Array.isArray(productIds)) {
          throw new Error("Product IDs must be an array");
        }
        const validProductIds = productIds.map(
          (id) => new mongoose.Types.ObjectId(id)
        );
        return { _id: { $in: validProductIds } };
      },
    }))
  );
}
