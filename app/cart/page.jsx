"use client";

// UI COMPONENTS
import CartCard from "@/components/cards/CartCard";
import AdminLayoutCover from "@/components/layout/AdminLayoutCover";
import { Button, Divider, Spinner } from "@nextui-org/react";

// HOOKS
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { readProductsByIds } from "@/fetch/product";
import parseAmount from "@/utils/parseAmount";
import { useRouter } from "next/navigation";

// UTILS

function CartPage() {
  const { user } = useAuthContext();
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
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const products = data && data.pages.flatMap((page) => page.data);

  function calculateAmount(cart, products) {
    if (!cart || !products) return 0;
    let amount = 0;
    for (let i = 0; i < cart.length; i++) {
      const cartItem = cart[i];
      const product = products.find((p) => p._id === cartItem.product);
      amount += product.price * cartItem.quantity;
    }
    return parseAmount(amount);
  }

  return (
    <>
      <div className="flex flex-col items-center">
        <div
          className={`flex flex-col gap-3 md:gap-5 lg:gap-8 items-center w-[min(80vw,1000px)] m-5 lg:m-10`}
        >
          {data ? (
            data.pages.map((page) => {
              return page.data.map((product, i) => {
                return <CartCard key={i} {...{ ...product }} />;
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
          <div className="h-full flex items-center justify-center" ref={ref}>
            {hasNextPage && (
              <Button
                variant="flat"
                color="primary"
                size="lg"
                isLoading={isFetching}
                onPress={fetchNextPage}
              >
                Load More
              </Button>
            )}
            {!hasNextPage && isFetching && <Spinner />}
          </div>
          <Divider />
          <div className="flex w-full justify-between">
            <div className="text-2xl">Amount : </div>
            <div className="text-2xl">
              {calculateAmount(user.cart, products)}
            </div>
          </div>
          <div className="flex w-full justify-end">
            <Button
              variant="bordered"
              color="primary"
              onPress={() => router.push("/checkout")}
            >
              Continue to Checkout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartPage;
