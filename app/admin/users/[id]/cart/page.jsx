"use client";

// UI COMPONENTS
import CartCard from "@/components/cards/CartCard";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@nextui-org/react";

// HOOKS
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { readProductsByIds } from "@/fetch/product";
import { useParams, useRouter } from "next/navigation";
import PageLayoutSpinner from "@/components/spinners/PageLayoutSpinner";
import { readOneUser } from "@/fetch/user";
import useURL from "@/hooks/useURL";
import CustomGrid from "@/components/layout/CustomGrid";
import CartFooter from "@/components/CartFooter";

// UTILS

function AdminCartPage() {
  const [getSearchParams, setSearchParams] = useURL();
  const { id } = useParams();

  const { data: pageUser, isPending } = useQuery({
    queryKey: [`user_${id}`],
    queryFn: () => readOneUser({ id }),
    retry: false,
  });


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
    queryKey: [`cartProducts_${id}`],
    queryFn: (params) =>
      readProductsByIds({
        ...params,
        limit: 20,
        productIds: pageUser?.cart.map((cartItem) => cartItem.product),
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.info.nextPage;
    },
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!pageUser?.cart?.length,
  });

  const { ref: loaderRef, inView } = useInView();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const products = data && data.pages.flatMap((page) => page.data);

  const product =
    products &&
    products.find(({ name }) => name === getSearchParams("product").product);

  if (!pageUser?.cart?.length) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center gap-10">
          <div className="text-3xl">{pageUser?.name ?? "User"} Cart is Empty</div>
          <div className="flex gap-5">
            <Button
              variant="flat"
              color="primary"
              size="lg"
              onPress={() => router.back()}
            >
             Back
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }
  if (status === "pending") {
    return <PageLayoutSpinner />;
  }
  const setUser = (...args) =>
    queryClient.setQueryData([`user_${id}`], ...args)

  return (
    <div className="flex flex-col items-center ">
      <div className="w-[min(80vw,1250px)]">
        <CustomGrid
          title={"Cart"}
          items={
            products &&
            pageUser?.cart.map((cartItem, i) => {
              return (
                <CartCard
                  key={i}
                  {...{
                    product: products.find(
                      (product) => cartItem.product === product?._id
                    ),
                    cartItem,
                    user: pageUser,
                    setUser,
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
            user : pageUser, 
            setUser
          }}
        />
      </div>

    </div>
  );
}

export default AdminCartPage;
