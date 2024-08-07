"use client";

import CartPage from "@/components/pages/CartPage";
import { useAuthContext } from "@/components/providers/AuthProvider";

function UserCartPage() {
  const { user, setUser } = useAuthContext();
  return <CartPage {...{ user, setUser }} />;
}

export default UserCartPage;
