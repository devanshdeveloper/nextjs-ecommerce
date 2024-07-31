import { motion } from "framer-motion";
import { CgClose } from "react-icons/cg";
import ImageListViewer from "../lists/ImageListViewer";
import { useCallback, useEffect } from "react";
import useURL from "@/hooks/useURL";
import { twMerge } from "tailwind-merge";
import { Button, Spinner } from "@nextui-org/react";
import useCart from "@/hooks/useCart";
import SmallCartCard from "../cards/SmallCartCard";
import { useRouter } from "next/navigation";
import PageLayout from "../layout/PageLayout";
import PageLayoutSpinner from "../spinners/PageLayoutSpinner";
import { useAuthContext } from "../providers/AuthProvider";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { readProductsByIds } from "@/fetch/product";
function CartModal() {
  const [getSearchParams, setSearchParams] = useURL();
  const { showCartModal } = getSearchParams("showCartModal");
  const { user, setUser } = useAuthContext();
  const router = useRouter();
  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetching,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["cartProducts"],
    queryFn: (params) =>
      readProductsByIds({
        ...params,
        limit: 20,
        productIds: user.cart.map((cartItem) => cartItem.product),
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.info.nextPage;
    },
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!user?.cart?.length,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);
  console.log(data);

  const products = data && data.pages.flatMap((page) => page.data);

  function calculateAmount(cart, products) {
    if (!cart || !products) return 0;
    let amount = 0;
    let notFoundProducts = [];
    for (let i = 0; i < cart.length; i++) {
      const cartItem = cart[i];
      const product = products.find((p) => p._id === cartItem.product);
      if (!product) {
        notFoundProducts.push(cartItem.product);
        continue;
      }
      amount += product.price * cartItem.quantity;
    }
    if (notFoundProducts.length) {
      const newCart = user.cart.filter(
        (cartProduct) => !notFoundProducts.includes(cartProduct.product)
      );
      setUser({ ...user, cart: newCart });
      updateOneUser({ id: user._id, newUser: { cart: newCart } });
    }
    return parseAmount(amount);
  }

  const product =
    products &&
    products.find(({ name }) => name === getSearchParams("product").product);
  const closeModal = useCallback(() => {
    setSearchParams({ showCartModal: "" });
  }, [setSearchParams]);

  let contents = null;

  if (!user.cart.length) {
    contents = (
      <div className="h-[calc(100vh-200px)] flex flex-col items-center justify-center gap-10">
        <div className="text-3xl">Your Cart is Empty</div>
        <div className="flex gap-5">
          <Button
            variant="flat"
            color="primary"
            size="lg"
            onPress={() => router.push("/shop")}
          >
            Go to Shop
          </Button>
        </div>
      </div>
    );
  }
  // if (status === "pending") {
  //   return <PageLayoutSpinner />;
  // }

  if (!user) {
    contents = (
      <div className="h-[calc(100vh-200px)] flex flex-col items-center justify-center gap-10">
        <div className="text-3xl">You are not signed In</div>
        <div className="flex gap-5">
          <Button
            variant="flat"
            color="primary"
            size="lg"
            onPress={() => router.push("/shop")}
          >
            Go to Shop
          </Button>
          <Button
            variant="flat"
            color="primary"
            size="lg"
            onPress={() => router.push("/auth?action=signin")}
          >
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8 },
  };

  console.log(products);

  return showCartModal ? (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-end bg-foreground-50 bg-opacity-50 backdrop-blur-sm"
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={closeModal}
    >
      <motion.div
        className="relative w-[min(100vw,700px)] bg-background h-screen overflow-y-scroll shadow-xl rounded-2xl py-20 px-5 md:p-10"
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
        {contents && contents}

        {!contents && (
          <>
            <h2 className="text-3xl font-bold text-foreground-700 mb-5">
              Cart
            </h2>
            {products &&
              user.cart.map((cartItem, i) => {
                return (
                  <SmallCartCard
                    key={i}
                    {...{
                      product: products.find(
                        (product) => cartItem.product === product._id
                      ),
                      cartItem,
                    }}
                  />
                );
              })}
          </>
        )}
      </motion.div>
    </motion.div>
  ) : null;
}

export default CartModal;