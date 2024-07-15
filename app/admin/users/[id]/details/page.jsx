"use client";

import AdminLayoutSpinner from "@/components/spinners/AdminLayoutSpinner";
import { getUserById } from "@/fetch/user";
import { Avatar, Spinner } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

function UserDetailsPage({ searchParams }) {
  const { id } = useParams();
  const { data: pageUser, isPending } = useQuery({
    queryKey: [`user_${id}`],
    queryFn: () => getUserById({ id }),
  });

  if (isPending) {
    return <AdminLayoutSpinner />;
  }
  console.log(pageUser);

  return (
    <div>
      <div className="w-[calc(100vw-300px)] p-10 flex flex-col items-center gap-10">
        <Avatar
        size="xl"
          shape="rounded"
          className="w-20 h-20 lg:w-40 lg:h-40"
          src={pageUser.image}
          name={pageUser.name}
        />
        <div className="flex flex-col gap-3 items-center">
          <div className="font-bold text-2xl">{pageUser.name}</div>
          <div>{pageUser.email}</div>
        </div>
      </div>
    </div>
  );
}

export default UserDetailsPage;
