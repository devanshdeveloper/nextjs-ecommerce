"use client";

import PageLayout from "@/components/layout/PageLayout";
import CartPage from "@/components/pages/CartPage";
import PageLayoutSpinner from "@/components/spinners/PageLayoutSpinner";
import { readOneUser } from "@/fetch/user";
import { Button } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useCallback } from "react";

function UserCartPage() {
  const { id } = useParams();

  const {
    data: pageUser,
    isPending,
    error,
  } = useQuery({
    queryKey: [`user_${id}`],
    queryFn: () => readOneUser({ id }),
    retry: false,
  });
  const setUser = useCallback(
    (...args) => queryClient.setQueryData([`user_${id}`], ...args),
    [id]
  );

  function renderContent() {
    if (isPending) {
      return <PageLayoutSpinner />;
    }
    if (error) {
      return (
        <PageLayout>
          <h1>An error occurred while getting user details.</h1>
          <p>{error.message}</p>
          <p>Please try again later.</p>
        </PageLayout>
      );
    }
    if (!pageUser) {
      return (
        <PageLayout>
          <div className="flex flex-col items-center gap-10">
            <div className="text-3xl">No User Found</div>
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
        <CartPage {...{ user: pageUser, setUser }} />
      </>
    );
  }
  return renderContent();
}

export default UserCartPage;
