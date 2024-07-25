import { z } from "zod";

// Define the product schema
const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be a positive number"),
  actualPrice: z.number().min(0, "Actual price must be a positive number"),
  images: z
    .array(
      z.object({
        name: z.string().min(1, "File name is required"),
        size: z.number().min(1, "File size must be greater than 0"),
        type: z.string().min(1, "File type is required"),
      })
    )
    .min(1, "At least one image is required"),
  category: z.object({
    id: z.string().min(1, "Category ID is required"),
    name: z.string().min(1, "Category name is required"),
  }),
  variants: z
    .array(
      z.object({
        name: z.string(),
        options: z.array(z.string()),
      })
    )
    .optional(),
});

// Example product data
const product = {
  name: "",
  description: "",
  price: 0,
  actualPrice: 0,
  images: ["https://example.com/image1.jpg"],
  category: { id: "cat123", name: "Category Name" },
  variants: [
    { color: "red", size: "M", stock: 10 },
    { color: "blue", size: "L", stock: 5 },
  ],
};

export function validateProductForm(product) {
  try {
    const validation = ProductSchema.parse(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.format();
    } else {
      return error;
    }
  }
}
