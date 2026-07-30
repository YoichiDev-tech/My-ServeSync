export default function Footer() {
  return (
    <footer className="w-full bg-brandBrown text-white py-10 px-6 mt-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold">ServeSync</h2>
          <p className="text-brandBlue/90 mt-2">
            Your AI back-office co-pilot for hospitality.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-brandBlue/90">
          <span className="font-semibold">Navigation</span>
          <span className="cursor-pointer hover:text-brandBlue transition">
            Home
          </span>
          <span className="cursor-pointer hover:text-brandBlue transition">
            Features
          </span>
          <span className="cursor-pointer hover:text-brandBlue transition">
            Why ServeSync
          </span>
          <span className="cursor-pointer hover:text-brandBlue transition">
            Contact
          </span>
        </div>

        <div className="text-brandBlue/90">
          <span className="font-semibold">© 2026 ServeSync</span>
          <p>All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}