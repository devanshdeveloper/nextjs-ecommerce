import { Button } from "@nextui-org/react";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { addToFavoritesCategory } from "@/fetch/category";

function CategoryCard({
  category,
  onOpenChangeDeleteOneCategoryModal,
  onOpenChangeEditCategoryModal,
  setCurrentActionCategory,
  refetch,
}) {
  const mutate_AddToFavorite = useMutation({
    mutationFn: (value) =>
      addToFavoritesCategory({ id: category._id, favorite: value }),
    onSuccess: () => {
      refetch();
    },
  });

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
            isLoading={mutate_AddToFavorite.isPending}
            onPress={() => {
              mutate_AddToFavorite.mutate(!category.favorite);
            }}
          >
            {category.favorite ? (
              <FaRegHeart size={20} />
            ) : (
              <FaHeart size={20} />
            )}
          </Button>
          <Button
            isIconOnly
            variant="flat"
            color="primary"
            size="sm"
            onPress={() => {
              onOpenChangeDeleteOneCategoryModal();
              setCurrentActionCategory({ action: "delete", category });
            }}
          >
            <MdOutlineDelete size={20} />
          </Button>
          <Button
            isIconOnly
            variant="flat"
            color="danger"
            size="sm"
            onPress={() => {
              onOpenChangeEditCategoryModal();
              setCurrentActionCategory({ action: "edit", category });
            }}
          >
            <MdOutlineEdit size={20} />
          </Button>
        </div>
      </div>
    </>
  );
}

export default CategoryCard;
