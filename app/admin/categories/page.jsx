"use client";

// UI COMPONENTS
import AdminLayoutCover from "@/components/layout/AdminLayoutCover";
import { Button, Input, Spinner, useDisclosure } from "@nextui-org/react";
import CategoryCard from "@/components/cards/CategoryCard";

// UTILS
import { createOneCategory, readAllCategory } from "@/fetch/category";
import parseError from "@/utils/parseError";

// HOOKS
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useDebouncedCallback } from "use-debounce";
import EditCategoryModal from "@/components/modals/category/EditCategoryModal";
import DeleteOneCategoryModal from "@/components/modals/category/DeleteOneCategoryModal";

export default function CategoriesPage() {
  const router = useRouter();

  // STATE
  const [currentActionCategory, setCurrentActionCategory] = useState({
    action: null,
    category: null,
  });
  const [categoryInputValue, setCategoryInputValue] = useState("");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const {
    isOpen: isOpenEditCategoryModal,
    onOpen: onOpenEditCategoryModal,
    onOpenChange: onOpenChangeEditCategoryModal,
    onClose: onCloseEditCategoryModal,
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteOneCategoryModal,
    onOpen: onOpenDeleteOneCategoryModal,
    onOpenChange: onOpenChangeDeleteOneCategoryModal,
    onClose: onCloseDeleteOneCategoryModal,
  } = useDisclosure();

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
      readAllCategory({ ...params, limit: 20, search: searchValue }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.info.nextPage;
    },
    refetchOnWindowFocus: false,
    retry: false,
  });

  const debouncedMutateSearchCategory = useDebouncedCallback((search) => {
    if (search.length < 3) return setSearchValue("");
    setSearchValue(search);
  }, 2000);

  const mutateCreateCategory = useMutation({
    mutationFn: (name) => createOneCategory({ name }),
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
      <div className="flex flex-col md:flex-row gap-5 justify-between items-center p-2 md:p-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutateCreateCategory.mutate(categoryInputValue);
            setCategoryInputValue("");
          }}
          className="w-full flex  flex-col md:flex-row items-center gap-2 "
        >
          <Input
            isDisabled={mutateCreateCategory.isPending}
            className="w-[300px]"
            type="text"
            label="Category"
            name="category"
            size="sm"
            variant="bordered"
            onValueChange={(value) => setCategoryInputValue(value)}
            value={categoryInputValue}
            />
          <Button
            isLoading={mutateCreateCategory.isPending}
            size="sm"
            color="primary"
            variant="bordered"
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
          variant="bordered"
          size="sm"
          isInvalid={
            searchInputValue.length < 3 && searchInputValue.length !== 0
          }
          errorMessage="Enter atleast three characters to search"
          type="text"
          label="Search"
          isDisabled={status === "pending"}
          value={searchInputValue}
          onValueChange={(value) => {
            setSearchInputValue(value);
            debouncedMutateSearchCategory(value);
          }}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-10  p-2 sm:p-5 md:p-10 !pt-0">
        {data ? (
          data.pages.map((page) => {
            return page.data.map((category, i) => {
              return (
                <CategoryCard
                  key={i}
                  {...{
                    category,
                    onOpenChangeDeleteOneCategoryModal,
                    onOpenChangeEditCategoryModal,
                    setCurrentActionCategory,
                    refetch
                  }}
                />
              );
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
      {currentActionCategory.action === "edit" && (
        <EditCategoryModal
          {...{
            isOpenEditCategoryModal,
            onOpenChangeEditCategoryModal,
            onOpenEditCategoryModal,
            onCloseEditCategoryModal,
            category:
              currentActionCategory.action === "edit" &&
              currentActionCategory.category,
            refetch,
          }}
        />
      )}
      {currentActionCategory.action === "delete" && (
        <DeleteOneCategoryModal
          {...{
            isOpenDeleteOneCategoryModal,
            onOpenChangeDeleteOneCategoryModal,
            onOpenDeleteOneCategoryModal,
            onCloseDeleteOneCategoryModal,
            category:
              currentActionCategory.action === "delete" &&
              currentActionCategory.category,
            refetch,
          }}
        />
      )}
    </>
  );
}
