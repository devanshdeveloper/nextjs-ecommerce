import connectDB from "@/lib/mongoose";
import Category from "@/models/Category";
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let name = searchParams.get("name");
  try {
    await connectDB();
    const category = await Category.find({ name });
    if (category.length === 0)
      return Response.json({ error: "Category not found" }, { status: 404 });
    return Response.json(category[0]);
  } catch (err) {
    console.log(err);
    return Response.json(err, { status: 500 });
  }
}
