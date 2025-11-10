"use server";

import { registerSchema } from "@/types/register-schema";
import { actionClient } from "./safe-action";

import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "@/server"
import { users } from "./../schema";
import { generateEmailVerificationToken } from "./tokens";
import { sendEmail } from "./emails";

export const register = actionClient
  .inputSchema(registerSchema)
  .action(async ({ parsedInput: { name, email, password } }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword);

    //check user exist
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email);
        await sendEmail(
          verificationToken[0].email,
          verificationToken[0].token,
          name.slice(0, 5)
        );
        return { success: "Email verification sent" };
      }
      return { error: "Email is already exists." };
    }
    // record user
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

    const verificationToken = await generateEmailVerificationToken(email);
    
     await sendEmail(
          verificationToken[0].email,
          verificationToken[0].token,
          name.slice(0, 5)
        );
   
    return { success: "Email verification sent" };
  });
