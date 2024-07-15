"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export default function useURL() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const get = useCallback((...keys) => {
    const res = {};
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      res[key] = searchParams.get(key);
    }
    return res;
  });

  const set = useCallback((obj, options) => {
    const params = new URLSearchParams(
      options?.strict ? null : searchParams.toString()
    );
    for (const key in obj) {
      params.set(key, obj[key]);
    }
    router.push(pathname + "?" + params.toString());
  });

  return [ get, set ];
}
