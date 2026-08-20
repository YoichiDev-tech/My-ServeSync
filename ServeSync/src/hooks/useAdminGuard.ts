import { useEffect } from "react";
import { supabaseClient } from "../utils/supabaseClient";

export default function useAdminGuard() {
  useEffect(() => {
    async function checkAdmin() {
      const { data: sessionData } = await supabaseClient.auth.getSession();
      const session = sessionData.session;

      if (!session) {
        window.location.href = "/login";
        return;
      }

      const userId = session.user.id;

      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (!profile || profile.role !== "admin") {
        window.location.href = "/dashboard";
      }
    }

    checkAdmin();
  }, []);
}