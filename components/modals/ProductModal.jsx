import { CgClose } from "react-icons/cg";
import ImageListViewer from "../lists/ImageListViewer";
import { useCallback } from "react";
import useURL from "@/hooks/useURL";
import { twMerge } from "tailwind-merge";
import { Spinner } from "@nextui-org/react";
import useCart from "@/hooks/useCart";
import { useAuthContext } from "../providers/AuthProvider";
import { useRouter } from "next/navigation";
import ModalFrame from "./ModalFrame";
function ProductModal({ product }) {
  const [getSearchParams, setSearchParams] = useURL();
  const router = useRouter();
  const { user, setUser } = useAuthContext();

  const {
    currentVariants,
    handleQuantityChange,
    cartProduct,
    mutateAddToCart,
  } = useCart({
    product,
    user,
    setUser,
  });

  const closeModal = useCallback(() => {
    const removeVariants = {};
    product.variants.forEach((variant) => {
      removeVariants[variant.name] = "";
    });
    setSearchParams({ ...removeVariants, product: "" });
  }, [product.variants, setSearchParams]);

  return (
    <ModalFrame
      wrapperProps={{
        closeModal,
      }}
      modalProps={{
        layoutId: `card-${product?._id}`,
      }}
    >
      <button className="absolute top-10 md:top-5 right-5" onClick={closeModal}>
        <CgClose
          size={20}
          className=" text-foreground-700 hover:text-foreground-800"
        />
      </button>
      <div className="flex flex-col md:flex-row gap-5">
        <ImageListViewer images={product.images} />
        <div className="w-full md:w-7/12 flex flex-col gap-2 h-full overflow-y-scroll">
          <h2 className="text-2xl font-bold">{`${product.name} (${Object.keys(
            currentVariants
          )
            .map(
              (variantKey) => `${variantKey} - ${currentVariants[variantKey]}`
            )
            ?.join(", ")})`}</h2>
          <div className="max-h-[200px] overflow-y-scroll">
            <p className="text-foreground-700">{product.description}</p>
          </div>

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
          {cartProduct && (
            <div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center justify-between w-3/4">
                  <button
                    onClick={() => {
                      handleQuantityChange(cartProduct.quantity - 1);
                    }}
                    className="border border-foreground px-3 py-1.5 my-2 text-2xl"
                  >
                    -
                  </button>
                  <span className="text-2xl">{cartProduct.quantity}</span>
                  <button
                    onClick={() => {
                      handleQuantityChange(cartProduct.quantity + 1);
                    }}
                    className="border border-foreground px-3 py-1.5 my-2 text-2xl"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-col justify-between gap-2 items-end w-1/4">
                  <div className="h-5">
                    {mutateAddToCart.isPending && (
                      <Spinner size="sm" color="current" />
                    )}
                  </div>
                  <div className="text-default-500">
                  {`Rs ${product.price} x ${cartProduct.quantity} = Rs ${
                cartProduct.quantity * product.price
              }`}
                  </div>
                </div>
              </div>
              <button
                className="border border-foreground py-2 my-2 w-full"
                onClick={() => router.push("/cart")}
              >
                Move to cart
              </button>
              <button
                className="hover:underline text-foreground-500 py-2 my-2 w-full"
                onClick={closeModal}
              >
                Continue Shopping
              </button>
            </div>
          )}
          {!cartProduct && (
            <button
              className="border border-foreground py-2 my-2 flex items-center justify-center"
              onClick={() => {
                handleQuantityChange(1);
              }}
            >
              {mutateAddToCart.isPending ? (
                <Spinner size="sm" color="current" />
              ) : (
                "Add to Cart"
              )}
            </button>
          )}
        </div>
      </div>
    </ModalFrame>
  );
}

export default ProductModal;
