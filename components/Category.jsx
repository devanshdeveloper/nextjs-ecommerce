"use client";

// UTILS
import getGridOption from "@/utils/getGridOption";

// HOOKS
import useWindowSize from "@/hooks/useWindowSize";
import { useCallback, useState } from "react";

// UI COMPONENTS
import { Button, ButtonGroup } from "@nextui-org/react";
import { IoSquare } from "react-icons/io5";
import { TfiLayoutGrid2Alt, TfiLayoutGrid4Alt } from "react-icons/tfi";
import { RiLayoutGrid2Fill } from "react-icons/ri";
import ProductCard from "./cards/ProductCard";
import useURL from "@/hooks/useURL";
import ProductModal from "./modals/ProductModal";
import { AnimatePresence } from "framer-motion";
import CustomGrid from "./layout/CustomGrid";
import CartModal from "./modals/CartModal";

function Category({ category, products }) {
  const [getSearchParams, setSearchParams] = useURL();

  const { product: productName } = getSearchParams("product");

  const product = products && products.find(({ name }) => productName === name);

  return (
    <>
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
      <AnimatePresence>
        {product && <ProductModal product={product} />}
      </AnimatePresence>
    </>
  );
}

export default Category;
