import { cookies } from "next/headers";
import crypto from "crypto";
import { requireEnv } from "./env";

const cookieName = "dugak_admin_session";

function sign(value: string) {
  return crypto
    .createHmac("sha256", requireEnv("ADMIN_SESSION_SECRET"))
    .update(value)
    .digest("base64url");
}

export function createSessionValue() {
  const expires = Date.now() + 1000 * 60 * 60 * 8;
  const payload = `admin.${expires}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionValue(value?: string) {
  if (!value) {
    return false;
  }

  const parts = value.split(".");
  if (parts.length !== 3) {
    return false;
  }

  const payload = `${parts[0]}.${parts[1]}`;
  const expected = sign(payload);
  const given = parts[2];

  if (expected.length !== given.length) {
    return false;
  }

  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(given))) {
    return false;
  }

  return Number(parts[1]) > Date.now();
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  return verifySessionValue(store.get(cookieName)?.value);
}

export async function setAdminSession() {
  const store = await cookies();
  store.set(cookieName, createSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(cookieName);
}

export function isValidAdminLogin(username: string, password: string) {
  const validUsername = process.env.ADMIN_USERNAME ?? "admin";
  const validPassword = requireEnv("ADMIN_PASSWORD");
  return username === validUsername && password === validPassword;
}
