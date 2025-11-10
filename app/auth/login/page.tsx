"use client";
import AuthForm from "@/components/auth/auth-form";
import React from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { loginSchema } from "@/types/login-schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { login } from "@/server/actions/login-action";
import { toast } from "sonner";

const Login = () => {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  const { execute, status, result } = useAction(login, {
    onSuccess: ({ data }) => {
      form.reset();
      if (data?.error) {
        toast.error(data?.error)
      }
      if (data?.success) {
        toast.success(data?.success);
      }
      form.reset();
    }
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    const { email, password } = values;
    execute({ email, password });
  }
  return (
    <AuthForm
      formTitle="Login to your account"
      showProvider={true}
      footerLabel="Don't have an account?"
      footerHref="/auth/register"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
          <FormField name="email" control={form.control} render={({field}) => (<FormItem>
            <FormLabel>
              Email
            </FormLabel>
            <FormControl>
              <Input placeholder="user@gmail.com" {...field} />
            </FormControl>
            <FormMessage/>
          </FormItem>)} />
          <FormField name="password" control={form.control} render={({field}) => (<FormItem>
            <FormLabel className="pt-5">
              Password
            </FormLabel>
            <FormControl>
              <Input type="password" placeholder="********" {...field} />
            </FormControl>
            <FormMessage/>
          </FormItem>)} />
          <div className="flex justify-end mt-2">
                <Link
                  href="/auth/reset"
                  className="text-sm font-medium text-indigo-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
        </div>
        <Button className={cn("w-full bg-primary mt-5", status ==="executing" && "animate-pulse")} disabled={status === "executing"}>Login</Button>
        </form>
     </Form>
    </AuthForm>
  );
};

export default Login;
