import ProductCard from "./ProductCard";
import { Button } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOneProduct } from "@/fetch/product";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { MdDelete } from "react-icons/md";
import { deleteInfiniteQueryData } from "@/utils/react-query";

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
  index,
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutate_deleteOneProduct = useMutation({
    mutationFn: deleteOneProduct,
    onSuccess() {
      queryClient.setQueriesData([`products`], (oldData) =>
        deleteInfiniteQueryData({
          data: oldData,
          pageIndex: Math.floor(index / 20) + 1,
          dataId: _id,
        })
      );
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
      <div className="absolute right-3 bottom-3 flex gap-3">
        <Button
          isIconOnly
          variant="flat"
          color="primary"
          radius="lg"
          size="lg"
          onPress={() => router.push(`/admin/products/${_id}/edit`)}
        >
          <Edit size={20} />
        </Button>
        <Button
          isIconOnly
          variant="flat"
          color="danger"
          isLoading={mutate_deleteOneProduct.isPending}
          radius="lg"
          size="lg"
          onPress={() => mutate_deleteOneProduct.mutate({ id: _id })}
        >
          <MdDelete size={20} />
        </Button>
      </div>
    </ProductCard>
  );
}
