"use client";
import { Button, ButtonGroup } from "@nextui-org/react";
import ProductCard from "./ProductCard";
import { TfiLayoutGrid4Alt, TfiLayoutGrid2Alt } from "react-icons/tfi";
import { RiLayoutGrid2Fill } from "react-icons/ri";
import { IoSquare } from "react-icons/io5";
import useWindowSize from "@/hooks/useWindowSize";

import { useCallback, useState } from "react";

function Category({ name }) {
  const getGridOption = useCallback((number) => {
    if (number >= 0 && number <= 640) return "1";
    else if (number >= 641 && number <= 765) return "2";
    else if (number >= 766 && number <= 1024) return "3";
    else if (number >= 1025) return "3";
    return "4";
  }, []);

  const [windowSize] = useWindowSize({
    onChange: useCallback((value) => {
      setGridOption(getGridOption(value));
    }, [getGridOption]),
  });

  const [gridOption, setGridOption] = useState(
    getGridOption(windowSize)
  );

  console.log(gridOption);

  const gridOptions = {
    "1": "grid-cols-1",
    "2": "grid-cols-2",
    "3": "grid-cols-3",
    "4": "grid-cols-4",
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="text-3xl font-bold my-5">{name}</div>
        <ButtonGroup>
          <Button
            className="md:hidden"
            isIconOnly
            isDisabled={gridOption === "1"}
            onClick={() => setGridOption("1")}
          >
            <IoSquare />
          </Button>
          <Button
            className="lg:hidden"
            isIconOnly
            isDisabled={gridOption === "2"}
            onClick={() => setGridOption("2")}
          >
            <TfiLayoutGrid2Alt />
          </Button>
          <Button
            className="hidden md:inline-flex"
            isIconOnly
            isDisabled={gridOption === "3"}
            onClick={() => setGridOption("3")}
          >
            <RiLayoutGrid2Fill size={20} />
          </Button>
          <Button
            className="hidden lg:inline-flex"
            isIconOnly
            isDisabled={gridOption === "4"}
            onClick={() => setGridOption("4")}
          >
            <TfiLayoutGrid4Alt size={18} />
          </Button>
        </ButtonGroup>
      </div>
      <div
        className={`grid ${gridOptions[gridOption]} gap-3 md:gap-5 lg:gap-8`}
      >
        <ProductCard
          id="2"
          name="Black T Shirt"
          price={200}
          frontImage="https://imbuzi.in/cdn/shop/files/3.jpg?v=1701950526&width=493"
          backImage="https://imbuzi.in/cdn/shop/files/4.jpg?v=1701950526"
          inventory={10}
        />
        <ProductCard
          id="2"
          name="Black T Shirt"
          price={200}
          frontImage="https://imbuzi.in/cdn/shop/files/3.jpg?v=1701950526&width=493"
          backImage="https://imbuzi.in/cdn/shop/files/4.jpg?v=1701950526"
          inventory={10}
        />
        <ProductCard
          id="2"
          name="Black T Shirt"
          price={200}
          frontImage="https://imbuzi.in/cdn/shop/files/3.jpg?v=1701950526&width=493"
          backImage="https://imbuzi.in/cdn/shop/files/4.jpg?v=1701950526"
          inventory={10}
        />
        <ProductCard
          id="2"
          name="Black T Shirt"
          price={200}
          frontImage="https://imbuzi.in/cdn/shop/files/3.jpg?v=1701950526&width=493"
          backImage="https://imbuzi.in/cdn/shop/files/4.jpg?v=1701950526"
          inventory={10}
        />
        <ProductCard
          id="2"
          name="Black T Shirt"
          price={200}
          frontImage="https://imbuzi.in/cdn/shop/files/3.jpg?v=1701950526&width=493"
          backImage="https://imbuzi.in/cdn/shop/files/4.jpg?v=1701950526"
          inventory={10}
        />
        <ProductCard
          id="2"
          name="Black T Shirt"
          price={200}
          frontImage="https://imbuzi.in/cdn/shop/files/3.jpg?v=1701950526&width=493"
          backImage="https://imbuzi.in/cdn/shop/files/4.jpg?v=1701950526"
          inventory={10}
        />
        <ProductCard
          id="2"
          name="Black T Shirt"
          price={200}
          frontImage="https://imbuzi.in/cdn/shop/files/3.jpg?v=1701950526&width=493"
          backImage="https://imbuzi.in/cdn/shop/files/4.jpg?v=1701950526"
          inventory={10}
        />
        <ProductCard
          id="2"
          name="Black T Shirt"
          price={200}
          frontImage="https://imbuzi.in/cdn/shop/files/3.jpg?v=1701950526&width=493"
          backImage="https://imbuzi.in/cdn/shop/files/4.jpg?v=1701950526"
          inventory={10}
        />
        <ProductCard
          id="2"
          name="Black T Shirt"
          price={200}
          frontImage="https://imbuzi.in/cdn/shop/files/3.jpg?v=1701950526&width=493"
          backImage="https://imbuzi.in/cdn/shop/files/4.jpg?v=1701950526"
          inventory={10}
        />
        <ProductCard
          id="2"
          name="Black T Shirt"
          price={200}
          frontImage="https://imbuzi.in/cdn/shop/files/3.jpg?v=1701950526&width=493"
          backImage="https://imbuzi.in/cdn/shop/files/4.jpg?v=1701950526"
          inventory={10}
        />
        <ProductCard
          id="2"
          name="Black T Shirt"
          price={200}
          frontImage="https://imbuzi.in/cdn/shop/files/3.jpg?v=1701950526&width=493"
          backImage="https://imbuzi.in/cdn/shop/files/4.jpg?v=1701950526"
          inventory={10}
        />
        <ProductCard
          id="2"
          name="Black T Shirt"
          price={200}
          frontImage="https://imbuzi.in/cdn/shop/files/3.jpg?v=1701950526&width=493"
          backImage="https://imbuzi.in/cdn/shop/files/4.jpg?v=1701950526"
          inventory={10}
        />
        <ProductCard
          id="2"
          name="Black T Shirt"
          price={200}
          frontImage="https://imbuzi.in/cdn/shop/files/3.jpg?v=1701950526&width=493"
          backImage="https://imbuzi.in/cdn/shop/files/4.jpg?v=1701950526"
          inventory={10}
        />
        <ProductCard
          id="2"
          name="Black T Shirt"
          price={200}
          frontImage="https://imbuzi.in/cdn/shop/files/3.jpg?v=1701950526&width=493"
          backImage="https://imbuzi.in/cdn/shop/files/4.jpg?v=1701950526"
          inventory={10}
        />
        <ProductCard
          id="2"
          name="Black T Shirt"
          price={200}
          frontImage="https://imbuzi.in/cdn/shop/files/3.jpg?v=1701950526&width=493"
          backImage="https://imbuzi.in/cdn/shop/files/4.jpg?v=1701950526"
          inventory={10}
        />
        <ProductCard
          id="2"
          name="Black T Shirt"
          price={200}
          frontImage="https://imbuzi.in/cdn/shop/files/3.jpg?v=1701950526&width=493"
          backImage="https://imbuzi.in/cdn/shop/files/4.jpg?v=1701950526"
          inventory={10}
        />
        <ProductCard
          id="2"
          name="Black T Shirt"
          price={200}
          frontImage="https://imbuzi.in/cdn/shop/files/3.jpg?v=1701950526&width=493"
          backImage="https://imbuzi.in/cdn/shop/files/4.jpg?v=1701950526"
          inventory={10}
        />
        <ProductCard
          id="2"
          name="Black T Shirt"
          price={200}
          frontImage="https://imbuzi.in/cdn/shop/files/3.jpg?v=1701950526&width=493"
          backImage="https://imbuzi.in/cdn/shop/files/4.jpg?v=1701950526"
          inventory={10}
        />
        <ProductCard
          id="2"
          name="Black T Shirt"
          price={200}
          frontImage="https://imbuzi.in/cdn/shop/files/3.jpg?v=1701950526&width=493"
          backImage="https://imbuzi.in/cdn/shop/files/4.jpg?v=1701950526"
          inventory={10}
        />
      </div>
    </div>
  );
}

export default Category;
