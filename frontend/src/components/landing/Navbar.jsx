import { useState, useEffect } from "react";
import { Wrench, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Categories", href: "#categories" },
    { label: "Testimonials", href: "#testimonials" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-shadow duration-300 bg-white/80 backdrop-blur-xl ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-[1280px] mx-auto flex justify-between items-center px-6 h-20">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">FixHive</span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
  to="/login"
  className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
>
  Log In
</Link>

<Link
  to="/register"
  className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
>
  Get Started
</Link>
        </div>

        <button
          className="md:hidden text-gray-700"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-gray-600 font-medium"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <hr className="border-gray-100" />
          <Link
  to="/login"
  onClick={() => setMobileOpen(false)}
  className="text-gray-700 font-medium"
>
  Log In
</Link>

<Link
  to="/register"
  onClick={() => setMobileOpen(false)}
  className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium text-center"
>
  Get Started
</Link>
        </div>
      )}
    </nav>
  );
}
