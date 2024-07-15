"use client";

import { useTheme } from "next-themes";
import MoonIcon from "../icons/MoonIcon";
import { Button } from "@nextui-org/react";

function ThemeButton() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      isIconOnly
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed bottom-10 left-10 z-[1000]"
    >
      <MoonIcon />
    </Button>
  );
}

export default ThemeButton;
