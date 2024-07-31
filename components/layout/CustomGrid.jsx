"use client";

// UTILS
import getGridOption from "@/utils/getGridOption";

// HOOKS
import useWindowSize from "@/hooks/useWindowSize";
import { useCallback, useState } from "react";

// UI COMPONENTS
import { Button, ButtonGroup } from "@nextui-org/react";
import { IoSquare } from "react-icons/io5";
import { TfiLayoutGrid2Alt, TfiLayoutGrid4Alt } from "react-icons/tfi";
import { RiLayoutGrid2Fill } from "react-icons/ri";
import { AnimatePresence } from "framer-motion";
function CustomGrid({ title, items }) {
  const [windowSize] = useWindowSize({
    onChange: useCallback((value) => {
      setGridOption(getGridOption(value));
    }, []),
  });
  const [gridOption, setGridOption] = useState(getGridOption(windowSize));
  const gridOptions = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <div className="text-3xl font-bold my-5">{title}</div>
        <ButtonGroup>
          <Button
            className="md:hidden"
            isIconOnly
            isDisabled={gridOption === "1"}
            onPress={() => setGridOption("1")}
          >
            <IoSquare />
          </Button>
          <Button
            className="lg:hidden"
            isIconOnly
            isDisabled={gridOption === "2"}
            onPress={() => setGridOption("2")}
          >
            <TfiLayoutGrid2Alt />
          </Button>
          <Button
            className="hidden md:inline-flex"
            isIconOnly
            isDisabled={gridOption === "3"}
            onPress={() => setGridOption("3")}
          >
            <RiLayoutGrid2Fill size={20} />
          </Button>
          <Button
            className="hidden lg:inline-flex"
            isIconOnly
            isDisabled={gridOption === "4"}
            onPress={() => setGridOption("4")}
          >
            <TfiLayoutGrid4Alt size={18} />
          </Button>
        </ButtonGroup>
      </div>
      <AnimatePresence>
        <div
          className={`grid ${gridOptions[gridOption]} gap-3 md:gap-5 lg:gap-8`}
        >
          {items}
        </div>
      </AnimatePresence>
    </div>
  );
}

export default CustomGrid;
