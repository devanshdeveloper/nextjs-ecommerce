import connectDB from "@/lib/mongoose";
import Category from "@/models/Category";

export async function PUT(request) {
  const { id, favorite } = await request.json();

  try {
    await connectDB();
    const category = await Category.findById(id);
    if (!category) {
      return Response.json({ error: "Category not found" }, { status: 404 });
    }
    category.favorite = favorite;
    await category.save();
    return Response.json(category, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
