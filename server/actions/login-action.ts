"use server";
import { loginSchema } from "@/types/login-schema";
import { actionClient } from "./safe-action";
import { db } from "@/server"
import { users } from "../schema";
import { eq } from "drizzle-orm";
import { generateEmailVerificationToken } from "./tokens";
import { sendEmail } from "./emails";
import { signIn } from "../auth";
import { AuthError } from "next-auth";

export const login = actionClient
  .inputSchema(loginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
      if (existingUser?.email !== email) {
        return {
          error: "Please check your valid credentials",
        };
      }

      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(
          existingUser.email
        );
        await sendEmail(
          verificationToken[0].email,
          verificationToken[0].token,
          existingUser.name!?.slice(0, 5)
        );
        return {
          success: "Email verification resent.",
        };
      }
      await signIn("credentials", { email, password, redirectTo: "/" });

      return { success: "Login successful" };
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Please provide valid credentials" };
          case "OAuthSignInError":
            return { error: "error.message" };
        }
      }
      throw error;
    }
  });
