import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { MdImageNotSupported } from "react-icons/md";

function ImageViewer({ images }) {
  const [isImageHovered, setIsImageHovered] = useState();

  return (
    <div
      className="relative"
      onMouseOver={() => {
        setIsImageHovered(true);
      }}
      onMouseLeave={() => {
        setIsImageHovered(false);
      }}
    >
      {images[0] && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isImageHovered && images[1] ? 0 : 1 }}
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
          animate={{ opacity: isImageHovered ? 1 : 0 }}
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
  );
}

export default ImageViewer;
