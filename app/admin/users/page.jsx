"use client";
import MyModal from "@/components/modals/Modal";
import { deleteUserById, getUsers } from "@/fetch/user";
import { Avatar, Button, Spinner, useDisclosure } from "@nextui-org/react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { useInView } from "react-intersection-observer";

export default function UsersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onOpenChange , onClose } = useDisclosure();
  const [deleteId, setDeleteId] = useState(null);

  const { data, status, error, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["users"],
    queryFn: (params) => getUsers({ ...params, limit: 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      return lastPage.info.nextPage;
    },
    refetchOnWindowFocus: false,
  });

  const mutateDeleteUserById = useMutation({
    mutationFn: deleteUserById,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });


  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  if (status === "pending") {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 p-10 w-[calc(100vw-300px)]">
        {data.pages.map((page) => {
          return page.data.map((user) => {
            return (
              <div key={user._id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar
                    onClick={() =>
                      router.push(`/admin/users/${user._id}/details`)
                    }
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
                    color="danger"
                    variant="flat"
                    isIconOnly
                    onClick={() => {
                      onOpen();
                      setDeleteId(user._id);
                    }}
                  >
                    <MdDeleteOutline size={20} />
                  </Button>
                </div>
              </div>
            );
          });
        })}
        <div
          className="w-[calc(100vw-300px)] h-full flex items-center justify-center"
          ref={ref}
        >
          {isFetching && <Spinner />}
        </div>
      </div>
      <MyModal
        Footer={({ onClose }) => (
          <>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button
              color="danger"
              isLoading={
                mutateDeleteUserById.isPending &&
                mutateDeleteUserById.variables.id === deleteId
              }
              onPress={() => mutateDeleteUserById.mutate({ id: deleteId })}
            >
              Yes
            </Button>
          </>
        )}
        {...{ isOpen, onOpen, onOpenChange, title: "Delete User?" }}
      >
        Are you sure you want to delete this user?
      </MyModal>
    </>
  );
}
