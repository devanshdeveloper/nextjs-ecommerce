import connectDB from "@/lib/mongoose";
import Product from "@/models/Product";
import { ObjectId } from "mongodb";
export async function POST(request) {
  const body = await request.json();
  try {
    await connectDB();
    const product = await Product.findOne({ name: body.name });
    if (product) {
      return Response.json(
        { error: "Product already exists" },
        { status: 500 }
      );
    }
    const newProduct = await Product.create({
      ...body,
      _id: new ObjectId(body._id),
      category: body.category.id,
    });
    return Response.json(newProduct);
  } catch (err) {
    console.log(err);
    return Response.json(err, { status: 500 });
  }
}
