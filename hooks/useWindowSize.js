"use client";

import { useCallback, useEffect, useState } from "react";

export default function useWindowSize({ onChange = () => {} }) {
  const [windowSize, setWindowSize] = useState(0);

  const handleResize = useCallback(() => {
    const newWidth = window.innerWidth;
    // Only update if the change is greater than 100 pixels
    if (Math.abs(newWidth - windowSize) > 100) {
      setWindowSize(newWidth);
      onChange && onChange(newWidth);
    }
  }, [windowSize, onChange]);
  
  useEffect(() => {
    handleResize();
  }, []); // Empty dependency array means this runs only once after mount

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return [windowSize];
}
