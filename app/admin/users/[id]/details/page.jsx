"use client";

import AdminLayoutSpinner from "@/components/spinners/AdminLayoutSpinner";
import AdminLayoutCover from "@/components/layout/AdminLayoutCover";
import { readOneUser, deleteOneUser, updateOneUser } from "@/fetch/user";
import { Avatar, Button, Select, SelectItem } from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

function UserDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: pageUser, isPending } = useQuery({
    queryKey: [`user_${id}`],
    queryFn: () => readOneUser({ id }),
    retry: false,
  });

  const mutateDeleteUserById = useMutation({
    mutationFn: () => deleteOneUser({ id }),
    onSuccess: () => {
      router.push("/admin/users");
    },
  });

  const mutateUpdateOneUser = useMutation({
    mutationFn: (newUser) => updateOneUser({ id, newUser }),
    onSuccess: (data) => {
      queryClient.setQueryData([`user_${id}`], () => ({ ...data.user }));
    },
  });

  if (isPending) {
    return <AdminLayoutSpinner />;
  }

  if (!pageUser) {
    return (
      <AdminLayoutCover>
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
      </AdminLayoutCover>
    );
  }

  return (
    <div className="container mx-auto p-5 lg:p-10">
      <div className="flex flex-col items-center gap-10">
        <div className="w-full flex flex-col lg:flex-row justify-between items-center lg:items-start">
          <div className="text-xl lg:text-3xl font-semibold py-5 text-center lg:text-left">
            User Details: {pageUser.name}
          </div>
          <div className="flex gap-5 items-center">
            <Select
              label="Role"
              isLoading={mutateUpdateOneUser.isPending}
              onSelectionChange={(value) => {
                mutateUpdateOneUser.mutate({ role: [...value][0] });
              }}
              selectedKeys={new Set([pageUser.role])}
              className="w-44 lg:w-52"
            >
              {["User", "Admin", "Blocked"].map((role) => (
                <SelectItem key={role}>{role}</SelectItem>
              ))}
            </Select>
            <Button
              color="danger"
              variant="flat"
              isLoading={mutateDeleteUserById.isPending}
              onPress={mutateDeleteUserById.mutate}
              className="px-4 py-2 lg:px-6 lg:py-3"
            >
              Delete
            </Button>
          </div>
        </div>
        <Avatar
          size="xl"
          shape="rounded"
          className="w-24 h-24 lg:w-40 lg:h-40 shadow-lg"
          src={pageUser.image}
          name={pageUser.name}
        />
        <div className="text-center">
          <div className="font-bold text-2xl lg:text-3xl">{pageUser.name}</div>
          <div className="text-lg lg:text-xl text-gray-600">
            {pageUser.email}
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center gap-5 mt-8">
        <Link
          href={`/admin/users/${pageUser._id}/cart`}
          className="text-primary hover:text-primary-dark font-medium"
        >
          View Cart
        </Link>
        <Link
          href={`/admin/users/${pageUser._id}/orders`}
          className="text-primary hover:text-primary-dark font-medium"
        >
          View Orders
        </Link>
      </div>
    </div>
  );
}

export default UserDetailsPage;
