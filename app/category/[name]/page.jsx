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
    data,
    status,
    error,
    fetchNextPage,
    isFetching,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: [`products_${name}`],
    queryFn: (params) =>
      readProductsByCategoryId({
        ...params,
        limit: 20,
        search: "",
        categoryId: category._id,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.info.nextPage;
    },
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!category?._id,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <div>
      <div
        className="h-full flex items-center justify-center"
        ref={ref}
      >
        {category && data && (
          <Category
            category={category}
            products={data.pages.map((page) => page.data)[0]}
          />
        )}
        {hasNextPage && (
          <Button
            variant="flat"
            color="primary"
            size="lg"
            isLoading={isFetching}
            onPress={fetchNextPage}
          >
            Load More
          </Button>
        )}
        {!hasNextPage && isFetching && <Spinner />}
      </div>
    </div>
  );
}
