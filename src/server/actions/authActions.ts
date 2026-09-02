"use server";

import { redirect } from "next/navigation";

import { normalizeEmail } from "@/lib/auth";
import { userRepository } from "@/server/repositories/userRepository";
import { verifyPassword } from "@/server/services/passwordService";
import { createSession, invalidateCurrentSession } from "@/server/services/sessionService";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function loginAction(formData: FormData): Promise<never> {
  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");
  const email = typeof rawEmail === "string" ? normalizeEmail(rawEmail) : "";
  const password = typeof rawPassword === "string" ? rawPassword : "";

  if (!email || !EMAIL_PATTERN.test(email) || !password) {
    redirect("/admin/login?error=invalid");
  }

  const user = await userRepository.findByEmailForAuthentication(email);
  const passwordIsValid = user ? await verifyPassword(user.passwordHash, password) : false;

  if (!user || !user.active || !passwordIsValid) {
    redirect("/admin/login?error=invalid");
  }

  await createSession(user.id);
  redirect("/admin");
}

export async function logoutAction(): Promise<never> {
  await invalidateCurrentSession();
  redirect("/admin/login");
}
