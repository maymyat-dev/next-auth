"use client";
import React from "react";
import { SettingCard } from "./settings-card";
import { KeyRound } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { register } from "@/server/actions/register-action";
import { toast } from "sonner";
import { resetPassword } from "@/server/actions/reset-password";
import { resetPasswordSchema } from "@/types/reset-schema";

type ChangePasswordProps = {
  email: string | null | undefined;
};

const ChangePassword = ({ email }: ChangePasswordProps) => {
  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email ? email : "",
    },
  });

  const { execute, status, result } = useAction(resetPassword, {
    onSuccess: ({ data }) => {
      if (data?.error) {
        toast.error(data?.error);
      }
      if (data?.success) {
        toast.success(data?.success, {
          action: {
            label: "Open Gmail",
            onClick: () => {
              window.open("https://mail.google.com", "_blank");
            },
          },
        });
      }
    },
  });

  const onSubmit = (values: z.infer<typeof resetPasswordSchema>) => {
    const { email } = values;
    execute({ email });
  };
  return (
    <SettingCard>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold tracking-tight mb-2">Change Password</h3>
          <p className="text-sm text-muted-foreground">You can change a new password for your account.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Button
              type="submit"
              className={cn(
                "w-full bg-primary",
                status === "executing" && "animate-pulse"
              )}
              disabled={status === "executing"}
            >
              <KeyRound className="w-5 h-5" />
            </Button>
          </form>
        </Form>
      </div>
    </SettingCard>
  );
};

export default ChangePassword;
