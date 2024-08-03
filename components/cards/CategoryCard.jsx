import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToFavoritesCategory } from "@/fetch/category";
import CardFrame from "./CardFrame";
import { updateInfiniteQueryData } from "@/utils/react-query";

function CategoryCard({
  category,
  onOpenChangeDeleteOneCategoryModal,
  onOpenChangeEditCategoryModal,
  setCurrentActionCategory,
  refetch,
  pageIndex,
}) {
  const queryClient = useQueryClient();

  const mutate_AddToFavorite = useMutation({
    mutationFn: (value) =>
      addToFavoritesCategory({ id: category._id, favorite: value }),
    onSuccess: (data) => {
      queryClient.setQueriesData([`categories`], (oldData) =>
        updateInfiniteQueryData({
          data: oldData,
          pageIndex,
          dataId: data._id,
          newData: data,
        })
      );
    },
  });

  return (
    <>
      <CardFrame className="p-6 flex justify-between items-center gap-4">
        <div className="text-sm md:text-base font-medium text-foreground-800">
          {category.name}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => mutate_AddToFavorite.mutate(!category.favorite)}
            className={`p-2 rounded-full transition-colors duration-200 ${
              category.favorite
                ? "bg-red-100 text-red-500"
                : "bg-foreground-100 text-foreground-500"
            } hover:bg-red-200`}
          >
            {category.favorite ? (
              <FaHeart size={25} />
            ) : (
              <FaRegHeart size={25} />
            )}
          </button>
          <button
            onClick={() => {
              onOpenChangeDeleteOneCategoryModal();
              setCurrentActionCategory({ action: "delete", category , pageIndex });
            }}
            className="p-2 rounded-full transition-colors duration-200 hover:bg-foreground-200 text-foreground-600"
          >
            <MdOutlineDelete size={25} />
          </button>
          <button
            onClick={() => {
              onOpenChangeEditCategoryModal();
              setCurrentActionCategory({ action: "edit", category  , pageIndex });
            }}
            className="p-2 rounded-full transition-colors duration-200 hover:bg-red-200 text-red-600"
          >
            <MdOutlineEdit size={25} />
          </button>
        </div>
      </CardFrame>
    </>
  );
}

export default CategoryCard;
