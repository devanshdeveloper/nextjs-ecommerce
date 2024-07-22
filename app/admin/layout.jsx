"use client";

// UI COMPONENTS
import { Button, Listbox, ListboxItem, ScrollShadow } from "@nextui-org/react";
import PageLayout from "@/components/layout/PageLayout";
import { FaChevronLeft, FaChevronRight, FaFolderOpen } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { BsBoxSeamFill } from "react-icons/bs";
import { CgNotes } from "react-icons/cg";

// HOOKS
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useState } from "react";
import useWindowSize from "@/hooks/useWindowSize";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthContext();
  const [windowSize] = useWindowSize({});
  const isMobile = windowSize <= 768;
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  if (user?.role !== "Admin") {
    return (
      <PageLayout>
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

  return (
    <div className="flex">
      <ScrollShadow
        className={`fixed z-10 h-[calc(100vh-64px)] no-scrollbar transition-all duration-200 ${
          isSidebarOpen ? (isMobile ? "w-screen" : "w-[300px]") : "w-[50px]"
        }`}
      >
        <Listbox
          classNames={{
            base: "p-0 gap-0",
            list: "gap-0",
          }}
          itemClasses={{ base: "py-3 px-4" }}
          items={[
            {
              href: "/admin/users",
              text: "Users",
              icon: <FaUsers size={20} />,
            },
            {
              href: "/admin/categories",
              text: "Categories",
              icon: <FaFolderOpen size={20} />,
            },
            {
              href: "/admin/products",
              text: "Products",
              icon: <BsBoxSeamFill size={20} />,
            },
            {
              href: "/admin/orders",
              text: "Orders",
              icon: <CgNotes size={20} />,
            },
          ]}
          aria-label="Dynamic Actions"
          onAction={(key) => router.push(key)}
        >
          {(item) => (
            <ListboxItem
              key={item.href}
              className={`text-lg rounded-none m-0 transition-all duration-200 ${
                item.href === pathname ? "bg-default" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {isSidebarOpen ? item.text : ""}
              </div>
            </ListboxItem>
          )}
        </Listbox>
        <div
          className={`w-full flex transition-all duration-200  ${
            isSidebarOpen ? "justify-end" : "justify-center"
          } p-4`}
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          {isSidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </div>
        <div className="h-16"></div>
      </ScrollShadow>
      <div
        className={`fixed transition-all duration-200 ${
          isSidebarOpen
            ? isMobile
              ? "left-full w-[0px]"
              : "left-[300px] w-[calc(100vw-300px)]"
            : "left-[50px] w-[calc(100vw-50px)]"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
