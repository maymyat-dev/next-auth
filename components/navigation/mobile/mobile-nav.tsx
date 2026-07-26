"use client";

import { BotIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { mobileMenus } from "@/lib/nav-config";

const MobileNav = () => {
  const pathname = usePathname();

  const isAuthPage = ["/auth/login", "/auth/register"].includes(pathname);

  if (isAuthPage) return null;

  const renderMenus = (menus: typeof mobileMenus) =>
    menus.map((menu) => (
      <Link
        key={menu.path}
        href={menu.path}
        className={cn(
          "flex flex-col items-center gap-1 transition-all",
          pathname === menu.path
            ? "text-primary scale-110"
            : "text-black dark:text-white",
        )}
      >
        <menu.icon size={22} strokeWidth={1.6} />
        <span className="text-[10px] font-medium">
          {menu.name}
        </span>
      </Link>
    ));

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full z-50">
      <div className="relative flex items-center justify-between rounded-4xl backdrop-blur-xl shadow-primary/10 border border-black/5 dark:border-white/10">
        
        <div className="flex flex-1 justify-around items-center">
          {renderMenus(mobileMenus.slice(0, 2))}
        </div>

        <div className="relative -top-4">
          <Link href="/ai-assistant">
            <div className="bg-primary p-3 rounded-full shadow-lg shadow-primary/40 border-4 border-background animate-pulse-slow">
              <BotIcon
                className="text-white"
                size={24}
                strokeWidth={1.5}
              />
            </div>
          </Link>
        </div>

        <div className="flex flex-1 justify-around items-center">
          {renderMenus(mobileMenus.slice(2, 4))}
        </div>

      </div>
    </div>
  );
};

export default MobileNav;