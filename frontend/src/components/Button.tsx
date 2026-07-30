interface ButtonProps {
  children: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
}

export default function Button({
  children,
  onClick,
  variant = "primary",
}: ButtonProps) {
  const base =
    "px-6 py-3 rounded-md font-semibold font-body transition inline-block";

  const styles = {
    primary: "bg-ember text-cream hover:bg-ember-dark",
    secondary:
      "bg-transparent text-espresso border border-espresso/30 hover:border-espresso hover:bg-espresso hover:text-cream",
    ghost: "bg-transparent text-cream border border-cream/40 hover:bg-cream/10",
  }[variant];

  return (
    <button className={`${base} ${styles}`} onClick={onClick}>
      {children}
    </button>
  );
}