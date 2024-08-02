"use client";

// UI COMPONENTS
import CartCard from "@/components/cards/CartCard";
import PageLayout from "@/components/layout/PageLayout";
import { Button, Spinner } from "@nextui-org/react";

// HOOKS
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { readProductsByIds } from "@/fetch/product";
import { useRouter } from "next/navigation";
import PageLayoutSpinner from "@/components/spinners/PageLayoutSpinner";
import useURL from "@/hooks/useURL";
import CustomGrid from "@/components/layout/CustomGrid";
import CartFooter from "@/components/CartFooter";
import removeDuplicates from "@/utils/removeDuplicates";
import { AnimatePresence } from "framer-motion";
import ProductModal from "@/components/modals/ProductModal";

// UTILS

function CartPage() {
  const { user, setUser } = useAuthContext();
  const [getSearchParams, setSearchParams] = useURL();
  const router = useRouter();

  const productIds = removeDuplicates(
    user?.cart.map((cartItem) => cartItem.product)
  );

  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetching,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["cartProducts", productIds?.join(", ")],
    queryFn: (params) =>
      readProductsByIds({
        ...params,
        limit: 20,
        productIds,
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

  const products = data && data.pages.flatMap((page) => page.data);
  const { product: productName } = getSearchParams("product");

  const product = products && products.find(({ name }) => productName === name);

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
          message={`Showing ${user?.cart.length} product${user?.cart.length === 1 ? "" : "s"}`}
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
                    user,
                    setUser,
                  }}
                />
              );
            })
          }
        />
        <div className="flex items-center justify-center py-10" ref={ref}>
          {hasNextPage && isFetching && <Spinner />}
        </div>
        <AnimatePresence>
          {product && <ProductModal product={product} />}
        </AnimatePresence>
        <CartFooter
          {...{
            products,
            ref,
            hasNextPage,
            fetchNextPage,
            isFetching,
            user,
            setUser,
          }}
        />
      </div>
    </div>
  );
}

export default CartPage;
