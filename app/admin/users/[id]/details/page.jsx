"use client";

import AdminLayoutSpinner from "@/components/spinners/AdminLayoutSpinner";
import AdminLayoutCover from "@/components/layout/AdminLayoutCover";
import { getUserById, deleteUserById, updateUserById } from "@/fetch/user";
import { Avatar, Button, Select, SelectItem } from "@nextui-org/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

function UserDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: pageUser, isPending } = useQuery({
    queryKey: [`user_${id}`],
    queryFn: () => getUserById({ id }),
    retry: false,
  });

  const mutateDeleteUserById = useMutation({
    mutationFn: () => deleteUserById({ id }),
    onSuccess: () => {
      router.push("/admin/users");
    },
  });

  const mutateUpdateUserById = useMutation({
    mutationFn: (newDetails) => updateUserById({ id, newDetails }),
    onSuccess: (data) => {
      queryClient.setQueryData([`user_${id}`] , () => ({...data.user}))
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
    <div>
      <div className="w-[calc(100vw-300px)] p-10 flex flex-col items-center gap-10">
        <div className="w-full flex items-center justify-between">
          <div className="text-2xl">User Details : {pageUser.name}</div>
          <div className="flex gap-5 items-center">
            <Select
              label="Role"
              isLoading={mutateUpdateUserById.isPending}
              onSelectionChange={(value) => {
                mutateUpdateUserById.mutate({ role: [...value][0] });
              }}
              selectedKeys={new Set([pageUser.role])}
              className="w-[200px]"
            >
              {["User", "Admin" , "Blocked"].map((role) => (
                <SelectItem key={role}>{role}</SelectItem>
              ))}
            </Select>
            <Button
              color="danger"
              variant="flat"
              isLoading={mutateDeleteUserById.isPending}
              onPress={mutateDeleteUserById.mutate}
            >
              Delete
            </Button>
          </div>
        </div>
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
