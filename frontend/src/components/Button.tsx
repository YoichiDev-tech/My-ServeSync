interface ButtonProps {
  children: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export default function Button({ children, onClick, variant = "primary" }: ButtonProps) {
  const base =
    "px-6 py-3 rounded-lg font-semibold transition inline-block";

  const styles =
    variant === "primary"
      ? "bg-brandBlue text-brandBrown hover:bg-brandBlue/80"
      : "bg-white text-brandBrown border border-brandBrown hover:bg-brandBrown hover:text-white";

  return (
    <button className={`${base} ${styles}`} onClick={onClick}>
      {children}
    </button>
  );
}