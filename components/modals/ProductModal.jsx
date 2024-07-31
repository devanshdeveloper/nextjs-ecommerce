import { motion } from "framer-motion";
import { CgClose } from "react-icons/cg";
import ImageListViewer from "../lists/ImageListViewer";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { addToCart } from "@/fetch/user";
import useURL from "@/hooks/useURL";
import { twMerge } from "tailwind-merge";
import { Spinner } from "@nextui-org/react";
import { useAuthContext } from "../providers/AuthProvider";
function ProductModal({ product }) {
  const [getSearchParams, setSearchParams] = useURL();
  const { user } = useAuthContext();
  const mutateAddToCart = useMutation({
    mutationFn: addToCart,
    onSuccess() {
      router.push("/cart");
    },
  });
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8 },
  };

  const currentVariants = getSearchParams(
    ...product.variants.map((variant) => variant.name)
  );

  const closeModal = useCallback(() => {
    const removeVariants = {};
    product.variants.forEach((variant) => {
      removeVariants[variant.name] = "";
    });
    setSearchParams({ ...removeVariants, product: "" });
  }, [product.variants, setSearchParams]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground-50 bg-opacity-50 backdrop-blur-sm"
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={closeModal}
    >
      <motion.div
        className="relative w-[min(100vw,1000px)] bg-background h-screen md:h-[800px] overflow-x-scroll shadow-xl rounded-2xl py-20 px-5 md:p-10"
        layoutId={`card-${product._id}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-10 md:top-5 right-5"
          onClick={closeModal}
        >
          <CgClose
            size={20}
            className=" text-foreground-700 hover:text-foreground-800"
          />
        </button>
        <div className="flex flex-col md:flex-row gap-5">
          <ImageListViewer images={product.images} />
          <div className="w-full md:w-7/12 flex flex-col gap-2">
            <h2 className="text-2xl font-bold">{`${product.name} (${Object.keys(
              currentVariants
            )
              .map(
                (variantKey) => `${variantKey} - ${currentVariants[variantKey]}`
              )
              .join(", ")})`}</h2>
            <p className="text-gray-700">
              {product.description} This is an expanded view of the card
              content. Click anywhere to close the modal.
            </p>
            <div className="flex gap-2">
              <small className="text-default-500">Rs {product.price}</small>
              <small className="text-default-500 line-through">
                Rs {product.actualPrice}
              </small>
            </div>
            {product.variants.map((variant) => {
              console.log(currentVariants);
              return (
                <div key={variant.name} className="flex flex-col gap-2">
                  <div>{variant.name}</div>
                  <div className="flex gap-2">
                    {variant.options.map((option, i) => {
                      return (
                        <div
                          className={twMerge(
                            "border border-foreground border-opacity-50 px-4 py-2 cursor-pointer transition-all duration-200",
                            currentVariants[variant.name] === option
                              ? "border-opacity-100"
                              : ""
                          )}
                          key={i}
                          onClick={() =>
                            setSearchParams({ [variant.name]: option })
                          }
                        >
                          {option}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <button
              className="border border-foreground py-2 my-2"
              onClick={() => {
                mutateAddToCart.mutate({
                  productId: product._id,
                  userId: user._id,
                  quantity: 1,
                  variants: Object.keys(currentVariants).map((variantKey) => ({
                    name: variantKey,
                    value: currentVariants[variantKey],
                  })),
                });
              }}
            >
              {mutateAddToCart.isPending ? (
                <Spinner color="white" />
              ) : (
                "Add to Cart"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ProductModal;
