export default function Navbar() {
  return (
    <nav className="w-full bg-brandBrown text-white py-4 px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">ServeSync</h1>

        <ul className="flex gap-6 text-brandBlue/90 font-medium">
          <li className="hover:text-brandBlue transition cursor-pointer">
            Home
          </li>
          <li className="hover:text-brandBlue transition cursor-pointer">
            Features
          </li>
          <li className="hover:text-brandBlue transition cursor-pointer">
            Why ServeSync
          </li>
          <li className="hover:text-brandBlue transition cursor-pointer">
            Contact
          </li>
        </ul>
      </div>
    </nav>
  );
}