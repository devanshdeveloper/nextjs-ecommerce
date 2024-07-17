// import connectDB from "@/lib/mongoose";
import Category from "@/models/Category";
import paginateModel from "@/utils/paginateModel";

export async function GET(request) {
  return Response.json(...(await paginateModel(Category, request)));
}
