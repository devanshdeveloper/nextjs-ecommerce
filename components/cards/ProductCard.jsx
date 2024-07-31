import Image from "next/image";
import { MdImageNotSupported } from "react-icons/md";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useURL from "@/hooks/useURL";

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
}) {
  const [isCardHovered, setCardHovered] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };
  const [getSearchParams, setSearchParams] = useURL();

  return (
    <div>
      <AnimatePresence>
        <motion.div
          key={_id}
          className="border border-foreground-200 rounded-lg cursor-pointer"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          layoutId={`card-${_id}`}
          onClick={() => {
            const defaultVariants = {};
            variants.forEach((variant) => {
              defaultVariants[variant.name] = variant.options[0];
            });
            setSearchParams({ product: name, ...defaultVariants });
          }}
          onMouseOver={() => {
            setCardHovered(true);
          }}
          onMouseLeave={() => {
            setCardHovered(false);
          }}
        >
          <div className="relative">
            {images[0] && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: isCardHovered ? 0 : 1 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  className="z-10 w-full"
                  src={images[0]}
                  width={500}
                  height={500}
                  alt={name}
                />
              </motion.div>
            )}
            {images[1] && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isCardHovered ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute top-0 left-0 w-full h-full"
              >
                <Image
                  className="w-full"
                  src={images[1]}
                  width={500}
                  height={500}
                  alt={name}
                />
              </motion.div>
            )}
            {!images[0] && !images[1] && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full h-[300px] flex items-center justify-center"
              >
                <MdImageNotSupported size={100} />
              </motion.div>
            )}
          </div>
          <div className="flex flex-col items-start p-3 pt-0">
            <h4 className="font-bold sm:text-sm md:text-md lg:text-large">
              {name}
            </h4>
            <div className="flex gap-2">
              <small className="text-default-500">Rs {price}</small>
              <small className="text-default-500 line-through">
                Rs {actualPrice}
              </small>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
