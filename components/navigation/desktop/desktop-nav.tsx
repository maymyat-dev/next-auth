import React from "react";
import NavLogo from "../nav-logo";
import { ModeToggle } from "@/components/mode-button";
import UserButton from "../user-button";
import CartBtn from "../../cart/cart-btn";
import MenuButton from "./menu-button";

const DesktopNav = async ({ user }: { user: any }) => {
  return (
    <header
      className="
        sticky top-0 z-50
        flex h-17 w-full items-center justify-between
        px-6 md:px-10
        mb-6
        bg-background/60 dark:bg-background/40
        backdrop-blur-xl backdrop-saturate-150
        border-b border-black/5 dark:border-white/8
        shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)]
        transition-all duration-300
      "
    >
      <div className="flex items-center gap-8">
        <NavLogo />
      </div>

      <div className="flex-1 flex justify-center">
        <MenuButton />
      </div>

      <div className="flex gap-3 md:gap-4 items-center">
        <CartBtn />
        <UserButton user={user} />
        <ModeToggle />
      </div>
    </header>
  );
};

export default DesktopNav;
