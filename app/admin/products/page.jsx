"use client";

import AdminLayoutCover from "@/components/layout/AdminLayoutCover";
import { getProducts } from "@/fetch/product";
import parseError from "@/utils/parseError";
import { Button, Input, Spinner } from "@nextui-org/react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useDebouncedCallback } from "use-debounce";
import ProductCard from "@/components/cards/ProductCard";

export default function ProductsPage() {
  const router = useRouter();
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetching,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["products", searchValue],
    queryFn: (params) =>
      getProducts({ ...params, limit: 20, search: searchValue }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.info.nextPage;
    },
    refetchOnWindowFocus: false,
    retries: false,
  });

  const debouncedMutateSearchProduct = useDebouncedCallback((search) => {
    if (search.length < 3) return setSearchValue("");
    setSearchValue(search);
  }, 2000);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <>
      <div className="flex justify-between items-center p-10">
        <Button
          variant="flat"
          color="primary"
          onClick={() => router.push("/admin/products/create")}
        >
          Create
        </Button>
        <Input
          className="w-[300px]"
          isClearable
          isInvalid={
            searchInputValue.length < 3 && searchInputValue.length !== 0
          }
          errorMessage="Enter atleast three characters to search"
          type="text"
          label="Search"
          variant="bordered"
          isDisabled={status === "pending"}
          value={searchInputValue}
          onValueChange={(value) => {
            setSearchInputValue(value);
            debouncedMutateSearchProduct(value);
          }}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 p-10 lg:p-14 w-[calc(100vw-300px)]">
        {data ? (
          data.pages.map((page) => {
            return page.data.map((product, i) => {
              return <ProductCard key={i} {...{ ...product }} />;
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
