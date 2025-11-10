"use client";
import AuthForm from "@/components/auth/auth-form";
import React from "react";
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
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { changePasswordSchema } from "@/types/change-password-schema";
import { changePassword } from "@/server/actions/change-password";
import { useSearchParams } from "next/navigation";

const ChangePassword = () => {
  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
        password: "",
    },
  });
    
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

  const { execute, status, result } = useAction(changePassword, {
    onSuccess: ({ data }) => {
      form.reset();
      if (data?.error) {
        toast.error(data?.error);
      }
      if (data?.success) {
        toast.success(data?.success);
      }
      form.reset();
    },
  });

  const onSubmit = (values: z.infer<typeof changePasswordSchema>) => {
    const { password } = values;
    execute({ password, token });
  };
  return (
    <AuthForm
      formTitle="Change your password"
      showProvider={false}
      footerLabel="Already have an account"
      footerHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="pt-4">New Password</FormLabel>
                  <FormControl>
                    <Input placeholder="user@gmail.com" {...field} type="password" disabled={status === "executing"} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
                      />
          </div>
          <Button
            type="submit"
            className={cn(
              "w-full bg-primary mt-5",
              status === "executing" && "animate-pulse"
            )}
            disabled={status === "executing"}
          >
            Submit
          </Button>
        </form>
      </Form>
    </AuthForm>
  );
};

export default ChangePassword;
