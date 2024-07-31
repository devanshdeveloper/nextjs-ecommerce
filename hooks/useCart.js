import { useAuthContext } from "@/components/providers/AuthProvider";
import { addToCart } from "@/fetch/user";
import { useMutation } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import useURL from "./useURL";
import { areVariantsEqual } from "@/utils/areVariantsEqual";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

function useCart({ product, nowVariants, user, setUser }) {
  const router = useRouter();
  const [getSearchParams, setSearchParams] = useURL();
  const mutateAddToCart = useMutation({
    mutationFn: (...args) => {
      return addToCart(...args);
    },
    onSuccess(cart) {
      setUser({ ...user, cart });
    },
  });

  console.log("Running");

  const currentVariants =
    nowVariants ||
    getSearchParams(...product.variants.map((variant) => variant.name));
  const cartProduct = useMemo(() => {
    if (!product?._id) return;

    return (
      user &&
      user?.cart.find((cartItem) => {
        return (
          cartItem.product === product?._id &&
          areVariantsEqual(cartItem.variants, currentVariants)
        );
      })
    );
  }, [currentVariants, product?._id, user]);
  console.log("Running");

  const debouncedInputChange = useDebouncedCallback((newQuantity) => {
    mutateAddToCart.mutate({
      productId: product?._id,
      userId: user._id,
      quantity: newQuantity,
      variants: currentVariants,
    });
  }, 1000);

  console.log("Running");
  const handleQuantityChange = useCallback(
    (value) => {
      if (!user) {
        localStorage.setItem(
          "addToCartPending",
          JSON.stringify({
            productId: product?._id,
            quantity: 1,
            variants: currentVariants,
          })
        );
        router.push("/auth?action=login");
        return;
      }
      if (user?.cart.length === 0) {
        setSearchParams({ showCartModal: true });
      }
      const newQuantity = +value < 0 ? 1 : +value;
      if (cartProduct?.quantity === newQuantity) {
        return;
      }

      if (!cartProduct || newQuantity === 0) {
        mutateAddToCart.mutate({
          productId: product?._id,
          userId: user._id,
          quantity: newQuantity,
          variants: currentVariants,
        });
        return;
      }
      console.log("Running");

      function setCart(cart) {
        setUser({ ...user, cart });
      }

      setCart(
        user?.cart.map((cartItem) => {
          if (
            cartItem.product === product?._id &&
            areVariantsEqual(cartItem.variants, currentVariants)
          ) {
            return { ...cartItem, quantity: newQuantity };
          }
          return cartItem;
        })
      );
      debouncedInputChange(newQuantity);
      console.log("Running");
    },
    [
      currentVariants,
      debouncedInputChange,
      setUser,
      user,
      cartProduct,
      mutateAddToCart,
      product?._id,
      router,
      setSearchParams,
    ]
  );
  console.log("Running");
  return {
    currentVariants,
    handleQuantityChange,
    cartProduct,
    mutateAddToCart,
  };
}

export default useCart;
