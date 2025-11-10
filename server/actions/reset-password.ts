"use server"

import { resetPasswordSchema } from "@/types/reset-schema"
import { actionClient } from "./safe-action"
import { db } from "@/server"
import { eq } from "drizzle-orm"
import { users } from "../schema"
import { generatePasswordResetToken } from "./tokens"
import { sendPasswordResetEmail } from "./emails"

export const resetPassword = actionClient
    .inputSchema(resetPasswordSchema)
    .action(async ({ parsedInput: { email } }) => {
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        });


        if (!existingUser) {
            return { error: "User not found" }
        }

        const passwordResetToken = await generatePasswordResetToken(email);

        if (!passwordResetToken) {
            return { error: "Failed to generate password reset token" }
        }

        await sendPasswordResetEmail(
            passwordResetToken[0].email,
            passwordResetToken[0].token
        );

        return { success: "Password reset email sent" }

        
    })
