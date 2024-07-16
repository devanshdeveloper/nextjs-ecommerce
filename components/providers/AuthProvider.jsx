"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getUserById } from "../../fetch/user";
import FullScreenSpinner from "../spinners/FullScreenSpinner";

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage("user", null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function asyncHandler() {
      if (!user || !user._id) return;
      try {
        const updatedUser = await getUserById({ id: user._id });
        setUser(updatedUser);
      } catch (error) {
        console.error(error);
        setUser(null); 
      } finally {
        setLoading(false);
      }
    }

    asyncHandler();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {loading ? <FullScreenSpinner /> : children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export const useAuthContext = () => useContext(AuthContext);
