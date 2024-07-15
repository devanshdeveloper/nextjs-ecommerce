"use client";
import { Divider, Listbox, ListboxItem, ScrollShadow } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <>
      <div className="absolute top-[68px] left-0 z-[10000] w-[300px] flex flex-col border-r-1 border-foreground-200">
        <ScrollShadow className="h-[calc(100vh-64px)] no-scrollbar">
          <Listbox
          
            itemClasses={{ base: "py-3 px-4"  , list : "gap-0"}}
            items={[
              { href: "/admin/users", text: "Users" },
              { href: "/admin/categories", text: "Categories" },
              { href: "/admin/products", text: "Products" },
            ]}
            aria-label="Dynamic Actions"
            onAction={(key) => router.push(key)}
          >
            {(item) => (
              <ListboxItem
                key={item.href}
                className={`text-lg rounded-none m-0 ${item.href === pathname ? "bg-default" : ""}`}
              >
                {item.text}
              </ListboxItem>
            )}
          </Listbox>
          <div className="h-16"></div>
        </ScrollShadow>
      </div>

      <div className="absolute top-[68px] left-[300px] ">{children}</div>
    </>
  );
}
