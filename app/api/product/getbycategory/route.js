import Product from "@/models/Product";
import paginateModel from "@/utils/paginateModel";
import populateS3SignedURLs from "@/utils/populateS3SignedURLs";

export async function GET(request) {
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
      processData: populateS3SignedURLs,
    }))
  );
}
