"use client";

// UI COMPONENTS
import PasswordInput from "@/components/inputs/PasswordInput";
import { Button, Divider, Input } from "@nextui-org/react";
import { useAuthContext } from "@/components/providers/AuthProvider";

// HOOKS
import useURL from "@/hooks/useURL";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// UTILS
import { continueWithGoogleUser, createOneUser, logInUser } from "@/fetch/user";
import getFormData from "@/utils/getFormData";
import parseError from "@/utils/parseError";
import { BsGoogle } from "react-icons/bs";
import loadScript from "@/utils/loadScript";
import { fetchGoogleUserDetails } from "@/utils/google-auth";

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

  const mutate_logInWithGoogle = useMutation({
    mutationFn: async () => {
      return new Promise(async (resolve, reject) => {
        await loadScript("https://accounts.google.com/gsi/client", {
          async: true,
          defer: true,
        });
        const client = window?.google?.accounts?.oauth2.initTokenClient({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          scope: `openid profile email`,
          callback: async (credentialResponse) => {
            const googleUser = await fetchGoogleUserDetails(
              credentialResponse.access_token
            );
            if (googleUser) {
              resolve(
                await continueWithGoogleUser({
                  name: googleUser.name,
                  email: googleUser.email,
                  isEmailVerified: googleUser.verified_email,
                  image: googleUser.picture,
                  provider: "google",
                })
              );
            } else {
              reject("Failed to get Google user");
            }
          },
          error_callback: reject,
        });
        client.requestAccessToken();
      });
    },
    onSuccess(user) {
      setUser(user);
      console.log(user);
      router.push("/shop");
    },
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
      <div className="w-[min(80vw,500px)] flex flex-col gap-10 items-center">
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
                  isLoginPage
                    ? mutate_logInUser.error
                    : mutate_createOneUser.error
                )}
              </span>
            )}
          </div>
        </form>
        <Divider />
        <div>
          <Button
            type="button"
            variant="faded"
            size="lg"
            color="primary"
            isIconOnly
            onPress={() => mutate_logInWithGoogle.mutate()}
            isLoading={mutate_logInWithGoogle.isPending}
          >
            <BsGoogle size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
