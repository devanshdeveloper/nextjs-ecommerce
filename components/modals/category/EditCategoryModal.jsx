import { useEffect, useState } from "react";
import MyModal from "../Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Input } from "@nextui-org/react";
import parseError from "@/utils/parseError";
import { updateOneCategory } from "@/fetch/category";
import { updateInfiniteQueryData } from "@/utils/react-query";
import useOptimisticMutation from "@/hooks/useOptimisticMutation";

function EditCategoryModal({
  isOpenEditCategoryModal,
  onOpenChangeEditCategoryModal,
  onOpenEditCategoryModal,
  onCloseEditCategoryModal,
  category,
  pageIndex,
}) {
  const [categoryInputValue, setCategoryInputValue] = useState(category.name);
  const queryClient = useQueryClient();

  const mutateEditCategory = useOptimisticMutation({
    infiniteQueryKeys: ["categories"],
    mutationFn: (newCategory) =>
      updateOneCategory({ id: category._id, newCategory }),
    actionFunc: (data, oldData) => {
      onCloseEditCategoryModal();
      updateInfiniteQueryData({
        data: oldData,
        pageIndex,
        dataId: "q892eyq2",
        newData: data,
      });
    },
  });

  useEffect(() => {
    setCategoryInputValue(category.name);
  }, [category.name]);

  return (
    <MyModal
      {...{
        isOpen: isOpenEditCategoryModal,
        onOpen: onOpenEditCategoryModal,
        onOpenChange: onOpenChangeEditCategoryModal,
      }}
      title="Edit Category"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutateEditCategory.mutate({ name: categoryInputValue });
          setCategoryInputValue("");
        }}
        className="w-full flex flex-col items-center gap-2 "
      >
        <Input
          isDisabled={mutateEditCategory.isPending}
          className="w-[300px]"
          type="text"
          label="Category"
          name="category"
          onValueChange={(value) => setCategoryInputValue(value)}
          value={categoryInputValue}
        />
        <Button
          isLoading={mutateEditCategory.isPending}
          variant="flat"
          className="px-10 py-7 text-md"
          color="primary"
          type="submit"
        >
          Edit Category
        </Button>
        {mutateEditCategory.error && (
          <span className="text-red-500">
            {parseError(mutateEditCategory.error)}
          </span>
        )}
      </form>
    </MyModal>
  );
}

export default EditCategoryModal;
