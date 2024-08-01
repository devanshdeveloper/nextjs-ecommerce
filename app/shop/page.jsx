"use client";

// UTILS
import { feedProducts } from "@/fetch/product";

// HOOKS
import { useQuery } from "@tanstack/react-query";

// COMPONENTS
import PageLayoutSpinner from "@/components/spinners/PageLayoutSpinner";
import PageLayout from "@/components/layout/PageLayout";
import Category from "@/components/Category";
import ProductCard from "@/components/cards/ProductCard";

function ShopPage() {
  const { data, isPending, isFetching, error } = useQuery({
    queryKey: [`feed`],
    queryFn: feedProducts,
    retry: false,
  });

  return (
    <>
      {data &&
        data.categories.map(({ category, products }) => {
          return (
            <Category
              {...{
                category,
                products,
                isFetching,
                isPending,
                error,
                PageLayout: PageLayout,
                PageLayoutSpinner: PageLayoutSpinner,
                ProductCard: ProductCard,
                titleHref : `/category/${category.name}`
              }}
              key={category._id}
            />
          );
        })}
    </>
  );
}

export default ShopPage;
