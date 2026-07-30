import { useState } from "react";

export default function MobileNavbar() {
  // State for mobile menu open/close
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-brandBrown text-white py-4 px-6 md:hidden">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">ServeSync</h1>

        {/* Hamburger button */}
        <button
          onClick={() => setOpen(!open)}
          className="text-white text-3xl font-bold"
        >
          {open ? "×" : "≡"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="mt-4 flex flex-col gap-4 text-brandBlue/90">
          <span className="cursor-pointer">Home</span>
          <span className="cursor-pointer">Features</span>
          <span className="cursor-pointer">Why ServeSync</span>
          <span className="cursor-pointer">Pricing</span>
          <span className="cursor-pointer">Contact</span>
        </div>
      )}
    </nav>
  );
}