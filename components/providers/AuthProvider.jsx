"use client";

import { createContext, useContext } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export const AuthContext = createContext(null);

function AuthProvider({children}) {
  const [user, setUser] = useLocalStorage("user", null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export const useAuthContext = () => useContext(AuthContext);
