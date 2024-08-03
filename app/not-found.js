"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-200px)]  flex flex-col gap-5 justify-center items-center">
      <h1 className="text-9xl font-bold text-foreground-800">404</h1>
      <p className="text-2xl font-semibold text-foreground-600">
        Oops! Page not found
      </p>
      <p className="mt-2 text-foreground-500">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Button variant="flat" color="primary" onClick={() => router.back()}>
        Go back
      </Button>
    </div>
  );
}

export default NotFoundPage;
