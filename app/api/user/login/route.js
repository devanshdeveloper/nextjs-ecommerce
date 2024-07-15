import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  const { email, password } = await request.json();
  try {
    await connectDB();
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return Response.json({ error: "Invalid Credentials" }, { status: 401 });
    }
    return Response.json(
      { user, success: true },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err);
    return Response.json({ err }, { status: 500 });
  }
}
