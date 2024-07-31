import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";

function ImageListViewer({ images }) {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="flex flex-col gap-3 w-full md:w-5/12">
      <div className="relative w-full h-96">
        <AnimatePresence>
          <motion.div
            key={mainImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute w-full h-full"
          >
            <Image
              src={mainImage}
              layout="fill"
              objectFit="contain"
              alt="Main"
              className="border-2 border-foreground-300"
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex  gap-3 overflow-y-auto brand-scrollbar pb-3 h-32">
        {images.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={`${image}-${index}`}
            width={500}
            height={500}
            className={`w-24 cursor-pointer transition-all duration-200 ${
              mainImage === image
                ? "border-2 border-foreground-400"
                : "border-1 border-foreground-100"
            }`}
            onClick={() => setMainImage(image)}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageListViewer;
