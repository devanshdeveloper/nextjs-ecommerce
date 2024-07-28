import { Button, Card, CardFooter } from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdImageNotSupported } from "react-icons/md";
import { BiPlus } from "react-icons/bi";
import { useMutation } from "@tanstack/react-query";
import { addToCart } from "@/fetch/user";
import { useAuthContext } from "../providers/AuthProvider";
import { deleteOneProduct } from "@/fetch/product";
import { Delete, Edit } from "lucide-react";
export default function AdminProductCard({
  refetch,
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
  const { user } = useAuthContext();

  const mutate_deleteOneProduct = useMutation({
    mutationFn: deleteOneProduct,
    onSuccess() {
      refetch();
    },
  });

  // return
  return (
    <Card
      as={"div"}
      isHoverable
      isPressable
      onClick={() => router.push("/product/" + _id)}
      className="group relative border-1 border-foreground-200"
    >
      {images[0] && (
        <Image
          className={
            images[1] &&
            `${
              images[1] && "absolute"
            } z-10 group-hover:invisible w-full h-[300px]`
          }
          src={images[0]}
          width={500}
          height={500}
          alt={name}
        />
      )}
      {images[1] && (
        <Image
          className="group-hover:visible w-full h-[300px]"
          src={images[1]}
          width={500}
          height={500}
          alt={name}
        />
      )}
      {!images[0] && (
        <div className="w-full h-[300px] flex items-center justify-center">
          <MdImageNotSupported size={100} />
        </div>
      )}
      <CardFooter className="justify-between">
        <div className="flex flex-col items-start">
          <h4 className="font-bold sm:text-sm md:text-md lg:text-large">
            {name}
          </h4>
          <small className="text-default-500">Rs {price}</small>
        </div>
        <div className="flex gap-2">
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
      </CardFooter>
    </Card>
  );
}
