import connectDB from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(request) {
  const body = await request.json();
  try {
    await connectDB();
    const user = await User.findOne({ email: body.email });
    if (user) {
      for (const key in body) {
        if (body.hasOwnProperty(key)) {
          user[key] = body[key];
        }
      }
      await user.save();
      return Response.json(user, { status: 200 });
    }
    const newUser = await User.create(body);
    return Response.json(newUser);
  } catch (err) {
    console.log(err);
    return Response.json(err, { status: 500 });
  }
}
