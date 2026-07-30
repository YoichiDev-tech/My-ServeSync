import Navbar from "./Navbar";
import MobileNavbar from "./MobileNav";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      {/* Desktop Navbar */}
      <Navbar />

      <MobileNavbar />

      {/* Page content */}
      <main>{children}</main>

      <Footer />
    </>
  );
}