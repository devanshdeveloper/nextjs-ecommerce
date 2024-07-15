"use client";
import { Avatar } from "@nextui-org/react";
import { useAuthContext } from "./../../components/providers/AuthProvider";
import { useRouter } from "next/navigation";

function AccountPage() {
  const { user } = useAuthContext();
  const router = useRouter();

  if (!user) {
    return router.push("/")
   }
 

  return (
    <div>
      <div>
        <Avatar {...{ src: user.image, name: user.name }} />
      </div>
    </div>
  );
}

export default AccountPage;
