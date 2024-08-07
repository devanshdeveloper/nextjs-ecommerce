"use client";

// UI COMPONENTS
import { Button, Input, Spinner, useDisclosure } from "@nextui-org/react";
import CategoryCard from "@/components/cards/CategoryCard";

// UTILS
import { createOneCategory, readAllCategory } from "@/fetch/category";
import parseError from "@/utils/parseError";

// HOOKS
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useDebouncedCallback } from "use-debounce";
import EditCategoryModal from "@/components/modals/category/EditCategoryModal";
import DeleteOneCategoryModal from "@/components/modals/category/DeleteOneCategoryModal";
import { pushInfiniteQueryData } from "@/utils/react-query";
import PageLayoutSpinner from "@/components/spinners/PageLayoutSpinner";
import PageLayout from "@/components/layout/PageLayout";
import useOptimisticMutation from "@/hooks/useOptimisticMutation";
import useInfiniteQueryExtended from "@/hooks/useInfiniteQueryExtended";

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
  const queryClient = useQueryClient();

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
    flatData: categories,
    status,
    error,
    ref,
    hasNextPage,
    isFetching,
    isPending,
  } = useInfiniteQueryExtended({
    queryKey: ["categories", searchValue],
    queryFn: (params) =>
      readAllCategory({ ...params, limit: 20, search: searchValue }),
  });

  const debouncedMutateSearchCategory = useDebouncedCallback((search) => {
    if (search.length < 3) return setSearchValue("");
    setSearchValue(search);
  }, 2000);

  const mutateCreateCategory = useOptimisticMutation({
    infiniteQueryKeys: ["categories"],
    mutationFn: (name) => createOneCategory({ name }),
    actionFunc: (newData, oldData) =>
      pushInfiniteQueryData({
        data: oldData,
        pageIndex: 0,
        newData: { name: newData, _id: "23455" },
        pushIndex: "last",
      }),
  });

  function renderContent() {
    if (isPending) {
      return <PageLayoutSpinner />;
    }
    if (error) {
      return (
        <PageLayout>
          <h1>An error occurred while fetching products.</h1>
          <p>{error.message}</p>
          <p>Please try again later.</p>
        </PageLayout>
      );
    }
    if (categories?.length === 0) {
      return (
        <PageLayout className={"flex-col gap-3"}>
          <p className="text-2xl text-center">No categories found.</p>
          {!searchValue && (
            <p className="text-center">Add some categories to start.</p>
          )}
        </PageLayout>
      );
    }
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-10  p-2 sm:p-5 md:p-10 !pt-0">
        {data.pages.map((page, i) => {
          return page.data.map((category) => {
            return (
              <CategoryCard
                key={category.name}
                {...{
                  category,
                  onOpenChangeDeleteOneCategoryModal,
                  onOpenChangeEditCategoryModal,
                  setCurrentActionCategory,
                  pageIndex: i,
                }}
              />
            );
          });
        })}
      </div>
    );
  }

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
      {renderContent()}
      <div className="h-full flex items-center justify-center" ref={ref}>
        {hasNextPage && isFetching && <Spinner />}
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
            pageIndex: currentActionCategory.pageIndex,
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
            pageIndex: currentActionCategory.pageIndex,
          }}
        />
      )}
    </>
  );
}
