"use client";

import { BotIcon, Sparkle, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {mobileMenus} from "@/lib/nav-config";

const MobileNav = () => {
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/auth/login" || pathname === "/auth/register";

  if (!isAuthPage)
    return (
      <>
        <div className="md:hidden fixed bottom-0 left-0 w-full z-50">
          <div className="relative flex items-center justify-between rounded-4xl backdrop-blur-3xl shadow-primary/10 border border-black/5 dark:border-white/10">
            <div className="flex flex-1 justify-around items-center">
              {mobileMenus.slice(0, 2).map((menu, index) => (
                <Link
                  key={index}
                  href={menu.path}
                  className={cn(
                    "flex flex-col items-center gap-1 transition-all",
                    pathname === menu.path
                      ? "text-primary scale-110"
                      : "text-black dark:text-white",
                  )}
                >
                  <menu.icon />
                  <span className="text-[10px] font-medium">{menu.name}</span>
                </Link>
              ))}
            </div>

            <div className="relative -top-6">
              <Link href="/ai-assistant">
                <div className="bg-primary p-4 rounded-full shadow-lg shadow-primary/40 border-4 border-background animate-pulse-slow">
                  <Sparkles className="text-white" size={28} />
                </div>
              </Link>
            </div>

            <div className="flex flex-1 justify-around items-center">
              {mobileMenus.slice(2, 4).map((menu, index) => (
                <Link
                  key={index}
                  href={menu.path}
                  className={cn(
                    "flex flex-col items-center gap-1 transition-all",
                    pathname === menu.path
                      ? "text-primary scale-110"
                      : "text-black dark:text-white",
                  )}
                >
                  <menu.icon />
                  <span className="text-[10px] font-medium">{menu.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </>
    );
};

export default MobileNav;
