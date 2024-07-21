// import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import paginateModel from "@/utils/paginateModel";

export async function GET(request) {
  return Response.json(
    ...(await paginateModel({
      Model: User,
      request,
      queryFunc: (search) =>
        search
          ? {
              $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { role: { $regex: search, $options: "i" } },
              ],
            }
          : {},
    }))
  );
}
