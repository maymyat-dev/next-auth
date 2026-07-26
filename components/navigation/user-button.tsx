"use client";

import React from "react";
import { Button } from "../ui/button";
import { Session } from "next-auth";
import { LogIn, LogOut, Settings, Truck } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


type UserButtonProps = {
  user?: Session["user"];
};

const UserButton = ({ user }: UserButtonProps) => {
  return (
    <div className="flex items-center">
      <div className="hidden md:block">
        {user?.email && (
        <span className="mr-3 text-sm text-muted-foreground">
          👋 Welcome,{" "}
          <span className="font-semibold text-foreground">
            {user.name?.slice(0, 5) ?? user.email}
          </span>
        </span>
      )}
      </div>

      {user?.email ? (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button className="relative group focus:outline-none">
              <Avatar className="ring-2 ring-primary/40 transition-transform duration-300 group-hover:scale-105">
                <AvatarImage
                  src={user.image!}
                  alt={`${user.name ?? "User"}'s avatar`}
                />
                <AvatarFallback className="bg-primary text-white font-bold">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-30 blur-md bg-primary transition-all duration-300" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-60 p-3 shadow-xl border border-border/50 rounded-2xl animate-in fade-in-80 slide-in-from-top-2 bg-background/95 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 p-3 rounded-xl bg-primary text-white shadow-md hover:scale-95 transition-all duration-300 ease-in-out">
              <Avatar>
                <AvatarImage src={user.image!} alt={`${user.name ?? "User"}'s avatar`} />
                <AvatarFallback className="bg-white text-primary font-bold">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">{user.name}</h3>
                <p className="text-xs opacity-90">{user.email}</p>
              </div>
            </div>

            <DropdownMenuSeparator className="my-3" />

            <DropdownMenuItem
              onClick={async () => {
                await signOut({redirect: false});
                window.location.href ="/"
              }}
              className="cursor-pointer flex items-center gap-3 text-sm font-medium"
            >
              <LogOut className="w-6 h-6" />
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button asChild className="bg-primary text-primary-foreground rounded-full ">
          <Link href="/auth/login" className="flex items-center">
            <LogIn className="mr-1" size={16} /> Sign In
          </Link>
        </Button>
      )}
    </div>
  );
};

export default UserButton;
