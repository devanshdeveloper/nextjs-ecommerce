// import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import paginateModel from "@/utils/paginateModel";

export async function GET(request) {
  return Response.json(...(await paginateModel(User, request)));
}
