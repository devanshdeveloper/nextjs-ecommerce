import connectDB from "@/lib/mongoose";
import Category from "@/models/Category";

export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('id');
    if (!categoryId) {
      return Response.json({ error: 'Category ID is required' }, { status: 400 });
    }
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return Response.json({ error: 'Category not found' }, { status: 404 });
    }
    return Response.json(deletedCategory);
  } catch (err) {
    console.log(err);
    return Response.json(err, { status: 500 });
  }
}
