import connectDB from "@/lib/mongoose";
import User from "@/models/User";
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let id = searchParams.get("id");
  try {
    await connectDB();
    const user = await User.find({ _id: id });
    return Response.json(user[0]);
  } catch (err) {
    console.log(err);
    return Response.json(err, { status: 500 });
  }
}
