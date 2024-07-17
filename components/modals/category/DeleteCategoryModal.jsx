import MyModal from "../Modal";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@nextui-org/react";
import parseError from "@/utils/parseError";
import { deleteCategory } from "@/fetch/category";

function DeleteCategoryModal({
  isOpenDeleteCategoryModal,
  onOpenChangeDeleteCategoryModal,
  onOpenDeleteCategoryModal,
  onCloseDeleteCategoryModal,
  category,
  refetch,
}) {
  const mutateDeleteCategory = useMutation({
    mutationFn: () => deleteCategory({ id: category._id }),
    onSuccess: () => {
      onCloseDeleteCategoryModal();
      refetch();
    },
  });

  return (
    <MyModal
      {...{
        isOpen: isOpenDeleteCategoryModal,
        onOpen: onOpenDeleteCategoryModal,
        onOpenChange: onOpenChangeDeleteCategoryModal,
      }}
      title="Delete Category"
      Footer={() => {
        return (
          <>
            <Button
              isLoading={mutateDeleteCategory.isPending}
              variant="flat"
              className="px-10 py-7 text-md"
              color="danger"
              onClick={mutateDeleteCategory.mutate}
            >
              Delete Category
            </Button>
            {mutateDeleteCategory.error && (
              <span className="text-red-500">
                {parseError(mutateDeleteCategory.error)}
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

export default DeleteCategoryModal;
