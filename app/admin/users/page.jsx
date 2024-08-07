"use client";

// COMPONENTS
import { Avatar, Button, Spinner, Input } from "@nextui-org/react";

// UTILS
import { readAllUsers } from "@/fetch/user";

// HOOKS
import { useRouter } from "next/navigation";
import {  useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import CardFrame from "@/components/cards/CardFrame";
import PageLayoutSpinner from "@/components/spinners/PageLayoutSpinner";
import PageLayout from "@/components/layout/PageLayout";
import useInfiniteQueryExtended from "@/hooks/useInfiniteQueryExtended";

export default function UsersPage() {
  const router = useRouter();
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const {
    flatData: users,
    isPending,
    error,
    isFetching,
    hasNextPage,
    ref
  } = useInfiniteQueryExtended({
    queryKey: ["users", searchValue],
    queryFn: (params) =>
      readAllUsers({ ...params, limit: 20, search: searchValue }),
  });

  const debouncedMutateSearchUser = useDebouncedCallback((search) => {
    if (search.length < 3) return setSearchValue("");
    setSearchValue(search);
  }, 2000);

  function renderContent() {
    if (isPending) {
      return <PageLayoutSpinner />;
    }
    if (error) {
      return (
        <PageLayout>
          <h1>An error occurred while fetching users.</h1>
          <p>{error.message}</p>
          <p>Please try again later.</p>
        </PageLayout>
      );
    }
    if (users?.length === 0) {
      return (
        <PageLayout>
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
        </PageLayout>
      );
    }
    return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-8 lg:gap-10 mt-5 md:mt-10">
          {users.map((user) => (
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
                <div className="text-sm text-foreground-500 truncate w-full">
                  {user.email}
                </div>
              </div>
            </CardFrame>
          ))}
        </div>
      </>
    );
  }
  return (
    <div className="mx-auto p-5 lg:p-10">
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
      {renderContent()}
      <div className="h-full flex items-center justify-center p-5" ref={ref}>
        {hasNextPage && isFetching && <Spinner />}
      </div>
    </div>
  );
}
