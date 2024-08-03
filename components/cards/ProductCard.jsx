import Image from "next/image";
import { MdImageNotSupported } from "react-icons/md";
import { useState } from "react";
import useURL from "@/hooks/useURL";
import { useAuthContext } from "../providers/AuthProvider";
import CardFrame from "./CardFrame";
import { motion } from "framer-motion";
import ImageViewer from "../image/ImageViewer";

export default function ProductCard({
  actualPrice,
  category,
  description,
  images,
  name,
  price,
  ratings,
  reviews,
  variants,
  _id,
  children,
  displayName,
  layoutId
}) {
  const { user } = useAuthContext();

  const [getSearchParams, setSearchParams] = useURL();

  return (
    <CardFrame
    className={"relative"}
      layoutId={layoutId || `card-${_id}`}
      onClick={() => {
        const cartVariants = user?.cart.find(
          (cartItem) => cartItem.product === _id
        )?.variants;
        const defaultVariants = {};
        if (cartVariants) {
          cartVariants.forEach((variant) => {
            defaultVariants[variant.name] = variant.value;
          });
        } else {
          variants.forEach((variant) => {
            defaultVariants[variant.name] = variant.options[0];
          });
        }
        setSearchParams({ product: name, ...defaultVariants });
      }}
    >
      <ImageViewer {...{ images }} />
      <div className="flex flex-col items-start p-3 pt-0">
        <h4 className="font-bold sm:text-sm md:text-md lg:text-large">
          {displayName || name}
        </h4>
        <div className="flex gap-2">
          <small className="text-default-500">Rs {price}</small>
          <small className="text-default-500 line-through">
            Rs {actualPrice}
          </small>
        </div>
      </div>
      {children}
    </CardFrame>
  );
}
