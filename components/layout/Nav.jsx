"use client";

import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
} from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "../providers/AuthProvider";

export default function Nav() {
  const { user, setUser } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { href: "/shop", text: "Shop", show: true },
    { href: "/cart", text: "Cart", show: true },
    { href: "/auth?action=login", text: "Log In", show: !user },
    { href: "/auth?action=signin", text: "Sign In", show: !user },
    { href: "/admin", text: "Admin", show: !!user && user.role === "Admin" },
    { href: "/account", text: "Account", show: !!user },
    {
      onClick: () => {
        router.push("/");
        setUser(null);
      },
      text: "Log out",
      show: !!user,
    },
  ];

  function NavbarItems({ NavbarItem, className }) {
    return menuItems.map((item, index) => {
      if (!item.show) return null;
      return (
        <NavbarItem {...{ className }} key={`${item.href}-${index}`}>
          {item.onClick ? (
            <Button
              className="w-full"
              color="primary"
              variant="flat"
              onClick={(e) => {
                setIsMenuOpen(false);
                item.onClick(e);
              }}
            >
              {item.text}
            </Button>
          ) : (
            <button
              className={`w-full ${pathname === item.href ? "font-bold" : ""}`}
              onClick={() => {
                setIsMenuOpen(false);
                router.push(item.href);
              }}
            >
              {item.text}
            </button>
          )}
        </NavbarItem>
      );
    });
  }

  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarBrand>
        <p className="font-bold text-inherit">Bhrm Clothings</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItems className="hidden sm:flex" NavbarItem={NavbarItem} />
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
      </NavbarContent>
      <NavbarMenu>
        <NavbarItems NavbarItem={NavbarMenuItem} />
      </NavbarMenu>
    </Navbar>
  );
}
