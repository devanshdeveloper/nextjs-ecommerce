import { AnimatePresence } from "framer-motion";
import CartModal from "@/components/modals/CartModal";
import ProductModal from "./ProductModal";
import useURL from "@/hooks/useURL";
function Modals() {
  const [getSearchParams, setSearchParams] = useURL();
  const { showCartModal } = getSearchParams("showCartModal");
  return (
    <>
      <AnimatePresence>{showCartModal && <CartModal />}</AnimatePresence>
    </>
  );
}

export default Modals;
