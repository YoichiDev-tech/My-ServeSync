import { useState } from "react";
import { supabaseClient } from "../utils/supabaseClient";

export default function StaffCreation() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [maxWeeklyHours, setMaxWeeklyHours] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async () => {
    if (!name || !role || !hourlyRate || !maxWeeklyHours) {
      setStatus("error");
      return;
    }

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (!user) {
      setStatus("error");
      return;
    }
    const userId = user.id;

    setStatus("sending");

    try {
      const res = await fetch("/api/staff-create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({
          name,
          role,
          hourly_rate: parseFloat(hourlyRate),
          max_weekly_hours: parseFloat(maxWeeklyHours),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("sent");
        setName("");
        setRole("");
        setHourlyRate("");
        setMaxWeeklyHours("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="border border-espresso/10 rounded-xl p-6 bg-paper flex flex-col gap-4">
      <h2 className="font-display text-2xl font-semibold">Add a Staff Member</h2>

      <div className="grid sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Name"
          className="p-3 rounded-md border border-espresso/25 bg-cream text-espresso"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Role"
          className="p-3 rounded-md border border-espresso/25 bg-cream text-espresso"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <input
          type="number"
          placeholder="Hourly Rate"
          className="p-3 rounded-md border border-espresso/25 bg-cream text-espresso"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Weekly Hours"
          className="p-3 rounded-md border border-espresso/25 bg-cream text-espresso"
          value={maxWeeklyHours}
          onChange={(e) => setMaxWeeklyHours(e.target.value)}
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={status === "sending"}
        className="bg-ember text-cream font-semibold px-6 py-3 rounded-md hover:bg-ember-dark transition w-fit disabled:opacity-60"
      >
        {status === "sending" ? "Saving…" : "Save Staff Member"}
      </button>

      {status === "sent" && <p className="text-sage text-sm">Staff member created.</p>}
      {status === "error" && (
        <p className="text-red-600 text-sm">Error creating staff member.</p>
      )}
    </div>
  );
}