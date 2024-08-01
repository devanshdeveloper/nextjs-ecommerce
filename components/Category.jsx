"use client";
import useURL from "@/hooks/useURL";
import ProductModal from "./modals/ProductModal";
import { AnimatePresence } from "framer-motion";
import CustomGrid from "./layout/CustomGrid";
import { Spinner } from "@nextui-org/react";
import { forwardRef } from "react";

const Category = forwardRef(
  (
    {
      category,
      products,
      isFetching,
      isPending,
      hasNextPage,
      error,
      PageLayout,
      PageLayoutSpinner,
      ProductCard,
      refetch
    },
    ref
  ) => {
    const [getSearchParams, setSearchParams] = useURL();

    const { product: productName } = getSearchParams("product");

    const product =
      products && products.find(({ name }) => productName === name);

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
          <CustomGrid
            title={category.name}
            items={
              products
                ? products.map((product, i) => {
                    return <ProductCard key={i} {...{ ...product }} />;
                  })
                : null
            }
          />
          {ref?.current && (
            <div className="h-full flex items-center justify-center" ref={ref}>
              {!hasNextPage && isFetching && <Spinner />}
            </div>
          )}
          <AnimatePresence>
            {product && <ProductModal product={product} />}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);
Category.displayName = "Category";
export default Category;
