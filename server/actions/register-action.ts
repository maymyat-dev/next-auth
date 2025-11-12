"use server";

import { registerSchema } from "@/types/register-schema";
import { actionClient } from "./safe-action";

import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "@/server";
import { users } from "./../schema";
import { generateEmailVerificationToken } from "./tokens";
import { sendEmail } from "./emails";

export const register = actionClient
  .inputSchema(registerSchema)
  .action(async ({ parsedInput: { name, email, password } }) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      if (!existingUser.password) {
        return {
          error:
            "This email is registered via Google/Github. Please use social login.",
        };
      }

      if (!existingUser.emailVerified) {
        const newToken = await generateEmailVerificationToken(email);

        const displayUsername = name.slice(0, 5);

        await sendEmail(newToken[0].email, newToken[0].token, displayUsername);

        return {
          success:
            "Email verification link has been resent. Please check your inbox.",
        };
      }

      return { error: "User with this email already exists" };
    }

    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

    const newToken = await generateEmailVerificationToken(email);
    await sendEmail(newToken[0].email, newToken[0].token, name.slice(0, 5));

    return {
      success: "Email verification sent. Please check your inbox.",
    };
  });
