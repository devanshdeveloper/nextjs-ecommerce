"use client";

// UTILS
import { readAllProducts } from "@/fetch/product";

// HOOKS
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useDebouncedCallback } from "use-debounce";

function useProducts(param) {
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetching,
    hasNextPage,
    isPending,
    refetch,
  } = useInfiniteQuery({
    queryKey: [...param.queryKey, searchValue],
    queryFn: (params) => {
      if (param?.queryFn) {
        return param?.queryFn({ ...params, limit: 20, search: searchValue });
      } else {
        return readAllProducts({ ...params, limit: 20, search: searchValue });
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.info.nextPage;
    },
    refetchOnWindowFocus: false,
    retry: false,
    enabled: param.enabled === false ? false : true,
  });

  const debouncedMutateSearchProduct = useDebouncedCallback((search) => {
    if (search.length < 3) return setSearchValue("");
    setSearchValue(search);
  }, 2000);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const products = data && data.pages.flatMap((page) => page.data);

  return {
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
  };
}

export default useProducts;
