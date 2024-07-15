"use client";

import { useParams } from "next/navigation";

function ProductPage() {
  const { id } = useParams();
  const product = {
    name: "Product Name",
    images: ["/product-image.jpg"],
    price: 99.99,
    inventory: 100,
  };
  return (
    <div className="flex justify-center">
      <div className="w-[min(80vw,1250px)]">
        <div></div>
        <div>
          <div>{product.name}</div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
