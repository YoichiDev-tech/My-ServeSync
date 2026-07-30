import { useState } from "react";

const links = ["Solutions", "Features", "Pricing", "FAQ"];

export default function MobileNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-cream border-b border-espresso/10 py-4 px-6 md:hidden sticky top-0 z-40">
      <div className="flex justify-between items-center">
        <span className="font-display text-xl font-semibold text-espresso">
          ServeSync
        </span>

        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="text-espresso text-3xl font-bold leading-none"
        >
          {open ? "×" : "≡"}
        </button>
      </div>

      {open && (
        <div className="mt-4 flex flex-col gap-4 text-espresso/90 font-body">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="py-1"
            >
              {link}
            </a>
          ))}
          <a
            href="#cta"
            onClick={() => setOpen(false)}
            className="bg-ember text-cream font-semibold px-5 py-3 rounded-md text-center"
          >
            Start free trial
          </a>
        </div>
      )}
    </nav>
  );
}