import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Users, Star, Info, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar({ user, logout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/home", icon: Home, label: "Home" },
    { path: "/community", icon: Users, label: "Community" },
    { path: "/features", icon: Star, label: "Features" },
    { path: "/about", icon: Info, label: "About" },
  ];

  const getUserInitial = () =>
    user?.name ? user.name.charAt(0).toUpperCase() : "U";

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200">

      <div className="max-w-[1200px] mx-auto px-6 h-[60px] flex items-center justify-between">
        
        {/* Brand */}
        <Link to="/home" className="flex items-center gap-2 text-[var(--text)] font-bold text-xl">
          <span className="text-2xl">🏃</span>
          <span>HealthHub</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-1 items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition 
                  ${
                    isActive
                      ? "bg-[rgba(37,99,235,0.1)] text-[var(--primary)] font-semibold"
                      : "text-[var(--text-light)] hover:bg-[var(--bg)] hover:text-[var(--text)]"
                  }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User Menu */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/profile"
            className="flex items-center gap-2 px-2 py-1 rounded-lg transition hover:bg-[var(--bg)]"
          >
            <div className="w-[35px] h-[35px] rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">
              {getUserInitial()}
            </div>
            <span className="text-sm font-medium text-[var(--text)]">
              {user?.name?.split(" ")[0] || "User"}
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-[var(--text-light)] hover:bg-[var(--bg)] hover:text-[var(--text)] transition"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-[var(--text)]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden flex flex-col bg-[var(--card-bg)] border-t border-[var(--border)] p-3">
          
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition 
                  ${
                    isActive
                      ? "bg-[rgba(37,99,235,0.1)] text-[var(--primary)]"
                      : "text-[var(--text)] hover:bg-[var(--bg)]"
                  }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Profile */}
          <Link
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--text)] hover:bg-[var(--bg)]"
          >
            <User size={20} />
            <span>Profile</span>
          </Link>

          {/* Logout */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[var(--text)] hover:bg-red-50 hover:text-red-500"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
