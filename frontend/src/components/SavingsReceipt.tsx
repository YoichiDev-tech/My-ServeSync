import serveSync from "../data/serveSync";

export default function SavingsReceipt() {
  const pillars = serveSync.pillars;

  return (
    <div className="receipt w-full max-w-sm mx-auto px-6 pt-8 pb-6 font-mono text-espresso rotate-[-1deg]">
      <div className="text-center">
        <p className="uppercase tracking-[0.3em] text-xs text-muted">
          ServeSync
        </p>
        <p className="text-xs text-muted mt-1">Weekly Savings Ticket</p>
      </div>

      <div className="receipt-dash mt-4 pt-4 flex flex-col gap-3 text-sm">
        {pillars.map((p) => (
          <div key={p.id} className="flex justify-between gap-4">
            <span className="text-espresso/80">{p.label}</span>
            <span className="font-semibold text-ember-dark">{p.stat}</span>
          </div>
        ))}
      </div>

      <div className="receipt-dash mt-4 pt-4 flex justify-between items-baseline">
        <span className="text-sm font-semibold uppercase tracking-wide">
          Total back to you
        </span>
        <span className="text-lg font-bold text-sage">weekly</span>
      </div>

      <p className="text-center text-[11px] text-muted mt-6">
        * Thank you for automating with ServeSync
      </p>
    </div>
  );
}