import { useEffect, useState } from "react";

function useScrollPosition(element = window) {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (!element) return;
    const targetElement =
      element === document ? document.documentElement : element;
    let lastScrollPosition = targetElement.scrollTop;
    const handleScroll = (e) => {
      const currentScrollPosition = targetElement.scrollTop;
      const scrollDifference = Math.abs(
        currentScrollPosition - lastScrollPosition
      );
      if (scrollDifference >= 100) {
        setScrollPosition(currentScrollPosition);
        lastScrollPosition = currentScrollPosition;
      }
    };
    targetElement.addEventListener("scroll", handleScroll);
    return () => {
      targetElement.removeEventListener("scroll", handleScroll);
    };
  }, [element]);

  return scrollPosition;
}

export default useScrollPosition;
