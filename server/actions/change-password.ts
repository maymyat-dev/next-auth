"use server"

import { changePasswordSchema } from "@/types/change-password-schema"
import { actionClient } from "./safe-action"
import { db } from ".."
import { resetPasswordVerificationToken, users } from "../schema"
import { eq } from "drizzle-orm"
import { checkPasswordResetTokenByToken } from "./tokens"
import bcrypt from "bcrypt"
import { Pool } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"


export const changePassword = actionClient
    .inputSchema(changePasswordSchema)
    .action(async ({ parsedInput: { password, token } }) => {
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL
        })

        const dbPool = drizzle(pool);

        if (!token) {
        return { error: "Token not found" } 
        }

        const existingToken = await checkPasswordResetTokenByToken(token);
        
        if (!existingToken) {
            return { error: "Token not found" }
        }

        const isExpired = new Date() > new Date(existingToken.expires);

        if (isExpired) {
            return { error: "Token expired, please request a new one" }
        }

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, existingToken.email)
        });

        if (!existingUser) {
            return { error: "User not found" }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await dbPool.transaction(async (context) => {
            await context.update(users).set({
                password: hashedPassword
            })
                .where(eq(users.id, existingUser.id));
            await context.delete(resetPasswordVerificationToken).where(eq(resetPasswordVerificationToken.id, existingToken.id));
        })

        return { success: "Password changed successfully" }

        

    })