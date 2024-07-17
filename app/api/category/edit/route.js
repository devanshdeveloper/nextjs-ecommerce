import connectDB from "@/lib/mongoose";
import Category from "@/models/Category";

export async function PUT(request) {
  const { id, newDetails } = await request.json();
  
  try {
    await connectDB();
    const category = await Category.findById(id);
    if (!category) {
      return Response.json({ error: "Category not found" }, { status: 404 });
    }
    for (const key in newDetails) {
      if (newDetails.hasOwnProperty(key)) {
        category[key] = newDetails[key];
      }
    }
    await category.save();
    return Response.json(
      { category, success: true },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
