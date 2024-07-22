import Product from "@/models/Product";
import paginateModel from "@/utils/paginateModel";

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
    }))
  );
}
export const dynamic = "force-dynamic";