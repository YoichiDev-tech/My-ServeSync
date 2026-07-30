interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  tight?: boolean;
  id?: string;
}

export default function SectionWrapper({
  children,
  className = "",
  tight = false,
  id,
}: SectionWrapperProps) {
  return (
    <section id={id} className={`w-full py-20 px-6 font-body ${className}`}>
      <div
        className={`mx-auto flex flex-col gap-6 ${
          tight ? "max-w-3xl" : "max-w-6xl"
        }`}
      >
        {children}
      </div>
    </section>
  );
}