import connectDB from "@/lib/mongoose";
import User from "@/models/User";

export async function PUT(request) {
  const { id, newUser } = await request.json();
  
  try {
    await connectDB();
    const user = await User.findById(id);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    for (const key in newUser) {
      if (newUser.hasOwnProperty(key)) {
        user[key] = newUser[key];
      }
    }
    await user.save();
    return Response.json(
      { user, success: true },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
