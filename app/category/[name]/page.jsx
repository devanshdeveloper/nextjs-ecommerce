"use client";

// HOOKS
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

// UI COMPONENTS
import { Button, Spinner } from "@nextui-org/react";

// UTILS
import { readByNameCategory } from "@/fetch/category";
import { readProductsByCategoryId } from "@/fetch/product";
import Category from "@/components/Category";
import useProducts from "@/hooks/useProducts";
import PageLayout from "@/components/layout/PageLayout";
import PageLayoutSpinner from "@/components/spinners/PageLayoutSpinner";
import ProductCard from "@/components/cards/ProductCard";

export default function CategoryPage() {
  const { name } = useParams();
  const router = useRouter();

  const { data: category } = useQuery({
    queryKey: ["category", name],
    queryFn: () => readByNameCategory({ name }),
    refetchOnWindowFocus: false,
    retry: false,
  });

  const {
    searchInputValue,
    products,
    ref,
    debouncedMutateSearchProduct,
    hasNextPage,
    isFetching,
    refetch,
    setSearchInputValue,
    isPending,
    error,
  } = useProducts({
    queryKey: [`products_${name}`],
    queryFn: (params) =>
      readProductsByCategoryId({
        ...params,
        limit: 20,
        search: "",
        categoryId: category._id,
      }),
    enabled: !!category?._id,
  });

  return (
    <div>
      <div className="h-full flex items-center justify-center">
        {category && (
          <Category
            {...{
              category,
              products,
              isFetching,
              isPending,
              hasNextPage,
              error,
              PageLayout: PageLayout,
              PageLayoutSpinner: PageLayoutSpinner,
              ProductCard: ProductCard,
              ref,
              refetch,
            }}
          />
        )}
      </div>
    </div>
  );
}
