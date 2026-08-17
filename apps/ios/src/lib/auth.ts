import type { EmailOtpType } from "@supabase/supabase-js";

import { supabase } from "./supabase";

const OTP_TYPES: EmailOtpType[] = ["email", "signup", "magiclink"];

export async function signInWithEmail(email: string) {
  return supabase.auth.signInWithOtp({
    email: email.trim(),
    options: {
      shouldCreateUser: true,
    },
  });
}

export async function verifyEmailOtp(email: string, token: string) {
  const cleanedEmail = email.trim();
  const raw = token.trim();
  const fromLink = parseAuthLink(raw);

  if (fromLink) {
    return supabase.auth.verifyOtp({
      token_hash: fromLink.tokenHash,
      type: fromLink.type,
    });
  }

  let lastError: Error | null = null;
  for (const type of OTP_TYPES) {
    const result = await supabase.auth.verifyOtp({
      email: cleanedEmail,
      token: raw,
      type,
    });
    if (!result.error) return result;
    lastError = result.error;
  }

  return { data: { user: null, session: null }, error: lastError };
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) return { session: null, error };
  return { session: data.session, error: null };
}

function parseAuthLink(value: string): { tokenHash: string; type: EmailOtpType } | null {
  const match = value.match(/https?:\/\/\S+/);
  if (!match) return null;
  try {
    const url = new URL(match[0]);
    const tokenHash = url.searchParams.get("token") ?? url.searchParams.get("token_hash");
    const type = (url.searchParams.get("type") as EmailOtpType | null) ?? "signup";
    if (!tokenHash) return null;
    return { tokenHash, type };
  } catch {
    return null;
  }
}
