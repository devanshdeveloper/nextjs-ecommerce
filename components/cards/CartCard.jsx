import { MdDelete } from "react-icons/md";
import useCart from "@/hooks/useCart";
import { Spinner } from "@nextui-org/react";
import ProductCard from "./ProductCard";

export default function CartCard({ product, cartItem, user, setUser }) {
  const nowVariants = {};
  cartItem.variants.forEach((variant) => {
    nowVariants[variant.name] = variant.value;
  });

  const {
    currentVariants,
    handleQuantityChange,
    cartProduct,
    mutateAddToCart,
  } = useCart({
    product,
    nowVariants,
    user,
    setUser,
  });

  if (!product) return;

  const productVariants = cartItem.variants
    .map((variant) => `${variant.name} - ${variant.value}`)
    ?.join(", ");

  return (
    <ProductCard
      {...{
        layoutId: `CartCard-${product._id}-${productVariants.replace(" ", "")}`,
        displayName: `${product.name} (${productVariants})`,
        ...product,
      }}
    >
      {cartProduct && (
        <div className="flex flex-col items-start justify-between p-2 pt-0 w-full">
          <div className="flex justify-between w-full gap-1">
            <div className="flex flex-col sm:flex-row w-full">
              <div className="flex items-center justify-between w-full">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuantityChange(cartProduct.quantity - 1);
                  }}
                  className="border border-foreground-300 px-3 py-1.5 rounded-lg text-2xl text-foreground-700 hover:bg-foreground-100 transition-all duration-200"
                >
                  -
                </button>
                <span className="text-2xl font-semibold">
                  {cartProduct.quantity}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuantityChange(cartProduct.quantity + 1);
                  }}
                  className="border border-foreground-300 px-3 py-1.5 rounded-lg text-2xl text-foreground-700 hover:bg-foreground-100 transition-all duration-200"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleQuantityChange(0);
              }}
              className="border border-red-500 px-3 py-2 rounded-lg text-2xl hover:bg-red-100 dark:hover:bg-red-950 transition-all duration-200"
            >
              <MdDelete className="text-red-500" />
            </button>
          </div>
          <div className="flex justify-between w-full mt-2 text-lg font-medium text-foreground-600">
            <div>
              {`Rs ${product.price} x ${cartProduct.quantity} = Rs ${
                cartProduct.quantity * product.price
              }`}
            </div>
            <div className="h-5 flex items-center">
              {mutateAddToCart.isPending && (
                <Spinner size="sm" color="current" />
              )}
            </div>
          </div>
        </div>
      )}
    </ProductCard>
  );
}
