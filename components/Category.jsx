"use client";
import { Button, ButtonGroup, Spinner } from "@nextui-org/react";
import ProductCard from "./cards/ProductCard";
import { TfiLayoutGrid4Alt, TfiLayoutGrid2Alt } from "react-icons/tfi";
import { RiLayoutGrid2Fill } from "react-icons/ri";
import { IoSquare } from "react-icons/io5";
import useWindowSize from "@/hooks/useWindowSize";

import { useCallback, useEffect, useState } from "react";
import getGridOption, { gridOptions } from "@/utils/getGridOption";
import { useDebouncedCallback } from "use-debounce";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { getProductsByCategory } from "@/fetch/product";
import AdminLayoutCover from "./layout/AdminLayoutCover";
import { useRouter } from "next/navigation";

function Category({ name, id }) {
  const router = useRouter();
  const [windowSize] = useWindowSize({
    onChange: useCallback((value) => {
      setGridOption(getGridOption(value));
    }, []),
  });

  const [gridOption, setGridOption] = useState(getGridOption(windowSize));

  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const {
    data,
    status,
    error,
    fetchNextPage,
    isFetching,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["products", searchValue],
    queryFn: (params) =>
      getProductsByCategory({
        ...params,
        limit: 20,
        search: searchValue,
        categoryId: id,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.info.nextPage;
    },
    refetchOnWindowFocus: false,
    retries: false,
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

  return (
    <div>
      <div className="flex justify-between">
        <div className="text-3xl font-bold my-5">{name}</div>
        <ButtonGroup>
          <Button
            className="md:hidden"
            isIconOnly
            isDisabled={gridOption === "1"}
            onClick={() => setGridOption("1")}
          >
            <IoSquare />
          </Button>
          <Button
            className="lg:hidden"
            isIconOnly
            isDisabled={gridOption === "2"}
            onClick={() => setGridOption("2")}
          >
            <TfiLayoutGrid2Alt />
          </Button>
          <Button
            className="hidden md:inline-flex"
            isIconOnly
            isDisabled={gridOption === "3"}
            onClick={() => setGridOption("3")}
          >
            <RiLayoutGrid2Fill size={20} />
          </Button>
          <Button
            className="hidden lg:inline-flex"
            isIconOnly
            isDisabled={gridOption === "4"}
            onClick={() => setGridOption("4")}
          >
            <TfiLayoutGrid4Alt size={18} />
          </Button>
        </ButtonGroup>
      </div>
      <div
        className={`grid ${gridOptions[gridOption]} gap-3 md:gap-5 lg:gap-8`}
      >
        {data ? (
          data.pages.map((page) => {
            return page.data.map((product, i) => {
              return <ProductCard key={i} {...{ ...product }} />;
            });
          })
        ) : status === "pending" ? null : (
          <AdminLayoutCover>
            <div className="flex flex-col items-center gap-10">
              <div className="text-3xl">No Products Found</div>
              <Button
                variant="flat"
                color="primary"
                size="lg"
                onPress={() => router.back()}
              >
                Back
              </Button>
            </div>
          </AdminLayoutCover>
        )}
      </div>
      <div
        className="w-[calc(100vw-300px)] h-full flex items-center justify-center"
        ref={ref}
      >
        {hasNextPage && (
          <Button
            variant="flat"
            color="primary"
            size="lg"
            isLoading={isFetching}
            onClick={fetchNextPage}
          >
            Load More
          </Button>
        )}
        {!hasNextPage && isFetching && <Spinner />}
      </div>
    </div>
  );
}

export default Category;
