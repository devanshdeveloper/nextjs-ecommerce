"use client";

// UI COMPONENTS
import PasswordInput from "@/components/inputs/PasswordInput";
import { Button, Input } from "@nextui-org/react";
import { useAuthContext } from "@/components/providers/AuthProvider";

// HOOKS
import useURL from "@/hooks/useURL";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// UTILS
import { createOneUser, logInUser } from "@/fetch/user";
import getFormData from "@/utils/getFormData";
import parseError from "@/utils/parseError";

function AuthPage() {
  const { setUser } = useAuthContext();
  const [getSearchParams] = useURL();
  const router = useRouter();

  const isLoginPage = getSearchParams("action").action === "login";

  function onSuccess(user) {
    setUser(user.user || user);
    router.push(user.user ? "/shop" : "/verify-email");
  }

  const mutate_createOneUser = useMutation({
    mutationFn: createOneUser,
    onSuccess,
  });

  const mutate_logInUser = useMutation({
    mutationFn: logInUser,
    onSuccess,
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (isLoginPage) {
      mutate_logInUser.mutate(getFormData(e, "email", "password"));
    } else {
      mutate_createOneUser.mutate(getFormData(e, "name", "email", "password"));
    }
  }

  return (
    <div className="flex justify-center items-center">
      <div className="w-[min(80vw,500px)] flex flex-col items-center">
        <div className="text-5xl font-semibold my-20">
          {isLoginPage ? "Log in" : "Sign In"}
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col w-full gap-5">
          {!isLoginPage && <Input type="text" label="Name" name="name" />}
          <Input type="email" label="Email" name="email" />
          <PasswordInput name="password" />
          <div className="flex flex-col gap-2">
            <Button
              isLoading={
                mutate_createOneUser.isPending || mutate_logInUser.isPending
              }
              type="submit"
              color="primary"
            >
              {isLoginPage ? "Log in" : "Sign In"}
            </Button>
            {(mutate_createOneUser.error || mutate_logInUser.error) && (
              <span className="text-red-500">
                {parseError(
                  isLoginPage ? mutate_logInUser.error : mutate_createOneUser.error
                )}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
