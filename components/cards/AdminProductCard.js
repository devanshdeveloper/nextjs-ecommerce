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
      <div className="flex gap-2 p-3 pt-0">
        <Button
          isLoading={mutate_deleteOneProduct.isPending}
          isIconOnly
          variant="flat"
          color="primary"
          radius="lg"
          onPress={() => router.push(`/admin/products/${_id}/edit`)}
        >
          <Edit size={30} />
        </Button>
        <Button
          isLoading={mutate_deleteOneProduct.isPending}
          isIconOnly
          variant="flat"
          color="danger"
          radius="lg"
          onPress={() => mutate_deleteOneProduct.mutate({ id: _id })}
        >
          <Delete size={30} />
        </Button>
      </div>
    </ProductCard>
  );
}
