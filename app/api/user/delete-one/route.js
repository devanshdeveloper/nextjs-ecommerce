import connectDB from "@/lib/mongoose";
import User from "@/models/User";

export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }
    return Response.json(deletedUser);
  } catch (err) {
    console.log(err);
    return Response.json(err, { status: 500 });
  }
}
