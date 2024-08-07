import MyModal from "../Modal";
import { Button } from "@nextui-org/react";
import parseError from "@/utils/parseError";
import { deleteOneCategory } from "@/fetch/category";
import { deleteInfiniteQueryData } from "@/utils/react-query";
import useOptimisticMutation from "@/hooks/useOptimisticMutation";

function DeleteOneCategoryModal({
  isOpenDeleteOneCategoryModal,
  onOpenChangeDeleteOneCategoryModal,
  onOpenDeleteOneCategoryModal,
  onCloseDeleteOneCategoryModal,
  category,
  pageIndex,
}) {
  const mutateDeleteOneCategory = useOptimisticMutation({
    infiniteQueryKeys: ["categories"],
    mutationFn: () => deleteOneCategory({ id: category._id }),
    actionFunc: (_, oldData) => {
      onCloseDeleteOneCategoryModal();
      return deleteInfiniteQueryData({
        data: oldData,
        pageIndex,
        dataId: category._id,
      });
    },
  });


  return (
    <MyModal
      {...{
        isOpen: isOpenDeleteOneCategoryModal,
        onOpen: onOpenDeleteOneCategoryModal,
        onOpenChange: onOpenChangeDeleteOneCategoryModal,
      }}
      title="Delete Category"
      Footer={() => {
        return (
          <>
            <Button
              isLoading={mutateDeleteOneCategory.isPending}
              variant="flat"
              className="px-10 py-7 text-md"
              color="danger"
              onPress={mutateDeleteOneCategory.mutate}
            >
              Delete Category
            </Button>
            {mutateDeleteOneCategory.error && (
              <span className="text-red-500">
                {parseError(mutateDeleteOneCategory.error)}
              </span>
            )}
          </>
        );
      }}
    >
      <div>
        Are you sure you want to delete the category &quot;{category.name}&quot;
        ?
      </div>
    </MyModal>
  );
}

export default DeleteOneCategoryModal;
