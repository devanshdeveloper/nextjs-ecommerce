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
import {
  addToCart,
  continueWithGoogleUser,
  createOneUser,
  logInUser,
} from "@/fetch/user";
import getFormData from "@/utils/getFormData";
import parseError from "@/utils/parseError";
import { BsGoogle } from "react-icons/bs";
import loadScript from "@/utils/loadScript";
import { fetchGoogleUserDetails } from "@/utils/google-auth";
import { useCallback } from "react";

function AuthPage() {
  const { setUser } = useAuthContext();
  const [getSearchParams, setSearchParams] = useURL();
  const router = useRouter();

  const isLoginPage = getSearchParams("action").action === "login";

  const handlePendingAddToCart = useCallback(async (user) => {
    const pendingAddToCart = localStorage.getItem("addToCartPending");
    if (pendingAddToCart) {
      const { productId, quantity, variants } = JSON.parse(pendingAddToCart);
      const newCart = await addToCart({
        productId,
        quantity,
        variants,
        userId: user?._id,
      });
      user.cart = newCart;
      return user;
    } else return user;
  }, []);

  function onSuccess(user) {
    setUser(user);
    const pendingAddToCart = localStorage.getItem("addToCartPending");
    // router.push(user.user ? "/shop" : "/verify-email");
    router.push(pendingAddToCart ? "/shop?showCartModal=true" : "/shop");
    localStorage.removeItem("addToCartPending");
  }

  const mutate_createOneUser = useMutation({
    mutationFn: async (...args) => {
      const user = await createOneUser(...args);
      return await handlePendingAddToCart(user);
    },
    onSuccess,
  });

  const mutate_logInUser = useMutation({
    mutationFn: async (...args) => {
      const user = await logInUser(...args);
      return await handlePendingAddToCart(user.user);
    },
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
              const user = await continueWithGoogleUser({
                name: googleUser.name,
                email: googleUser.email,
                isEmailVerified: googleUser.verified_email,
                image: googleUser.picture,
                provider: "google",
              });
              resolve(await handlePendingAddToCart(user));
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
      const pendingAddToCart = localStorage.getItem("addToCartPending");
      // router.push(user.user ? "/shop" : "/verify-email");
      router.push(pendingAddToCart ? "/shop?showCartModal=true" : "/shop");
      localStorage.removeItem("addToCartPending");
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

  const pendingAddToCart = localStorage.getItem("addToCartPending");

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
      <div className="p-5 w-[min(95vw,500px)] flex flex-col gap-10 items-center">
        <div className="flex flex-col gap-2 text-center my-10">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground-800">
            {isLoginPage ? "Log in" : "Sign Up"}
          </h1>
          {pendingAddToCart && (
            <p className="text-foreground-500 text-xs md:text-sm font-normal">
              Login to continue the action
            </p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col w-full gap-5">
          {!isLoginPage && <Input type="text" label="Name" name="name" />}
          <Input type="email" label="Email" name="email" />
          <PasswordInput name="password" />
          <div className="flex flex-col gap-3">
            <Button
              isLoading={
                mutate_createOneUser.isPending || mutate_logInUser.isPending
              }
              type="submit"
              color="primary"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300"
            >
              {isLoginPage ? "Log in" : "Sign Up"}
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
        <Divider className="my-6" />
        <Button
          type="button"
          variant="bordered"
          size="lg"
          color="primary"
          onPress={() => mutate_logInWithGoogle.mutate()}
          isLoading={mutate_logInWithGoogle.isPending}
          className="flex items-center justify-center w-full py-3 border border-foreground-300 rounded-lg hover:bg-foreground-100 transition duration-300"
        >
          <BsGoogle size={20} className="mr-2" /> Continue With Google
        </Button>
        <div className="text-center mt-6">
          {isLoginPage ? (
            <p className="text-sm text-foreground-600">
              New to Bhrm Clothing?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setSearchParams({ action: "signup" })}
              >
                Sign Up
              </span>
            </p>
          ) : (
            <p className="text-sm text-foreground-600">
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setSearchParams({ action: "login" })}
              >
                Log in
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
