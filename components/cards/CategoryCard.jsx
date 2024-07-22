import { Button, useDisclosure } from "@nextui-org/react";
import React from "react";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import EditCategoryModal from "../modals/category/EditCategoryModal";
import DeleteOneCategoryModal from "../modals/category/DeleteOneCategoryModal";

function CategoryCard({ category , refetch }) {
  const {
    isOpen: isOpenEditCategoryModal,
    onOpen: onOpenEditCategoryModal,
    onOpenChange: onOpenChangeEditCategoryModal,
    onClose: onCloseEditCategoryModal,
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteOneCategoryModal,
    onOpen: onOpenDeleteOneCategoryModal,
    onOpenChange: onOpenChangeDeleteOneCategoryModal,
    onClose: onCloseDeleteOneCategoryModal,
  } = useDisclosure();

  return (
    <>
      <div className="flex items-center justify-between bg-foreground-50 p-2 md:p-5 rounded-xl">
        <div className="text-xs sm:text-sm md:text-medium">{category.name}</div>
        <div className="flex gap-2">
          <Button
            isIconOnly
            variant="flat"
            color="primary"
            size="sm"
            onPress={onOpenChangeDeleteOneCategoryModal}
          >
            <MdOutlineDelete size={20} />
          </Button>
          <Button
            isIconOnly
            variant="flat"
            color="danger"
            size="sm"
            onPress={onOpenChangeEditCategoryModal}
          >
            <MdOutlineEdit size={20} />
          </Button>
        </div>
      </div>
      <EditCategoryModal
        {...{
          isOpenEditCategoryModal,
          onOpenChangeEditCategoryModal,
          onOpenEditCategoryModal,
          onCloseEditCategoryModal,
          category,
          refetch
        }}
      />
      <DeleteOneCategoryModal
        {...{
          isOpenDeleteOneCategoryModal,
          onOpenChangeDeleteOneCategoryModal,
          onOpenDeleteOneCategoryModal,
          onCloseDeleteOneCategoryModal,
          category,
          refetch
        }}
      />
    </>
  );
}

export default CategoryCard;
