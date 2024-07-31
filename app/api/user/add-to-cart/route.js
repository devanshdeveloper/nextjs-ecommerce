import connectDB from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(request) {
  const body = await request.json();
  try {
    await connectDB();
    const user = await User.findById(body.userId);
    if (!user) {
      return Response.json({ error: "User doesn't exists" }, { status: 500 });
    }
    const updatedCart = await user.addToCart(
      body.productId,
      body.quantity,
      body.variants
    );
    return Response.json(updatedCart);
  } catch (err) {
    console.log(err);
    return Response.json(err, { status: 500 });
  }
}
