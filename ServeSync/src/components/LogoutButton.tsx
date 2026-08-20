import { supabaseClient } from "../utils/supabaseClient";

export default function LogoutButton() {
  async function handleLogout() {
    await supabaseClient.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <button
      onClick={handleLogout}
      className="text-ember-dark underline text-sm"
    >
      Logout
    </button>
  );
}