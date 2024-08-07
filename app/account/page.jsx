"use client";
import { Avatar, Button } from "@nextui-org/react";
import { useAuthContext } from "./../../components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

function AccountPage() {
  const { user, setUser } = useAuthContext();
  const router = useRouter();

  if (!user) {
    return router.push("/");
  }

  return (
    <div className="flex justify-center p-10">
      <div className="flex flex-col items-center gap-10 w-[min(1250px,95vw)]">
        <div className="flex flex-col lg:flex-row items-center lg:justify-between w-full">
          <div className="text-2xl lg:text-3xl font-semibold text-foreground-800 text-center lg:text-left">
            Welcome, {user.name}!
          </div>
          <div className="mt-4 lg:mt-0 flex gap-5">
            <Button
              color="primary"
              variant="flat"
              className="px-4 py-2 lg:px-6 lg:py-3"
              onClick={() => router.push("/account/edit")}
            >
              Edit Profile
            </Button>
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
          </div>
        </div>
        <Avatar
          size="2xl"
          shape="rounded"
          className="w-32 h-32 lg:w-48 lg:h-48 shadow-lg border-2 border-primary"
          src={user.image}
          name={user.name}
        />
        <div className="text-center">
          <div className="font-bold text-2xl lg:text-3xl text-foreground-800">
            {user.name}
          </div>
          <div className="text-lg lg:text-xl text-foreground-500">
            {user.email}
          </div>
        </div>
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
            <div className="bg-foreground-100 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-foreground-700 mb-3">
                Your Cart
              </h3>
              <Link
                href="/cart"
                className="text-primary hover:text-primary-dark font-medium"
              >
                View Cart
              </Link>
            </div>
            <div className="bg-foreground-100 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-foreground-700 mb-3">
                Your Orders
              </h3>
              <Link
                href="/orders"
                className="text-primary hover:text-primary-dark font-medium"
              >
                View Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
