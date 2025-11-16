"use client";
import { Session } from "next-auth";
import React, { useState } from "react";
import { SettingCard } from "./settings-card";
import { UserRoundPen } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import useMediaQuery from "@/hooks/useMediaQuery";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import ProfileForm from "./profile-form";
import AvatarUploadForm from "./avatar-upload-form";

type ProfileCardProps = {
  session: Session;
};

const ProfileCard = ({ session }: ProfileCardProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(false);
  }

  return (
    <SettingCard>
      <div className="flex justify-between items-start gap-2 rounded-2xl">
        <div className="md:flex flex-none md:gap-2 mb">
          <AvatarUploadForm name={ session.user?.name! } image={session.user?.image} email={session.user?.email!} />
          <div className="mt-2 md:mt-0">
            <h3 className="text-lg font-semibold">{session.user?.name}</h3>
            <p className="text-sm text-muted-foreground">
              {session.user?.email}
            </p>
          </div>
        </div>

        {isDesktop ? (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <UserRoundPen className="w-5 h-5 text-muted-foreground hover:text-black cursor-pointer" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="items-center">
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  This will be your public display name.
                </DialogDescription>
              </DialogHeader>
              <ProfileForm
                name={session.user?.name!}
                email={session.user?.email!}
                setIsOpen = {handleOpen}
              />
              <DialogFooter className="block">
                <DialogClose className="w-full">
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
              <UserRoundPen className="w-5 h-5 text-muted-foreground hover:text-black cursor-pointer" />
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="items-center">
                <DrawerTitle>Edit Profile</DrawerTitle>
                <DrawerDescription>
                  This will be your public display name.
                </DrawerDescription>
              </DrawerHeader>
                <div className="p-4">
                  <ProfileForm
                
                name={session.user?.name!}
                  email={session.user?.email!}
                  setIsOpen = {handleOpen}
              />
              </div>
              <DrawerFooter className="pt-0" >
                <DrawerClose>
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </SettingCard>
  );
};

export default ProfileCard;
