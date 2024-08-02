"use client";

// UI COMPONENTS
import AdminLayoutCover from "@/components/layout/AdminLayoutCover";
import { Button, Input } from "@nextui-org/react";

// HOOKS
import { useRouter } from "next/navigation";
import useProducts from "@/hooks/useProducts";
import Category from "@/components/Category";
import AdminLayoutSpinner from "@/components/spinners/AdminLayoutSpinner";
import AdminProductCard from "@/components/cards/AdminProductCard";

export default function ProductsPage() {
  const router = useRouter();

  const {
    searchInputValue,
    products,
    ref,
    debouncedMutateSearchProduct,
    hasNextPage,
    isFetching,
    setSearchInputValue,
    refetch,
    isPending,
    error,
  } = useProducts({
    queryKey: ["products"],
  });

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
      <Category
        {...{
          category: { name: "Products" },
          products,
          isFetching,
          isPending,
          hasNextPage,
          error,
          PageLayout: AdminLayoutCover,
          PageLayoutSpinner: AdminLayoutSpinner,
          ProductCard : AdminProductCard,
          ref,
          refetch
        }}
      />
    </>
  );
}
