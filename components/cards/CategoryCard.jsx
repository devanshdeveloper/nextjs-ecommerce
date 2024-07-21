import { Button, useDisclosure } from "@nextui-org/react";
import React from "react";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import EditCategoryModal from "../modals/category/EditCategoryModal";
import DeleteCategoryModal from "../modals/category/DeleteCategoryModal";

function CategoryCard({ category , refetch }) {
  const {
    isOpen: isOpenEditCategoryModal,
    onOpen: onOpenEditCategoryModal,
    onOpenChange: onOpenChangeEditCategoryModal,
    onClose: onCloseEditCategoryModal,
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteCategoryModal,
    onOpen: onOpenDeleteCategoryModal,
    onOpenChange: onOpenChangeDeleteCategoryModal,
    onClose: onCloseDeleteCategoryModal,
  } = useDisclosure();

  return (
    <>
      <div className="flex items-center justify-between bg-foreground-50 p-5 rounded-xl">
        <div>{category.name}</div>
        <div className="flex gap-2">
          <Button
            isIconOnly
            variant="flat"
            color="primary"
            onPress={onOpenChangeDeleteCategoryModal}
          >
            <MdOutlineDelete size={25} />
          </Button>
          <Button
            isIconOnly
            variant="flat"
            color="danger"
            onPress={onOpenChangeEditCategoryModal}
          >
            <MdOutlineEdit size={25} />
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
      <DeleteCategoryModal
        {...{
          isOpenDeleteCategoryModal,
          onOpenChangeDeleteCategoryModal,
          onOpenDeleteCategoryModal,
          onCloseDeleteCategoryModal,
          category,
          refetch
        }}
      />
    </>
  );
}

export default CategoryCard;
