import { useEffect, useState } from "react";
import { supabaseClient } from "../../utils/supabaseClient";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

type GeneratedSchedule = {
  id: string;
  week_start_date: string;
  schedule: unknown;
  status: "draft" | "published" | string;
  created_at: string;
};

function getCurrentMonday(): string {
  const date = new Date();
  const day = date.getDay();
  date.setDate(date.getDate() - ((day + 6) % 7));
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function Scheduling() {
  const [weekStartDate, setWeekStartDate] = useState(getCurrentMonday);
  const [selectedDays, setSelectedDays] = useState<string[]>(["monday", "tuesday", "wednesday", "thursday", "friday"]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [schedules, setSchedules] = useState<GeneratedSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function getAccessToken(): Promise<string | null> {
    const { data } = await supabaseClient.auth.getSession();
    return data.session?.access_token ?? null;
  }

  async function loadSchedules() {
    setLoading(true);
    try {
      const token = await getAccessToken();
      if (!token) {
        setError("Your session has expired. Please sign in again to manage schedules.");
        setSchedules([]);
        return;
      }
      const response = await fetch("/api/schedule-list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Could not load schedules.");
      setSchedules(data.schedules ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load schedules.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSchedules();
  }, []);

  function toggleDay(day: string) {
    setSelectedDays((current) =>
      current.includes(day) ? current.filter((item) => item !== day) : [...current, day]
    );
  }

  async function submitAvailability(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    setError("");

    if (selectedDays.length === 0) {
      setError("Choose at least one day when you are available.");
      return;
    }
    if (startTime >= endTime) {
      setError("The end time must be later than the start time.");
      return;
    }

    setSubmitting(true);
    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Your session has expired. Please sign in again.");
      const response = await fetch("/api/schedule-availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          week_start_date: weekStartDate,
          availability: selectedDays.map((day) => ({
            day,
            start: startTime,
            end: endTime,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Could not submit availability.");
      setNotice(data.message || "Availability submitted.");
      await loadSchedules();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit availability.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-8 text-espresso">
      <header>
        <h1 className="text-4xl font-semibold">Scheduling</h1>
        <p className="mt-2 text-espresso/70">
          Collect availability and send it to ServeSync's scheduling automation.
          Generated schedules appear here for manager review.
        </p>
      </header>

      <section className="rounded-xl border border-espresso/10 bg-paper p-6">
        <h2 className="text-2xl font-semibold">Submit weekly availability</h2>
        <p className="mt-1 text-sm text-espresso/70">
          Choose the week and the days/times the team is available. The connected Power Automate flow
          uses these details to generate a draft schedule.
        </p>

        <form onSubmit={submitAvailability} className="mt-6 flex flex-col gap-5">
          <label className="flex max-w-xs flex-col gap-2 text-sm font-medium">
            Week starting (Monday)
            <input
              type="date"
              required
              value={weekStartDate}
              onChange={(event) => setWeekStartDate(event.target.value)}
              className="rounded-md border border-espresso/20 bg-cream p-3"
            />
          </label>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-2 text-sm font-medium">Available days</legend>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {DAYS.map((day) => {
                const value = day.toLowerCase();
                return (
                  <label key={value} className="flex items-center gap-2 rounded-md border border-espresso/10 p-3">
                    <input
                      type="checkbox"
                      checked={selectedDays.includes(value)}
                      onChange={() => toggleDay(value)}
                    />
                    <span>{day}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="grid max-w-md grid-cols-2 gap-4">
            <label className="flex flex-col gap-2 text-sm font-medium">
              Available from
              <input
                type="time"
                required
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                className="rounded-md border border-espresso/20 bg-cream p-3"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium">
              Available until
              <input
                type="time"
                required
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                className="rounded-md border border-espresso/20 bg-cream p-3"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-fit rounded-md bg-ember px-6 py-3 font-semibold text-cream transition hover:bg-ember-dark disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit availability"}
          </button>
        </form>

        {notice && <p role="status" className="mt-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
        {error && <p role="alert" className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      </section>

      <section className="rounded-xl border border-espresso/10 bg-paper p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold">Generated schedules</h2>
            <p className="mt-1 text-sm text-espresso/70">Review the latest schedules returned by the automation flow.</p>
          </div>
          <button
            type="button"
            onClick={() => void loadSchedules()}
            className="rounded-md border border-espresso/20 px-4 py-2 text-sm font-semibold hover:border-ember"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="mt-5 text-sm text-espresso/70">Loading schedules…</p>
        ) : schedules.length === 0 ? (
          <p className="mt-5 text-sm text-espresso/70">No generated schedules yet. Submit availability to get started.</p>
        ) : (
          <div className="mt-5 flex flex-col gap-4">
            {schedules.map((item) => (
              <article key={item.id} className="rounded-lg border border-espresso/10 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold">Week of {item.week_start_date}</h3>
                  <span className="rounded-full bg-ember/10 px-3 py-1 text-xs font-semibold uppercase">{item.status}</span>
                </div>
                <pre className="mt-3 overflow-x-auto rounded-md bg-cream p-4 text-xs leading-5">
                  {JSON.stringify(item.schedule, null, 2)}
                </pre>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
