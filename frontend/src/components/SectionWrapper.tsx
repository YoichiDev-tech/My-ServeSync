interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionWrapper({ children, className = "" }: SectionWrapperProps) {
  return (
    <section className={`w-full py-20 px-6 ${className}`}>
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {children}
      </div>
    </section>
  );
}