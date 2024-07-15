"use client";

import { useCallback, useState, useEffect } from "react";

export function useLocalStorage(key, defaultValue, options) {
  if (typeof window === "undefined") return [defaultValue, () => {}];
  return useStorage(key, defaultValue, window.localStorage, options);
}

export function useSessionStorage(key, defaultValue, options) {
  if (typeof window === "undefined") return [defaultValue, () => {}];
  return useStorage(key, defaultValue, window.sessionStorage, options);
}

function useStorage(key, defaultValue, storageObject , options = {}) {
  const [value, setValue] = useState(() => {
    const jsonValue = storageObject.getItem(key);
    if (jsonValue != null) {
      if (typeof defaultValue === "function" && options.runIfMissing) {
        return defaultValue(JSON.parse(jsonValue));
      } else {
        return JSON.parse(jsonValue);
      }
    } else {
      if (typeof defaultValue === "function") {
        return defaultValue(null);
      } else {
        return defaultValue;
      }
    }
  });

  useEffect(() => {
    if (value === undefined) return storageObject.removeItem(key);
    storageObject.setItem(key, JSON.stringify(value));
  }, [key, value, storageObject]);

  const remove = useCallback(() => {
    setValue(undefined);
  }, []);

  return [value, setValue, remove];
}
