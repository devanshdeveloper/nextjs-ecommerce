import Product from "@/models/Product";
import Category from "@/models/Category";
import { getObjectURL } from "@/utils/s3-bucket";

export async function GET() {
  try {
    const categories = await Category.find().sort({ favorite: -1 }).limit(5);
    const categoryWithProducts = [];
    for (const category of categories) {
      const products = await Product.find({ category: category._id })
        .sort({ favorite: -1 })
        .limit(4);
      categoryWithProducts.push({ category, products });
    }
    return Response.json({ categories: categoryWithProducts });
  } catch (e) {
    Response.json({ error: e }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";