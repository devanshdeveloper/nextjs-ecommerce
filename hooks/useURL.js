import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";

export default function useURL() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const persistentScroll = localStorage.getItem("persistentScroll");
    if (persistentScroll === null) return;
    window.scrollTo({ top: Number(persistentScroll) });
    if (Number(persistentScroll) === window.scrollY)
      localStorage.removeItem("persistentScroll");
  }, [searchParams]);

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
      localStorage.setItem("persistentScroll", window.scrollY.toString());
      router.push(pathname + "?" + params.toString());
    },
    [searchParams, router, pathname]
  );

  return [get, set];
}
