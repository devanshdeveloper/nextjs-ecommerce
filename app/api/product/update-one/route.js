import connectDB from "@/lib/mongoose";
import Product from "@/models/Product";

export async function PUT(request) {
  const { id, newProduct } = await request.json();

  try {
    await connectDB();
    const product = await Product.findById(id);
    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }
    for (const key in newProduct) {
      if (newProduct.hasOwnProperty(key)) {
        if (key === "category") {
          product[key] = newProduct[key].id;
        } else if (key === "_id") {
        } else {
          product[key] = newProduct[key];
        }
      }
    }
    await product.save();
    return Response.json(product, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
