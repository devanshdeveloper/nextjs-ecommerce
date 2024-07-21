import Product from "@/models/Product";
import paginateModel from "@/utils/paginateModel";
import populateS3SignedURLs from "@/utils/populateS3SignedURLs";
import { getObjectURL } from "@/utils/s3-bucket";

export async function GET(request) {
  return Response.json(
    ...(await paginateModel({
      Model: Product,
      request,
      queryFunc: (search) =>
        search
          ? {
              $or: [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
              ],
            }
          : {},
      processData: populateS3SignedURLs,
    }))
  );
}
