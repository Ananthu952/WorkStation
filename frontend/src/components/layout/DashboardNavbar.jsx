import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Wrench, Bell, ChevronDown, Briefcase, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const CLIENT_LINKS = [
  { label: "Dashboard", to: "/client/dashboard" },
  { label: "My Works", to: "/client/my-works" },
  { label: "Marketplace", to: "/marketplace" },
];

const PROVIDER_LINKS = [
  { label: "Browse Jobs", to: "/provider/browse-jobs" },
  { label: "My Bids", to: "/provider/my-bids" },
];

export default function DashboardNavbar() {
  const { user, hasRole, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();
  const isProvider = hasRole("provider");
  const navLinks = isProvider ? [...CLIENT_LINKS, ...PROVIDER_LINKS] : CLIENT_LINKS;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-[1280px] mx-auto flex justify-between items-center px-6 h-20">
        {/* Logo */}
        <NavLink to="/client/dashboard" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">FixHive</span>
        </NavLink>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `font-medium whitespace-nowrap transition-colors ${
                  isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <NavLink
            to={isProvider ? "/provider/dashboard" : "/become-provider"}
            className="hidden sm:flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            <Briefcase className="w-4 h-4" />
            {isProvider ? "Provider Dashboard" : "Become a Provider"}
          </NavLink>

          <NavLink
            to="/notifications"
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
          </NavLink>

          {/* Avatar dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                {initials || <User className="w-4 h-4" />}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
            </button>

            {menuOpen && (
              <>
                {/* Backdrop to close on outside click */}
                <button
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  tabIndex={-1}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900 truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <NavLink
                    to="/client/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    <User className="w-4 h-4 text-gray-400" />
                    Profile
                  </NavLink>
                  <NavLink
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4 text-gray-400" />
                    Settings
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
