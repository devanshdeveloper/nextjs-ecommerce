"use client";

// UI COMPONENTS
import CartCard from "@/components/cards/CartCard";
import PageLayout from "@/components/layout/PageLayout";
import { Button, Spinner } from "@nextui-org/react";

// HOOKS
import { useAuthContext } from "@/components/providers/AuthProvider";
import { readProductsByIds } from "@/fetch/product";
import { useRouter } from "next/navigation";
import PageLayoutSpinner from "@/components/spinners/PageLayoutSpinner";
import useURL from "@/hooks/useURL";
import CustomGrid from "@/components/layout/CustomGrid";
import CartFooter from "@/components/CartFooter";
import removeDuplicates from "@/utils/removeDuplicates";
import { AnimatePresence } from "framer-motion";
import ProductModal from "@/components/modals/ProductModal";
import useInfiniteQueryExtended from "@/hooks/useInfiniteQueryExtended";

// UTILS

function CartPage({ user, setUser }) {
  const [getSearchParams, setSearchParams] = useURL();
  const router = useRouter();

  const productIds = removeDuplicates(
    user?.cart?.map((cartItem) => cartItem.product)
  );

  const {
    flatData: products,
    ref,
    error,
    isPending,
    fetchNextPage,
    isFetching,
    hasNextPage,
  } = useInfiniteQueryExtended({
    queryKey: ["cartProducts", productIds?.join(", ")],
    queryFn: (params) =>
      readProductsByIds({
        ...params,
        limit: 20,
        productIds,
      }),
    enabled: !!user?.cart?.length,
  });

  const { product: productName } = getSearchParams("product");

  const product =
    products &&
    productName &&
    products.find((item) => productName === item?.name);

  function renderContent() {
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

    if (user?.cart?.length && isPending) {
      return <PageLayoutSpinner />;
    }
    if (error) {
      return (
        <PageLayout>
          <h1>An error occurred while fetching your cart.</h1>
          <p>{error.message}</p>
          <p>Please try again later.</p>
        </PageLayout>
      );
    }
    if (user?.cart?.length === 0 || !products?.length) {
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
    return (
      <>
        <div className="flex flex-col items-center justify-center">
          <div className="w-[min(95vw,1250px)]">
            <CustomGrid
              title={"Cart"}
              message={`Showing ${user?.cart.length} product${
                user?.cart.length === 1 ? "" : "s"
              }`}
              items={
                products &&
                user?.cart?.map((cartItem, i) => {
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
      </>
    );
  }

  return <>{renderContent()}</>;
}

export default CartPage;
