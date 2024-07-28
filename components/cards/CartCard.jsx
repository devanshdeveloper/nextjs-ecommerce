import { Button, Card, CardFooter, Input } from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdImageNotSupported } from "react-icons/md";
import { BiMinus, BiPlus } from "react-icons/bi";
import { useMutation } from "@tanstack/react-query";
import { addToCart } from "@/fetch/user";
import { useAuthContext } from "../providers/AuthProvider";
import { useDebouncedCallback } from "use-debounce";
import parseAmount from "@/utils/parseAmount";
export default function CartCard({
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
  const { user, setUser } = useAuthContext();

  const cartItem = user.cart.find((cartItem) => cartItem.product === _id);

  const mutateAddToCart = useMutation({
    mutationFn: addToCart,
  });

  const debouncedInputChange = useDebouncedCallback(() => {
    mutateAddToCart.mutate({
      userId: user._id,
      productId: _id,
      quantity: cartItem?.quantity || 1,
    });
  }, 2000);

  const handleQuantityChange = (value) => {
    if (cartItem.quantity === +value) {
      return;
    }
    setUser({
      ...user,
      cart: [
        ...user.cart.map((cartItem) => {
          if (cartItem.product === _id) {
            return { ...cartItem, quantity: value };
          }
          return cartItem;
        }),
      ],
    });
    if (!(isNaN(value) || value === "")) {
      debouncedInputChange();
    }
  };

  // return
  return (
    <Card
      as={"div"}
      className="group flex-row relative border-1 border-foreground-200 h-[300px]"
    >
      <div>
        {images[0] && (
          <Image
            className={
              images[1] &&
              `${images[1] && "absolute"} z-10 group-hover:invisible `
            }
            src={images[0]}
            width={250}
            height={250}
            alt={name}
          />
        )}
        {images[1] && (
          <Image
            className="group-hover:visible "
            src={images[1]}
            width={250}
            height={250}
            alt={name}
          />
        )}
        {!images[0] && (
          <div className="flex items-center justify-center">
            <MdImageNotSupported size={100} />
          </div>
        )}
      </div>
      <div className="flex flex-col justify-between p-5">
        <div className="flex flex-col items-start">
          <h4 className="font-bold sm:text-sm md:text-md lg:text-large">
            {name}
          </h4>
          <small className="text-default-250">
            Rs {parseAmount(price)} * {cartItem?.quantity} = Rs{" "}
            {parseAmount(price * cartItem?.quantity)}
          </small>
        </div>
        <div className="flex gap-2">
          <Button
            isLoading={mutateAddToCart.isPending}
            isIconOnly
            variant="flat"
            color="primary"
            radius="lg"
            onPress={() => handleQuantityChange(cartItem.quantity - 1)}
          >
            <BiMinus size={30} />
          </Button>
          <Input
            type="number"
            value={cartItem?.quantity}
            className="w-[100px]"
            isDisabled={mutateAddToCart.isPending}
            onValueChange={(value) => {
              handleQuantityChange(value);
            }}
          />
          <Button
            isLoading={mutateAddToCart.isPending}
            isIconOnly
            variant="flat"
            color="primary"
            radius="lg"
            onPress={() => handleQuantityChange(cartItem.quantity + 1)}
          >
            <BiPlus size={30} />
          </Button>
        </div>
      </div>
    </Card>
  );
}
