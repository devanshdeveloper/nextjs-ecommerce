"use client";
import { useCallback, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function ExampleClientComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // useEffect(() => {
  //   // Retrieve scrollY value from localStorage after routing
  //   const persistentScroll = localStorage.getItem("persistentScroll");
  //   if (persistentScroll === null) return;

  //   // Restore the window's scroll position
  //   window.scrollTo({ top: Number(persistentScroll) });

  //   // Remove scrollY from localStorage after restoring the scroll position
  //   // This hook will run before and after routing happens so this check is
  //   // here to make we don't delete scrollY before routing
  //   if (Number(persistentScroll) === window.scrollY)
  //     localStorage.removeItem("persistentScroll");
  // }, [searchParams]);

  const setSearchParam = useCallback(
    (key, value) => {
      const currentParams = searchParams.toString();
      const params = new URLSearchParams(currentParams);

      params.set(key, value);
      // If search params are still the same there's no need to do anything
      if (currentParams === params.toString()) return;

      // Save current scrollY value to localStorage before pushing the new route
      localStorage.setItem("persistentScroll", window.scrollY.toString());
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  return (
    <div>
      <div className="h-screen"></div>
      <div className="h-screen"></div>
      <div className="h-screen"></div>
      <div className="h-screen"></div>
      <div className="h-screen"></div>
      <div className="h-screen"></div>
      <button
        onClick={() => {
          setSearchParam("exampleParam", "9999");
        }}
      >
        Update search params
      </button>
    </div>
  );
}
