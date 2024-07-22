import Product from "@/models/Product";
import paginateModel from "@/utils/paginateModel";

export async function POST(request) {
  return Response.json(
    ...(await paginateModel({
      Model: Product,
      request,
      URLSearchParams: ["categoryId", "search"],
      queryFunc: (categoryId, search) =>
        search
          ? {
              $and: [
                { category: categoryId },
                {
                  $or: [
                    { name: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                  ],
                },
              ],
            }
          : { category: categoryId },
    }))
  );
}
