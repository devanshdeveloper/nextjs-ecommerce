import connectDB from "@/lib/mongoose";
import User from "@/models/User";
export async function POST(request) {
  const body = await request.json();
  try {
    await connectDB();
    const newUser = await User.create(body);
    return Response.json(newUser);
  } catch (err) {
    console.log(err);
    return Response.json(err, { status: 500 });
  }
}
