import { motion } from "framer-motion";
import { CgClose } from "react-icons/cg";
import ImageListViewer from "../lists/ImageListViewer";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { addToCart } from "@/fetch/user";
import useURL from "@/hooks/useURL";
function ProductModal({ product }) {
  const [getSearchParams, setSearchParams] = useURL();
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
  // useEffect(() => {
  //   if (product) {
  //     document.body.style.overflow = "hidden";
  //     document.body.style.height = "100vh";
  //   } else {
  //     document.body.style.overflow = "auto";
  //     document.body.style.height = "auto";
  //   }
  //   return () => {
  //     document.body.style.overflow = "auto";
  //     document.body.style.height = "100vh";
  //   };
  // }, [product]);
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground-50 bg-opacity-50 backdrop-blur-sm"
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={() => setSearchParams({ product: "" })}
    >
      <motion.div
        className="relative w-[min(100vw,1000px)] bg-background h-screen md:h-[800px] overflow-x-scroll shadow-xl rounded-2xl py-20 px-5 md:p-10"
        layoutId={`card-${product._id}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-10 md:top-5 right-5"
          onClick={() => setSearchParams({ product: "" })}
        >
          <CgClose
            size={20}
            className=" text-foreground-700 hover:text-foreground-800"
          />
        </button>
        <div className="flex flex-col md:flex-row gap-5">
          <ImageListViewer images={product.images} />
          <div className="w-full md:w-7/12 flex flex-col gap-2">
            <h2 className="text-2xl font-bold">{product.name}</h2>
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
              return (
                <div key={variant.name} className="flex flex-col gap-2">
                  <div>{variant.name}</div>
                  <div className="flex gap-2">
                    {variant.options.map((option, i) => (
                      <div
                        className="border border-foreground-500 px-4 py-2"
                        key={i}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ProductModal;
