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
    if (data.categories?.length === 0) {
      return (
        <PageLayout className={"flex-col gap-3"}>
          <p className="text-2xl text-center">No categories found.</p>
          <p className="text-center">Add some categories to start.</p>
        </PageLayout>
      );
    }
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
                  productsCount: products.length,
                  PageLayout: PageLayout,
                  PageLayoutSpinner: PageLayoutSpinner,
                  ProductCard: ProductCard,
                  titleHref: `/category/${category.name}`,
                }}
                key={category._id}
              />
            );
          })}
      </>
    );
  }

  return <>{renderContent()}</>;
}

export default ShopPage;
