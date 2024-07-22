import connectDB from "@/lib/mongoose";
import User from "@/models/User";
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let id = searchParams.get("id");
  try {
    await connectDB();
    if (id.length !== 24)
      return Response.json({ error: "Invalid Id" }, { status: 500 });
    const user = await User.find({ _id: id });
    if (user.length === 0)
      return Response.json({ error: "User not found" }, { status: 404 });
    return Response.json(user[0]);
  } catch (err) {
    console.log(err);
    return Response.json(err, { status: 500 });
  }
}
