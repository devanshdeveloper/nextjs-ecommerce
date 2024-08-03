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
import PageLayoutSpinner from "@/components/spinners/PageLayoutSpinner";
import PageLayout from "@/components/layout/PageLayout";

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
  console.log(products);

  if (isPending) {
    return <PageLayoutSpinner />;
  }
  if (!products?.length) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-2">
            <div className="text-3xl">Try adding some products</div>
            <div className="text-foreground-500 text-sm">
              You have not added any products
            </div>
          </div>
          <div className="flex gap-5">
            <Button
              variant="flat"
              color="primary"
              size="lg"
              onPress={() => router.push("/admin/products/create")}
            >
              Create Products
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

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
          ProductCard: AdminProductCard,
          ref,
          refetch,
        }}
      />
    </>
  );
}
