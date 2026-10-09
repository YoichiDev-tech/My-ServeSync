import { useEffect, useState, type FormEvent } from "react";
import { supabaseClient } from "../../utils/supabaseClient";

type StaffMember = {
  id: string;
  name: string;
  role: string;
  hourly_rate: number;
  max_weekly_hours: number;
  contact_email: string | null;
  contact_phone: string | null;
  status: string;
};

type StaffForm = {
  name: string;
  role: string;
  hourly_rate: string;
  max_weekly_hours: string;
  contact_email: string;
  contact_phone: string;
};

const EMPTY_FORM: StaffForm = {
  name: "",
  role: "",
  hourly_rate: "15",
  max_weekly_hours: "40",
  contact_email: "",
  contact_phone: "",
};

export default function Staff() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [form, setForm] = useState<StaffForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function getAccessToken(): Promise<string | null> {
    const { data } = await supabaseClient.auth.getSession();
    return data.session?.access_token ?? null;
  }

  async function loadStaff() {
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Your session has expired. Please sign in again.");
      const response = await fetch("/api/staff-list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Could not load staff.");
      setStaff(data.staff ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load staff.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadStaff();
  }, []);

  function updateField(field: keyof StaffForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function addStaffMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    setError("");
    setSaving(true);

    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Your session has expired. Please sign in again.");
      const response = await fetch("/api/staff-create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          role: form.role.trim(),
          hourly_rate: Number(form.hourly_rate),
          max_weekly_hours: Number(form.max_weekly_hours),
          contact_email: form.contact_email.trim() || undefined,
          contact_phone: form.contact_phone.trim() || undefined,
          status: "active",
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Could not add staff member.");
      setForm(EMPTY_FORM);
      setNotice("Staff member added. Their availability can now be entered under Scheduling.");
      await loadStaff();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add staff member.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-8 text-espresso">
      <header>
        <h1 className="text-4xl font-semibold">Staff</h1>
        <p className="mt-2 text-espresso/70">
          Manage the team details ServeSync uses for scheduling and shift notifications.
        </p>
      </header>

      {notice && <p role="status" className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
      {error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <section className="rounded-xl border border-espresso/10 bg-paper p-6">
        <h2 className="text-2xl font-semibold">Add team member</h2>
        <p className="mt-1 text-sm text-espresso/70">
          Add an employee once, then record their availability on the Scheduling page.
          An email address is needed for schedule publication notifications.
        </p>

        <form onSubmit={addStaffMember} className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Full name
            <input required maxLength={100} value={form.name} onChange={(event) => updateField("name", event.target.value)} className="rounded-md border border-espresso/20 bg-cream p-3" />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Role
            <input required maxLength={100} value={form.role} onChange={(event) => updateField("role", event.target.value)} placeholder="e.g. Server, Chef, Barista" className="rounded-md border border-espresso/20 bg-cream p-3" />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Hourly rate
            <input type="number" min="0" max="9999" step="0.01" required value={form.hourly_rate} onChange={(event) => updateField("hourly_rate", event.target.value)} className="rounded-md border border-espresso/20 bg-cream p-3" />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Maximum weekly hours
            <input type="number" min="0" max="168" step="1" required value={form.max_weekly_hours} onChange={(event) => updateField("max_weekly_hours", event.target.value)} className="rounded-md border border-espresso/20 bg-cream p-3" />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Email for schedule notifications
            <input type="email" maxLength={254} value={form.contact_email} onChange={(event) => updateField("contact_email", event.target.value)} placeholder="name@example.com" className="rounded-md border border-espresso/20 bg-cream p-3" />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            Phone (optional)
            <input type="tel" maxLength={50} value={form.contact_phone} onChange={(event) => updateField("contact_phone", event.target.value)} className="rounded-md border border-espresso/20 bg-cream p-3" />
          </label>
          <button type="submit" disabled={saving} className="w-fit rounded-md bg-ember px-6 py-3 font-semibold text-cream transition hover:bg-ember-dark disabled:opacity-60 sm:col-span-2">
            {saving ? "Saving…" : "Add staff member"}
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-espresso/10 bg-paper p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold">Team members</h2>
          <button type="button" onClick={() => void loadStaff()} className="rounded-md border border-espresso/20 px-4 py-2 text-sm font-semibold hover:border-ember">Refresh</button>
        </div>
        {loading ? (
          <p className="mt-5 text-sm text-espresso/70">Loading team…</p>
        ) : staff.length === 0 ? (
          <p className="mt-5 text-sm text-espresso/70">No team members yet. Add your first employee above.</p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-espresso/10 text-espresso/60">
                  <th className="py-3 pr-4 font-medium">Name</th>
                  <th className="py-3 pr-4 font-medium">Role</th>
                  <th className="py-3 pr-4 font-medium">Weekly limit</th>
                  <th className="py-3 pr-4 font-medium">Notifications</th>
                  <th className="py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member.id} className="border-b border-espresso/5 last:border-0">
                    <td className="py-3 pr-4 font-medium">{member.name}</td>
                    <td className="py-3 pr-4">{member.role}</td>
                    <td className="py-3 pr-4">{member.max_weekly_hours} hours</td>
                    <td className="py-3 pr-4">{member.contact_email || "Email not set"}</td>
                    <td className="py-3">{member.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
