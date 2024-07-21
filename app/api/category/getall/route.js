import Category from "@/models/Category";
import paginateModel from "@/utils/paginateModel";

export async function GET(request) {
  return Response.json(
    ...(await paginateModel({
      Model: Category,
      request,
      URLSearchParams : ["search"],
      queryFunc: ( search ) =>
        search ? { name: { $regex: search, $options: "i" } } : {},
 
    }))
  );
}
