const links = ["Solutions", "Features", "Pricing", "FAQ"];

export default function Navbar() {
  return (
    <nav className="hidden md:block w-full bg-cream/90 backdrop-blur border-b border-espresso/10 py-4 px-6 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <span className="font-display text-2xl font-semibold text-espresso">
          ServeSync
        </span>

        <ul className="flex gap-8 text-espresso/80 font-medium font-body">
          {links.map((link) => (
            <li key={link}>
              <a
                href={`#${link.toLowerCase()}`}
                className="hover:text-ember transition"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#cta"
          className="bg-ember text-cream font-semibold px-5 py-2.5 rounded-md hover:bg-ember-dark transition"
        >
          Start free trial
        </a>
      </div>
    </nav>
  );
}