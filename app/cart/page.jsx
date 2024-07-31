"use client";

// UI COMPONENTS
import CartCard from "@/components/cards/CartCard";
import PageLayout from "@/components/layout/PageLayout";
import { Button, Divider, Spinner } from "@nextui-org/react";

// HOOKS
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { readProductsByIds } from "@/fetch/product";
import parseAmount from "@/utils/parseAmount";
import { useRouter } from "next/navigation";
import PageLayoutSpinner from "@/components/spinners/PageLayoutSpinner";
import { updateOneUser } from "@/fetch/user";
import { AnimatePresence } from "framer-motion";
import ProductModal from "@/components/modals/ProductModal";
import useURL from "@/hooks/useURL";
import CustomGrid from "@/components/layout/CustomGrid";
import CartFooter from "@/components/CartFooter";

// UTILS

function CartPage() {
  const { user, setUser } = useAuthContext();
  const [getSearchParams, setSearchParams] = useURL();
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
        productIds: user?.cart.map((cartItem) => cartItem.product),
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.info.nextPage;
    },
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!user?.cart?.length,
  });

  const { ref: loaderRef, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const products = data && data.pages.flatMap((page) => page.data);


  const product =
    products &&
    products.find(({ name }) => name === getSearchParams("product").product);

  if (!user) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center gap-10">
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
      </PageLayout>
    );
  }

  if (!user?.cart.length) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center gap-10">
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
      </PageLayout>
    );
  }
  if (status === "pending") {
    return <PageLayoutSpinner />;
  }
  return (
    <div className="flex flex-col items-center ">
      <div className="w-[min(80vw,1250px)]">
        <CustomGrid
          title={"Cart"}
          items={
            products &&
            user?.cart.map((cartItem, i) => {
              return (
                <CartCard
                  key={i}
                  {...{
                    product: products.find(
                      (product) => cartItem.product === product?._id
                    ),
                    cartItem,
                  }}
                />
              );
            })
          }
        />
        <CartFooter
          {...{
            products,
            ref: loaderRef,
            hasNextPage,
            fetchNextPage,
            isFetching,
          }}
        />
      </div>
      <AnimatePresence>
        {product && <ProductModal product={product} />}
      </AnimatePresence>
    </div>
  );
}

export default CartPage;
