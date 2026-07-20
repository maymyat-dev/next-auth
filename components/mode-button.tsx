"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative h-9 w-9 rounded-full bg-white/50 dark:bg-card/40 border-neutral-200/60 dark:border-white/10 backdrop-blur-md transition-all hover:bg-neutral-100 dark:hover:bg-card/80 active:scale-95"
        >
          <Sun className="h-[1.1rem] w-[1.1rem] scale-100 rotate-0 transition-all duration-300 dark:scale-0 dark:-rotate-90 text-amber-500" />
          <Moon className="absolute h-[1.1rem] w-[1.1rem] scale-0 rotate-90 transition-all duration-300 dark:scale-100 dark:rotate-0 text-violet-400" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="bg-white/80 dark:bg-card/80 backdrop-blur-md border-neutral-200/60 dark:border-white/10 rounded-xl shadow-lg"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="cursor-pointer rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10"
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="cursor-pointer rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10"
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="cursor-pointer rounded-lg hover:bg-neutral-100 dark:hover:bg-white/10"
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}