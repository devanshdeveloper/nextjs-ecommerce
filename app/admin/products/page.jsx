"use client";

// UI COMPONENTS
import AdminLayoutCover from "@/components/layout/AdminLayoutCover";
import { Button, Input, Spinner } from "@nextui-org/react";

// UTILS
import { readAllProducts } from "@/fetch/product";
import parseError from "@/utils/parseError";

// HOOKS
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useDebouncedCallback } from "use-debounce";
import AdminProductCard from "@/components/cards/AdminProductCard";

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
      readAllProducts({ ...params, limit: 20, search: searchValue }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.info.nextPage;
    },
    refetchOnWindowFocus: false,
    retry: false,
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
      <div className="flex flex-col md:flex-row justify-between items-center p-5 gap-5 md:px-10">
        <Button
          variant="flat"
          color="primary"
          onPress={() => router.push("/admin/products/create")}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-10 p-2 md:p-5 lg:p-10">
        {data ? (
          data.pages.map((page) => {
            return page.data.map((product, i) => {
              return <AdminProductCard key={i} {...{ ...product  , refetch}} />;
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
        className="h-full flex items-center justify-center"
        ref={ref}
      >
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
    </>
  );
}
