"use client";

import ProductForm from "@/components/forms/ProductForm";
import { useParams } from "next/navigation";

function ProductEditPage() {
  const { id } = useParams();
  return <ProductForm editId={id} />;
}

export default ProductEditPage;
