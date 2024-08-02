"use client";

// HOOKS
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "../providers/AuthProvider";
import Link from "next/link";
import Image from "next/image";
import { FaAngleDown } from "react-icons/fa6";
import { Button } from "@nextui-org/react";
import { twMerge } from "tailwind-merge";
import { ShoppingCart } from "lucide-react";

function Nav() {
  // CONTEXT
  const { user, setUser } = useAuthContext();

  // STATE
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // NEXT/NAVIGATION
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "Admin";
  const menuItems = [
    { href: "/shop", text: "Shop", emoji: "🛒", show: true },
    { href: "/auth?action=login", text: "Log In", emoji: "🔑", show: !isAuthenticated },
    { href: "/auth?action=signin", text: "Sign In", emoji: "📝", show: !isAuthenticated },
    {
      href: "/cart",
      text: "Cart",
      emoji: "🛍️",
      show: true,
      className: "hidden md:flex",
    },
    {
      href: "/account",
      text: "Account",
      emoji: "👤",
      show: isAuthenticated,
    },
    {
      href: "/admin/users",
      text: "Users",
      emoji: "👥",
      show: isAdmin,
    },
    {
      href: "/admin/categories",
      text: "Categories",
      emoji: "📂",
      show: isAdmin,
    },
    {
      href: "/admin/products",
      text: "Products",
      emoji: "🛒",
      show: isAdmin,
    },
    {
      href: "/admin/orders",
      text: "Orders",
      emoji: "📦",
      show: isAdmin,
    },
    {
      onClick: () => {
        router.push("/");
        setUser(null);
      },
      text: "Log out",
      emoji: "🚪",
      show: isAuthenticated,
      color: "danger",
    },
  ];

  return (
    <>
      <div className="fixed flex justify-center h-[80px] w-screen bg-background z-[10] border-b-1 border-foreground-500 border-opacity-50">
        <div className="flex items-center justify-between h-full w-[min(1320px,100vw)] px-5 md:px-10">
          <button
            className={`md:hidden flex items-center text-2xl text-foreground hover:text-foreground-500 ${
              isMenuOpen ? "rotate-180" : ""
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "X" : "☰"}
          </button>

          <Link href="/" className="flex items-center h-full">
            <span className="text-lg md:text-xl">Bhrm Clothings</span>
          </Link>
          <Link href="/cart" className="flex items-center h-full md:hidden">
            <ShoppingCart />
          </Link>

          <ul
            className={twMerge(
              "absolute md:static top-[80px]  bg-background h-screen md:h-full w-screen md:w-auto flex flex-col items-start md:items-center md:flex-row gap-5 md:gap-7 p-10 md:p-0 transition-all duration-200",
              isMenuOpen ? "left-0" : "left-[-100vw]"
            )}
          >
            {menuItems.map((item, i) => {
              if (!item.show) return null;
              if (item.CustomElement) {
                return <item.CustomElement key={index} />;
              }
              if (item.onClick) {
                return (
                  <li
                    className={twMerge("flex items-center", item.className)}
                    key={i}
                  >
                    <Button
                      className="w-full"
                      color={item.color || "primary"}
                      variant="flat"
                      onPress={() => {
                        setIsMenuOpen(false);
                        item.onClick();
                      }}
                    >
                      <span>{item.emoji}</span>
                      <span>{item.text}</span>
                    </Button>
                  </li>
                );
              }
              return (
                <li
                  className={twMerge("flex items-center", item.className)}
                  key={i}
                >
                  <Link
                    href={item.href}
                    className={twMerge(
                      "hover:underline transition-all duration-200 flex gap-2",
                      pathname.includes(item.href) ? "font-bold" : ""
                    )}
                    key={item.text}
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.text}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="h-[80px]"></div>
    </>
  );
}

export default Nav;

// // UI COMPONENTS
// import {
//   Navbar,
//   NavbarBrand,
//   NavbarContent,
//   NavbarItem,
//   NavbarMenuToggle,
//   NavbarMenu,
//   NavbarMenuItem,
//   Button,
//   Dropdown,
//   DropdownTrigger,
//   Avatar,
//   DropdownMenu,
//   DropdownItem,
// } from "@nextui-org/react";
// import Link from "next/link";

// export default function Nav() {
//   // CONTEXT
//   const { user, setUser } = useAuthContext();

//   // STATE
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   // NEXT/NAVIGATION
//   const router = useRouter();
//   const pathname = usePathname();

//   const menuItems = [
//     { href: "/shop", text: "Shop", show: true },
//     { href: "/auth?action=login", text: "Log In", show: !user },
//     { href: "/auth?action=signin", text: "Sign In", show: !user },
//     {
//       show: !!user,
//       CustomElement: () => (
//         <>
//           <Dropdown placement="bottom-end">
//             <DropdownTrigger>
//               <Avatar
//                 isBordered
//                 as="button"
//                 className="transition-transform"
//                 src={user.image}
//                 name={user.name}
//               />
//             </DropdownTrigger>
//             <DropdownMenu aria-label="Profile Actions" variant="flat">
//               <DropdownItem key="profile" className="h-14 gap-2">
//                 <p className="font-semibold">Signed in as</p>
//                 <p className="font-semibold">{user.email}</p>
//               </DropdownItem>
//               {[
//                 { href: "/cart", text: "Cart", show: true },
//                 {
//                   href: "/account",
//                   text: "Account",
//                   show: !!user,
//                 },
//                 {
//                   href: "/admin",
//                   text: "Admin",
//                   show: !!user && user.role === "Admin",
//                 },
//                 {
//                   onClick: () => {
//                     router.push("/");
//                     setUser(null);
//                   },
//                   text: "Log out",
//                   show: !!user,
//                   color: "danger",
//                 },
//               ].map(
//                 (item, i) =>
//                   item.show && (
//                     <DropdownItem
//                       as={item.onClick ? "div" : Link}
//                       onPress={() => item.onClick && item.onClick()}
//                       href={item.href}
//                       key={item.href || i}
//                       color={item.color}
//                     >
//                       {item.text}
//                     </DropdownItem>
//                   )
//               )}
//             </DropdownMenu>
//           </Dropdown>
//         </>
//       ),
//     },
//   ];

//   function NavbarItems({ NavbarItem, className }) {
//     return menuItems.map((item, index) => {
//       if (!item.show) return null;
//       if (item.CustomElement) {
//         return <item.CustomElement key={index} />;
//       }
//       return (
//         <NavbarItem {...{ className }} key={`${item.href}-${index}`}>
//           {item.onClick ? (
//             <Button
//               className="w-full"
//               color="primary"
//               variant="flat"
//               onPress={(e) => {
//                 setIsMenuOpen(false);
//                 item.onClick(e);
//               }}
//             >
//               {item.text}
//             </Button>
//           ) : (
//             <button
//               className={`w-full ${pathname === item.href ? "font-bold" : ""}`}
//               onClick={() => {
//                 setIsMenuOpen(false);
//                 router.push(item.href);
//               }}
//             >
//               {item.text}
//             </button>
//           )}
//         </NavbarItem>
//       );
//     });
//   }

//   return (
//     <>
//       <Navbar
//         isBordered
//         classNames={{ base: "fixed" }}
//         isMenuOpen={isMenuOpen}
//         onMenuOpenChange={setIsMenuOpen}
//       >
//         <NavbarContent>
//           <NavbarBrand>
//             <Link href={"/"} className="font-bold text-inherit">
//               Bhrm Clothings
//             </Link>
//           </NavbarBrand>
//         </NavbarContent>
//         <NavbarContent justify="end">
//           <NavbarItems className="hidden sm:flex" NavbarItem={NavbarItem} />
//           <NavbarMenuToggle
//             aria-label={isMenuOpen ? "Close menu" : "Open menu"}
//             className="sm:hidden"
//           />
//         </NavbarContent>
//         <NavbarMenu>
//           <NavbarItems NavbarItem={NavbarMenuItem} />
//         </NavbarMenu>
//       </Navbar>
//       <div className="h-16"></div>
//     </>
//   );
// }
