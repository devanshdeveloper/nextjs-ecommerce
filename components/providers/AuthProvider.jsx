"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { readOneUser } from "../../fetch/user";
import FullScreenLayout from "../layout/FullScreenLayout";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage("user", null);
  const router = useRouter();

  useEffect(() => {
    async function asyncHandler() {
      if (!user || !user._id) {
        return;
      }
      try {
        const updatedUser = await readOneUser({ id: user._id });
        setUser(updatedUser);
      } catch (error) {
        console.error(error);
        setUser(null);
      }
    }

    asyncHandler();
  }, []);

  const refetchUser = useCallback(async () => {
    if (!user || !user._id) {
      return;
    }
    try {
      const updatedUser = await readOneUser({ id: user._id });
      setUser(updatedUser);
    } catch (error) {
      console.error(error);
      setUser(null);
    }
  }, []);

  if (user && user.role === "Blocked") {
    return (
      <FullScreenLayout className="flex-col gap-5">
        <div className="text-3xl">Your account has been blocked.</div>
        <div className="flex flex-col gap-1 items-center">
          <p className="text-medium text-foreground-500">
            Please contact website owner for support
          </p>
          <Link
            className="text-medium text-foreground-500 hover:underline"
            href="mailto:bhrmclothing@gmail.com"
          >
            Contact : bhrmclothing@gmail.com
          </Link>
        </div>
        <Button
          color="danger"
          variant="flat"
          className="px-4 py-2 lg:px-6 lg:py-3"
          onPress={() => {
            router.push("/");
            setUser(null);
          }}
        >
          Logout
        </Button>
      </FullScreenLayout>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export const useAuthContext = () => useContext(AuthContext);
