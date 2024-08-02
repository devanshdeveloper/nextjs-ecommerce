import React from "react";
import { motion } from "framer-motion";

function ModalFrame({ closeModal, children }) {
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8 },
  };
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-end bg-foreground-50 bg-opacity-50 backdrop-blur-sm"
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={closeModal}
    >
      <motion.div
        className="relative w-[min(100vw,700px)] bg-background h-screen overflow-y-scroll shadow-xl rounded-2xl py-20 px-5 md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default ModalFrame;
