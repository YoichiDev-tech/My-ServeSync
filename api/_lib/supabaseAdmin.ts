import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * Returns a memoized Supabase client authenticated with the service-role
 * key. This client bypasses Row Level Security, so it must only ever be
 * used from trusted server code (API routes), never sent to the browser
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set."
    );
  }

  cached = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return cached;
}

/**
 * Resolves the authenticated user from a request's Authorization header.
 * Expects `Authorization: Bearer <supabase access token>`. Returns null if
 * the header is missing or the token doesn't resolve to a valid user
 */
export async function getUserFromAuthHeader(
  authHeader: string | undefined
): Promise<{ id: string; email: string | null } | null> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) return null;

  const admin = getSupabaseAdmin();
  const { data, error } = await admin.auth.getUser(token);

  if (error || !data.user) return null;

  return { id: data.user.id, email: data.user.email ?? null };
}