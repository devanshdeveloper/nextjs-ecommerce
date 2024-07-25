import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import url from "@/utils/url";

export async function POST(request) {
  const { searchParams } = url(request.url);
  const [userId, productId, quantity] = searchParams.getAll(
    "userId",
    "productId",
    "quantity"
  );
  try {
    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return Response.json({ error: "User doesn't exists" }, { status: 500 });
    }
    const updatedCart = await user.addToCart(productId, quantity);
    return Response.json(updatedCart);
  } catch (err) {
    console.log(err);
    return Response.json(err, { status: 500 });
  }
}
