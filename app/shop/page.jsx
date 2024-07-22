"use client";

// UTILS
import { feedProducts } from "@/fetch/product";

// HOOKS
import { useQuery } from "@tanstack/react-query";

// COMPONENTS
import PageLayoutSpinner from "@/components/spinners/PageLayoutSpinner";
import PageLayout from "@/components/layout/PageLayout";
import Category from "@/components/Category";

function ShopPage() {
  const { data, isPending, error } = useQuery({
    queryKey: [`feed`],
    queryFn: feedProducts,
    retry: false,
  });

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

  return (
    <div className="flex justify-center">
      <div className="w-[min(80vw,1250px)]">
        {data.categories.map(({ category, products }) => {
          return (
            <Category
              key={category._id}
              category={category}
              products={products}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ShopPage;
