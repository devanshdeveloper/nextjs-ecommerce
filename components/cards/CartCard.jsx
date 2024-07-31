import Image from "next/image";
import { MdImageNotSupported } from "react-icons/md";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useURL from "@/hooks/useURL";
import { useAuthContext } from "../providers/AuthProvider";
import useCart from "@/hooks/useCart";
import { Spinner } from "@nextui-org/react";

export default function CartCard({ product, cartItem }) {
  const [isCardHovered, setCardHovered] = useState(false);
  const { user } = useAuthContext();

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
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };
  const [getSearchParams, setSearchParams] = useURL();

  return (
    <motion.div
      className="border border-foreground-200 rounded-lg cursor-pointer"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={() => {
        const cartVariants = user?.cart.find(
          (cartItem) => cartItem.product === product._id
        )?.variants;
        const defaultVariants = {};
        if (cartVariants) {
          cartVariants.forEach((variant) => {
            defaultVariants[variant.name] = variant.value;
          });
        } else {
          variants.forEach((variant) => {
            defaultVariants[variant.name] = variant.options[0];
          });
        }
        setSearchParams({ product: product.name, ...defaultVariants });
      }}
      onMouseOver={() => {
        setCardHovered(true);
      }}
      onMouseLeave={() => {
        setCardHovered(false);
      }}
    >
      <div className="relative">
        {product.images[0] && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: isCardHovered ? 0 : 1 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              className="z-10 w-full"
              src={product.images[0]}
              width={500}
              height={500}
              alt={product.name}
            />
          </motion.div>
        )}
        {product.images[1] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isCardHovered ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-0 left-0 w-full h-full"
          >
            <Image
              className="w-full"
              src={product.images[1]}
              width={500}
              height={500}
              alt={product.name}
            />
          </motion.div>
        )}
        {!product.images[0] && !product.images[1] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-[300px] flex items-center justify-center"
          >
            <MdImageNotSupported size={100} />
          </motion.div>
        )}
      </div>
      <div className="flex flex-col items-start p-3 pt-0">
        <h4 className="font-bold sm:text-sm md:text-md lg:text-large">
          {`${product.name} (${cartItem.variants
            .map((variant) => `${variant.name} - ${variant.value}`)
            .join(", ")})`}
        </h4>
        <div className="flex gap-2">
          <small className="text-default-500">Rs {product.price}</small>
          <small className="text-default-500 line-through">
            Rs {product.actualPrice}
          </small>
        </div>
        {cartProduct && (
          <div className="flex flex-col items-start justify-between w-full pt-1">
            <div className="flex items-center justify-between  w-full">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleQuantityChange(cartProduct.quantity - 1);
                }}
                className="border border-foreground px-3 py-1.5 text-2xl"
              >
                -
              </button>
              <span className="text-2xl">{cartProduct.quantity}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleQuantityChange(cartProduct.quantity + 1);
                }}
                className="border border-foreground px-3 py-1.5 text-2xl"
              >
                +
              </button>
            </div>
            <div className="flex justify-between w-full mt-2">
              <div className="text-default-500">
                Total: Rs {cartProduct.quantity * product.price}
              </div>
              <div className="h-5">
                {mutateAddToCart.isPending && (
                  <Spinner size="sm" color="white" />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
