import { useEffect, useState } from "react";
import MyModal from "../Modal";
import { useMutation } from "@tanstack/react-query";
import { Button, Input } from "@nextui-org/react";
import parseError from "@/utils/parseError";
import { updateOneCategory } from "@/fetch/category";

function EditCategoryModal({
  isOpenEditCategoryModal,
  onOpenChangeEditCategoryModal,
  onOpenEditCategoryModal,
  onCloseEditCategoryModal,
  category,
  refetch,
}) {
  const [categoryInputValue, setCategoryInputValue] = useState(category.name);

  const mutateEditCategory = useMutation({
    mutationFn: (newCategory) =>
      updateOneCategory({ id: category._id, newCategory }),
    onSuccess: () => {
      onCloseEditCategoryModal();
      refetch();
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
