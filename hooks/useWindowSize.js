"use client";

import { useCallback, useEffect, useState } from "react";

export default function useWindowSize({ onChange = () => {} }) {
  const [windowSize, setWindowSize] = useState(0);

  const handleResize = useCallback(() => {
    console.log("onResize");

    setWindowSize(window.innerWidth);
    onChange && onChange(window.innerWidth);
  }, [onChange]);

  useEffect(() => {
    handleResize();
  }, []);
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);
  return [windowSize];
}
