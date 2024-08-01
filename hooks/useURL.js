import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";
import useScrollPosition from "./useScrollPosition";

export default function useURL() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const scrollPosition = useScrollPosition()
  console.log(scrollPosition , "scrollPosition");

  const get = useCallback(
    (...keys) => {
      const res = {};
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        res[key] = searchParams.get(key);
      }
      return res;
    },
    [searchParams]
  );

  const set = useCallback(
    (obj, options) => {
      const params = new URLSearchParams(
        options?.strict ? null : searchParams.toString()
      );
      for (const key in obj) {
        if (obj[key] === "") {
          params.delete(key); // Remove parameter if value is empty
        } else {
          params.set(key, obj[key]);
        }
      }
      const persistentScroll = localStorage.getItem("persistentScroll");
      console.log(persistentScroll, "persistentScroll");
      console.log(window.scrollY.toString(), "scrolly");
      console.dir(window, document);
      if (persistentScroll) {
        console.log(persistentScroll, "scrollBy");
        window.scrollBy({ top: Number(persistentScroll) });
        localStorage.removeItem("persistentScroll");
      } else {
        localStorage.setItem("persistentScroll", window.scrollY.toString());
      }
      router.push(pathname + "?" + params.toString());
    },
    [searchParams, router, pathname]
  );

  return [get, set];
}
