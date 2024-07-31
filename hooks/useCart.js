import { useAuthContext } from "@/components/providers/AuthProvider";
import { addToCart } from "@/fetch/user";
import { useMutation } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import useURL from "./useURL";
import { areVariantsEqual } from "@/utils/areVariantsEqual";
import { useCallback, useMemo } from "react";

function useCart({ product, nowVariants }) {
  const { user, setUser } = useAuthContext();
  const [getSearchParams, setSearchParams] = useURL();
  const mutateAddToCart = useMutation({
    mutationFn: addToCart,
    onSuccess(cart) {
      setUser({ ...user, cart });
    },
  });

  const currentVariants =
    nowVariants ||
    getSearchParams(...product.variants.map((variant) => variant.name));
  const cartProduct = useMemo(() => {
    return (
      user &&
      user.cart.find((cartItem) => {
        return (
          cartItem.product === product._id &&
          areVariantsEqual(cartItem.variants, currentVariants)
        );
      })
    );
  }, [currentVariants, product._id, user]);

  const debouncedInputChange = useDebouncedCallback((newQuantity) => {
    mutateAddToCart.mutate({
      productId: product._id,
      userId: user._id,
      quantity: newQuantity,
      variants: currentVariants,
    });
  }, 1000);

  const handleQuantityChange = useCallback(
    (value) => {
      const newQuantity = +value < 0 ? 1 : +value;

      if (!cartProduct) {
        mutateAddToCart.mutate({
          productId: product._id,
          userId: user._id,
          quantity: newQuantity,
          variants: currentVariants,
        });
        return;
      }

      if (cartProduct.quantity === newQuantity) {
        return;
      }

      function setCart(cart) {
        setUser({ ...user, cart });
      }

      if (newQuantity === 0) {
        debouncedInputChange(newQuantity);
        return;
      }
      setCart(
        user.cart.map((cartItem) => {
          if (
            cartItem.product === product._id &&
            areVariantsEqual(cartItem.variants, currentVariants)
          ) {
            return { ...cartItem, quantity: newQuantity };
          }
          return cartItem;
        })
      );
      debouncedInputChange(newQuantity);
    },
    [
      currentVariants,
      debouncedInputChange,
      setUser,
      user,
      cartProduct,
      mutateAddToCart,
      product._id,
    ]
  );
  return {
    currentVariants,
    handleQuantityChange,
    cartProduct,
    mutateAddToCart,
  };
}

export default useCart;
