"use server";
import EmailConfirmationTemplate from "@/components/email-template";
import resetPasswordEmailTemplate, { ResetPasswordEmailTemplate } from "@/components/password-reset";
import { getBaseUrl } from "@/lib/get-baseUrl";
import { Resend } from "resend";

const currentBaseUrl = getBaseUrl();
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (
  email: string,
  token: string,
  userFirstname: string
) => {
  const confirmLink = `${currentBaseUrl}/confirm-email?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: ["" + email],
    subject: "Confirm your email to complete your registration",
    react: EmailConfirmationTemplate({
      userFirstname,
      confirmEmailLink: confirmLink,
    }),
  });

  if (error) {
    console.log(error);
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
) => {
  const resetLink = `${currentBaseUrl}/auth/change-password?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: ["" + email],
    subject: "Confirm your email to complete your reset password",
    react: resetPasswordEmailTemplate({
      resetPasswordLink: resetLink
    })
  });

  if (error) {
    console.log(error);
  }
};

