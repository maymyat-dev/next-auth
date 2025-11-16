"use client";

import React from "react";
import { SettingCard } from "./settings-card";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { twoFactorSchema } from "@/types/settings-schema";
import { useAction } from "next-safe-action/hooks";
import { twoFactorToggler } from "@/server/actions/settings";
import { cn } from "@/lib/utils";

type TwoFactorProps = {
  isTwoFactorEnabled: boolean;
  email: string;
};

const TwoFactorAuthentication = ({
  isTwoFactorEnabled,
  email,
}: TwoFactorProps) => {
  const form = useForm({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      isTwoFactorEnabled,
      email,
    },
  });

  const { execute, status } = useAction(twoFactorToggler, {
    onSuccess: ({ data }) => {
      if (data?.error) toast.error(data.error);
      if (data?.success) toast.success(data.success);
    },
  });

  const handleToggle = (checked: boolean) => {
    form.setValue("isTwoFactorEnabled", checked);

    execute({
      isTwoFactorEnabled: checked,
      email,
    });
  };

  return (
    <SettingCard >
     
      <Form {...form}>
        <FormField
          control={form.control}
          name="isTwoFactorEnabled"
          render={({ field }) => (
            <FormItem className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <FormLabel className="text-base font-semibold tracking-tight">
                  Two-Factor Authentication
                </FormLabel>

                <FormDescription className="text-sm leading-relaxed">
                  Add an extra layer of protection to your account by requiring
                  a verification code when logging in.
                </FormDescription>


                <Badge
                  variant={field.value ? "default" : "secondary"}
                  className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full",
                    field.value
                      ? "bg-green-600 hover:bg-green-600 text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {field.value ? "Enabled" : "Disabled"}
                </Badge>
              </div>

              <FormControl>
                <Switch
                  disabled={status === "executing"}
                  checked={field.value}
                  onCheckedChange={handleToggle}
                  className={cn(
                    "scale-[1.2] transition-transform",
                    status === "executing" && "animate-pulse"
                  )}
                />
              </FormControl>
            </FormItem>
          )}
        />
        </Form>
    </SettingCard>
  );
};

export default TwoFactorAuthentication;
