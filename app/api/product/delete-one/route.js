import connectDB from "@/lib/mongoose";
import Product from "@/models/Product";

export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");
    if (!productId) {
      return Response.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    return Response.json(deletedProduct);
  } catch (err) {
    console.log(err);
    return Response.json(err, { status: 500 });
  }
}
