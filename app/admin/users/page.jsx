"use client";

// COMPONENTS
import AdminLayoutCover from "@/components/layout/AdminLayoutCover";
import { Avatar, Button, Spinner, Input } from "@nextui-org/react";
import AdminLayoutSpinner from "@/components/spinners/AdminLayoutSpinner";
import { IoIosArrowForward } from "react-icons/io";

// UTILS
import { getUsers } from "@/fetch/user";

// HOOKS
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useDebouncedCallback } from "use-debounce";

export default function UsersPage() {
  const router = useRouter();
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const { data, status, error, fetchNextPage, isFetching, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["users", searchValue],
      queryFn: (params) =>
        getUsers({ ...params, limit: 20, search: searchValue }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        return lastPage.info.nextPage;
      },
      refetchOnWindowFocus: false,
      retry: false,
    });

  const debouncedMutateSearchUser = useDebouncedCallback((search) => {
    if (search.length < 3) return setSearchValue("");
    setSearchValue(search);
  }, 2000);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  function User({ user }) {
    return (
      <div key={user._id} className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar
            onClick={() => router.push(`/admin/users/${user._id}/details`)}
            className="w-12 h-12 cursor-pointer"
            src={user.image}
            name={user.name}
          />
          <div className="">
            <div>{user.name}</div>
            <div className="text-sm">{user.email}</div>
          </div>
        </div>
        <div>
          <Button
            color="primary"
            variant="flat"
            isIconOnly
            onClick={() => {
              router.push(`/admin/users/${user._id}/details`);
            }}
          >
            <IoIosArrowForward size={20} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mr-10 mt-10">
        <Input
          className="w-[300px]"
          isClearable
          isInvalid={
            searchInputValue.length < 3 && searchInputValue.length !== 0
          }
          errorMessage="Enter atleast three characters to search"
          type="text"
          label="Search"
          variant="bordered"
          isDisabled={status === "pending"}
          value={searchInputValue}
          onValueChange={(value) => {
            setSearchInputValue(value);
            debouncedMutateSearchUser(value);
          }}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 p-10 lg:p-14 w-[calc(100vw-300px)]">
        {data ? (
          data.pages.map((page) => {
            return page.data.map((user) => {
              return <User key={user._id} user={user} />;
            });
          })
        ) : status === "pending" ? null : (
          <AdminLayoutCover>
            <div className="flex flex-col items-center gap-10">
              <div className="text-3xl">No Users Found</div>
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
    </>
  );
}
