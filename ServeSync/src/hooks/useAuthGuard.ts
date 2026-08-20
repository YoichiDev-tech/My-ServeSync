// Redirects user to /login if not authenticated

import { useEffect } from "react";

import { supabaseClient } from "../utils/supabaseClient";

export default function useAuthGuard() {
  useEffect(() => {
    async function check() {
      const { data } = await supabaseClient.auth.getSession();
      // If no session, redirect to login
      if (!data.session) {
        window.location.href = "/login";
      }
    }

    check();
  }, []);
}