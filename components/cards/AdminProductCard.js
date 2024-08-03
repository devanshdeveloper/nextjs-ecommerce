import ProductCard from "./ProductCard";
import { Button } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { deleteOneProduct } from "@/fetch/product";
import { Delete, Edit } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminProductCard({
  actualPrice,
  category,
  description,
  images,
  name,
  price,
  ratings,
  reviews,
  variants,
  _id,
}) {
  const router = useRouter();
  const mutate_deleteOneProduct = useMutation({
    mutationFn: deleteOneProduct,
    onSuccess() {
      refetch();
    },
  });
  return (
    <ProductCard
      {...{
        layoutId: `AdminProductCard-${_id}`,
        actualPrice,
        category,
        description,
        images,
        name,
        price,
        ratings,
        reviews,
        variants,
        _id,
      }}
    >
      <Button
        isLoading={mutate_deleteOneProduct.isPending}
        isIconOnly
        variant="flat"
        color="primary"
        radius="lg"
        size="lg"
        className="absolute right-3 bottom-3"
        onPress={() => router.push(`/admin/products/${_id}/edit`)}
      >
        <Edit size={20} />
      </Button>
    </ProductCard>
  );
}
