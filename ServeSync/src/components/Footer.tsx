import { Link } from "react-router-dom";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Solutions", href: "/#solutions" },
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/#pricing" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/#contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-espresso text-cream/90 py-14 px-6 font-body cursor-default">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-10">
        
        {/* Branding */}
        <div className="max-w-xs">
          <h2 className="font-display text-2xl font-semibold text-cream">
            ServeSync - Operated by BrightWave Studio
          </h2>
          <p className="text-cream/60 mt-2 text-sm leading-relaxed">
            The back-office platform for hospitality operators — time, money,
            and waste, under control.
          </p>
        </div>

        {/* Columns */}
        <div className="flex flex-wrap gap-16">
          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-2">
              <span className="font-semibold text-cream text-sm uppercase tracking-wide">
                {col.title}
              </span>
              {col.links.map((link) =>
                link.href.startsWith("/#") ? (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-cream/60 hover:text-ember-light transition text-sm"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-cream/60 hover:text-ember-light transition text-sm"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          ))}
        </div>

        {/* Copyright + Legal */}
        <div className="text-cream/50 text-sm flex flex-col gap-2">
          <span className="font-semibold text-cream/80">© 2026 ServeSync</span>
          <p>All rights reserved.</p>

          {/* Legal links */}
          <div className="flex gap-4 mt-2">
            <Link to="/privacy" className="hover:text-cream transition">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-cream transition">
              Terms
            </Link>
            <Link to="/cookies" className="hover:text-cream transition">
              Cookies
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}