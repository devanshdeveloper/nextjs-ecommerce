"use client";

// COMPONENTS
import AdminLayoutCover from "@/components/layout/AdminLayoutCover";
import { Avatar, Button, Spinner, Input } from "@nextui-org/react";
import { IoIosArrowForward } from "react-icons/io";

// UTILS
import { readAllUsers } from "@/fetch/user";

// HOOKS
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useDebouncedCallback } from "use-debounce";
import Link from "next/link";
import CardFrame from "@/components/cards/CardFrame";

export default function UsersPage() {
  const router = useRouter();
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const { data, status, error, fetchNextPage, isFetching, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["users", searchValue],
      queryFn: (params) =>
        readAllUsers({ ...params, limit: 20, search: searchValue }),
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

  const users = data && data.pages.flatMap((page) => page.data);
  function User({ user }) {
    return (
      <div key={user?._id} className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-5">
          <Avatar
            onClick={() => router.push(`/admin/users/${user?._id}/details`)}
            className="w-10 h-10 md:w-12 md:h-12 cursor-pointer"
            src={user.image}
            name={user.name}
          />
          <div className="">
            <div className="text-sm md:text-medium">{user.name}</div>
            <div className="text-xs md:text-sm">{user.email}</div>
          </div>
        </div>
        <div>
          <Button
            color="primary"
            variant="flat"
            isIconOnly
            size="sm"
            onPress={() => {
              router.push(`/admin/users/${user?._id}/details`);
            }}
          >
            <IoIosArrowForward size={20} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-5 lg:p-10">
      <div className="flex justify-center md:justify-end">
        <Input
          className="w-full md:w-[300px] rounded-md "
          isClearable
          isInvalid={
            searchInputValue.length < 3 && searchInputValue.length !== 0
          }
          errorMessage="Enter at least three characters to search"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-8 lg:gap-10 mt-5 md:mt-10">
        {users ? (
          users.map((user) => (
            <CardFrame
              onClick={() => router.push(`/admin/users/${user._id}/details`)}
              key={user?._id}
              className="p-4 flex items-center gap-4"
            >
              <div className="w-16 h-16">
                <Avatar
                  size="lg"
                  shape="rounded"
                  src={user.image}
                  name={user.name}
                />
              </div>
              <div className="w-full">
                <div className="text-xl font-semibold text-foreground-800 truncate w-full">
                  {user.name}
                </div>
                <div className="text-sm text-foreground-500 truncate w-full">{user.email}</div>
              </div>
            </CardFrame>
          ))
        ) : status === "pending" ? null : (
          <AdminLayoutCover>
            <div className="flex flex-col items-center gap-6">
              <div className="text-2xl text-foreground-600">No Users Found</div>
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

      <div className="h-full flex items-center justify-center p-5">
        {hasNextPage && isFetching && <Spinner />}
      </div>
    </div>
  );
}
