"use client";

// UTILS
import { readAllProducts } from "@/fetch/product";

// HOOKS
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useDebouncedCallback } from "use-debounce";
import useInfiniteQueryExtended from "./useInfiniteQueryExtended";

function useProducts(param) {
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const queryResults = useInfiniteQueryExtended({
    queryKey: [...param.queryKey, searchValue],
    queryFn: (params) => {
      if (param?.queryFn) {
        return param?.queryFn({ ...params, limit: 20, search: searchValue });
      } else {
        return readAllProducts({ ...params, limit: 20, search: searchValue });
      }
    },
    enabled: param.enabled === false ? false : true,
  });

  const debouncedMutateSearchProduct = useDebouncedCallback((search) => {
    if (search.length < 3) return setSearchValue("");
    setSearchValue(search);
  }, 2000);

  return {
    ...queryResults,
    setSearchInputValue,
    debouncedMutateSearchProduct,
    searchInputValue,
    searchValue,
    setSearchValue,
  };
}

export default useProducts;
