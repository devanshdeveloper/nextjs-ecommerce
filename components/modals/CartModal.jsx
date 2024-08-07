import { CgClose } from "react-icons/cg";
import { useCallback, useEffect } from "react";
import useURL from "@/hooks/useURL";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../providers/AuthProvider";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { readProductsByIds } from "@/fetch/product";
import CartFooter from "../CartFooter";
import CartCard from "../cards/CartCard";
import removeDuplicates from "@/utils/removeDuplicates";
import ModalFrame from "./ModalFrame";

function CartModal() {
  const { user, setUser } = useAuthContext();
  const router = useRouter();

  const [_, setSearchParams] = useURL();

  const productIds = removeDuplicates(
    user?.cart?.map((cartItem) => cartItem.product)
  );

  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetching,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["cartProducts", `${productIds?.join(", ")}`],
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

  const { ref: loaderRef, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const products = data && data.pages.flatMap((page) => page.data);

  const closeModal = useCallback(() => {
    setSearchParams({ showCartModal: "" });
  }, [setSearchParams]);

  let contents = null;

  if (!user?.cart?.length) {
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

  return (
    <ModalFrame {...{ closeModal }}>
      <button className="absolute top-10 md:top-5 right-5" onClick={closeModal}>
        <CgClose
          size={20}
          className=" text-foreground-700 hover:text-foreground-800"
        />
      </button>
      {contents && contents}

      {!contents && (
        <>
          <h2 className="text-3xl font-bold text-foreground-700 mb-5">Cart</h2>
          <div className="flex flex-col gap-5">
            {products &&
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
              })}
          </div>
          <CartFooter
            {...{
              products,
              ref: loaderRef,
              hasNextPage,
              fetchNextPage,
              isFetching,
              user,
              setUser,
            }}
          />
        </>
      )}
    </ModalFrame>
  );
}

export default CartModal;
