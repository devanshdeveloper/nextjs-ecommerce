import connectDB from "@/lib/mongoose";
import User from "@/models/User";

export async function PUT(request) {
  const { id, newDetails } = await request.json();
  
  try {
    await connectDB();
    const user = await User.findById(id);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    for (const key in newDetails) {
      if (newDetails.hasOwnProperty(key)) {
        user[key] = newDetails[key];
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
