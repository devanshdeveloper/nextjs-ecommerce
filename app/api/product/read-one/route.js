import connectDB from "@/lib/mongoose";
import Product from "@/models/Product";
import Category from "@/models/Category";


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let id = searchParams.get("id");
  try {
    await connectDB();
    if (id.length !== 24)
      return Response.json({ error: "Invalid Id" }, { status: 500 });
    const product = await Product.find({ _id: id }).populate("category").exec();
    if (product.length === 0)
      return Response.json({ error: "Product not found" }, { status: 404 });
    return Response.json(product[0]);
  } catch (err) {
    console.log(err);
    return Response.json(err, { status: 500 });
  }
}
