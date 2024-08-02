import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

export default function CardFrame({ children, className, ...props }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };

  return (
    <motion.div
      className={twMerge(
        "border border-foreground-200 rounded-lg cursor-pointer",
        className
      )}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      {...props}
    >
      {children}
    </motion.div>
  );
}
