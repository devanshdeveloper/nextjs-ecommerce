"use client";
import useURL from "@/hooks/useURL";
import ProductModal from "./modals/ProductModal";
import { AnimatePresence } from "framer-motion";
import CustomGrid from "./layout/CustomGrid";
import { Spinner } from "@nextui-org/react";
import { forwardRef } from "react";
import { getProductsCountMessage } from "@/utils/message";

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
      titleHref,
      productsCount,
    },
    ref
  ) => {
    const [getSearchParams, setSearchParams] = useURL();

    const { product: productName } = getSearchParams("product");

    const product =
      products && products.find((item) => productName === item?.name);

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
        <div className="w-[min(95vw,1250px)]">
          <CustomGrid
            href={titleHref}
            title={category.name}
            message={getProductsCountMessage(productsCount)}
            items={
              products
                ? products.map((product, i) => {
                    return (
                      <ProductCard key={i} {...{ index: i, ...product }} />
                    );
                  })
                : null
            }
          />

          <div className="flex items-center justify-center py-10" ref={ref}>
            {hasNextPage && isFetching && <Spinner />}
          </div>
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
