"use client";
// HOOKS
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "../providers/AuthProvider";

// UI COMPONENTS
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Dropdown,
  DropdownTrigger,
  Avatar,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import Link from "next/link";

export default function Nav() {
  // CONTEXT
  const { user, setUser } = useAuthContext();

  // STATE
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // NEXT/NAVIGATION
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { href: "/shop", text: "Shop", show: true },
    { href: "/auth?action=login", text: "Log In", show: !user },
    { href: "/auth?action=signin", text: "Sign In", show: !user },
    {
      show: !!user,
      CustomElement: () => (
        <>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                src={user.image}
                name={user.name}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user.email}</p>
              </DropdownItem>
              {[
                { href: "/cart", text: "Cart", show: true },
                {
                  href: "/account",
                  text: "Account",
                  show: !!user,
                },
                {
                  href: "/admin",
                  text: "Admin",
                  show: !!user && user.role === "Admin",
                },
                {
                  onClick: () => {
                    router.push("/");
                    setUser(null);
                  },
                  text: "Log out",
                  show: !!user,
                  color: "danger",
                },
              ].map(
                (item, i) =>
                  item.show && (
                    <DropdownItem
                      as={item.onClick ? "div" : Link}
                      onPress={() => item.onClick && item.onClick()}
                      href={item.href}
                      key={item.href || i}
                      color={item.color}
                    >
                      {item.text}
                    </DropdownItem>
                  )
              )}
            </DropdownMenu>
          </Dropdown>
        </>
      ),
    },
  ];

  function NavbarItems({ NavbarItem, className }) {
    return menuItems.map((item, index) => {
      if (!item.show) return null;
      console.log(item.CustomElement);
      if (item.CustomElement) {
        return <item.CustomElement key={index} />;
      }
      return (
        <NavbarItem {...{ className }} key={`${item.href}-${index}`}>
          {item.onClick ? (
            <Button
              className="w-full"
              color="primary"
              variant="flat"
              onPress={(e) => {
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
    <>
      <Navbar
        isBordered
        classNames={{ base: "fixed" }}
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        <NavbarContent>
          <NavbarBrand>
            <Link href={"/"} className="font-bold text-inherit">
              Bhrm Clothings
            </Link>
          </NavbarBrand>
        </NavbarContent>
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
      <div className="h-16"></div>
    </>
  );
}
