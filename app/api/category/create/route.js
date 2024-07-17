import connectDB from "@/lib/mongoose";
import Category from "@/models/Category";
export async function POST(request) {
  const body = await request.json();
  console.log(body);
  try {
    await connectDB();
    const category = await Category.findOne({ name: body.name });
    if (category) {
      return Response.json(
        { error: "Category already exists" },
        { status: 500 }
      );
    }
    const newCategory = await Category.create(body);
    return Response.json(newCategory);
  } catch (err) {
    console.log(err);
    return Response.json(err, { status: 500 });
  }
}
