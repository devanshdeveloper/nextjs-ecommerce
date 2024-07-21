"use client";

import AdminLayoutCover from "@/components/layout/AdminLayoutCover";
import { createCategory, getCategories } from "@/fetch/category";
import parseError from "@/utils/parseError";
import { Button, Input, Spinner } from "@nextui-org/react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useDebouncedCallback } from "use-debounce";
import CategoryCard from "@/components/cards/CategoryCard";

export default function CategoriesPage() {
  const [categoryInputValue, setCategoryInputValue] = useState("");
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
    queryKey: ["categories", searchValue],
    queryFn: (params) =>
      getCategories({ ...params, limit: 20, search: searchValue }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.info.nextPage;
    },
    refetchOnWindowFocus: false,
    retries: false,
  });

  const debouncedMutateSearchCategory = useDebouncedCallback((search) => {
    if (search.length < 3) return setSearchValue("");
    setSearchValue(search);
  }, 2000);

  const mutateCreateCategory = useMutation({
    mutationFn: (name) => createCategory({ name }),
    onSuccess: () => {
      refetch();
    },
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <>
      <div className="flex justify-between items-center p-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutateCreateCategory.mutate(categoryInputValue);
            setCategoryInputValue("");
          }}
          className="w-full flex items-center gap-2 "
        >
          <Input
            isDisabled={mutateCreateCategory.isPending}
            className="w-[300px]"
            type="text"
            label="Category"
            name="category"
            onValueChange={(value) => setCategoryInputValue(value)}
            value={categoryInputValue}
          />
          <Button
            isLoading={mutateCreateCategory.isPending}
            variant="flat"
            className="px-10 py-7 text-md"
            color="primary"
            type="submit"
          >
            Add Category
          </Button>
          {mutateCreateCategory.error && (
            <span className="text-red-500">
              {parseError(mutateCreateCategory.error)}
            </span>
          )}
        </form>
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
            debouncedMutateSearchCategory(value);
          }}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 p-10 lg:p-14 w-[calc(100vw-300px)]">
        {data ? (
          data.pages.map((page) => {
            return page.data.map((category, i) => {
              return <CategoryCard key={i} {...{ category, refetch }} />;
            });
          })
        ) : status === "pending" ? null : (
          <AdminLayoutCover>
            <div className="flex flex-col items-center gap-10">
              <div className="text-3xl">No Categories Found</div>
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
