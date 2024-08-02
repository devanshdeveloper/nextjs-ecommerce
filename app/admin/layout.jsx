"use client";

// UI COMPONENTS
import { Button } from "@nextui-org/react";
import PageLayout from "@/components/layout/PageLayout";

// HOOKS
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { user } = useAuthContext();

  if (user?.role !== "Admin") {
    return (
      <PageLayout className="flex-col gap-5">
        <h1 className="text-3xl">Unauthorized Access</h1>
        <Button
          variant="flat"
          color="primary"
          size="lg"
          onPress={() => router.push("/shop")}
        >
          Back to Shop
        </Button>
      </PageLayout>
    );
  }

  return children;
}
