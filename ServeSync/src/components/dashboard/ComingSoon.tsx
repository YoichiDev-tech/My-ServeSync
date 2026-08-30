interface ComingSoonProps {
  title: string;
}

export default function ComingSoon({ title }: ComingSoonProps) {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="font-display text-3xl font-semibold">{title}</h1>
      <div className="border border-espresso/10 rounded-xl p-6 bg-paper max-w-md">
        <p className="text-espresso/70">This module is coming soon.</p>
      </div>
    </div>
  );
}