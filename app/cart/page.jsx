"use client";

import CartCard from "@/components/cards/CartCard";
import ProductCard from "@/components/cards/ProductCard";
import AdminLayoutCover from "@/components/layout/AdminLayoutCover";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { getProductsByIds } from "@/fetch/product";
import { Button, Spinner } from "@nextui-org/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

function CartPage() {
  const { user } = useAuthContext();

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
      getProductsByIds({
        ...params,
        limit: 20,
        productIds: user.cart.map((cartItem) => cartItem.product),
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.info.nextPage;
    },
    refetchOnWindowFocus: false,
    retries: false,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <>
      <div
        className={`flex flex-col gap-3 md:gap-5 lg:gap-8`}
      >
        {data ? (
          data.pages.map((page) => {
            return page.data.map((product, i) => {
              return <CartCard key={i} {...{ ...product  }} />;
            });
          })
        ) : status === "pending" ? null : (
          <AdminLayoutCover>
            <div className="flex flex-col items-center gap-10">
              <div className="text-3xl">No Products Found</div>
              <Button
                variant="flat"
                color="primary"
                size="lg"
                onPress={() => router.back()}
              >
                Back
              </Button>
            </div>
          </AdminLayoutCover>
        )}
      </div>
      <div
        className="w-[calc(100vw-300px)] h-full flex items-center justify-center"
        ref={ref}
      >
        {hasNextPage && (
          <Button
            variant="flat"
            color="primary"
            size="lg"
            isLoading={isFetching}
            onClick={fetchNextPage}
          >
            Load More
          </Button>
        )}
        {!hasNextPage && isFetching && <Spinner />}
      </div>
    </>
  );
}

export default CartPage;
