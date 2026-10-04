import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Link2, BarChart2, Settings, LogOut, Sun, Moon } from "lucide-react";
import { UrlState } from "@/context";
import { logout } from "@/db/apiAuth";
import useFetch from "@/hooks/use-fetch";

const navItems = [
  { label: "Home", icon: Home, to: "/dashboard" },
  { label: "My Links", icon: Link2, to: "/dashboard" },
  { label: "Analytics", icon: BarChart2, to: "/analytics" },
  { label: "Settings", icon: Settings, to: "/settings" },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, fetchUser, theme, toggleTheme } = UrlState();
  const { fn: fnLogout } = useFetch(logout);

  const handleLogout = async () => {
    await fnLogout();
    fetchUser();
    navigate("/auth");
  };

  return (
    <aside
      style={{
        width: 240,
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        padding: "24px 16px",
        boxShadow: "4px 0 20px rgba(0, 0, 0, 0.08)",
        borderRight: "1px solid var(--border-subtle)",
        position: "sticky",
        top: 0,
        transition: "background-color 0.25s ease, border-color 0.25s ease",
      }}
    >
      {/* Brand & User Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px 24px" }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 10px rgba(61, 110, 246, 0.4)",
            flexShrink: 0,
          }}
        >
          <Link2 size={18} color="#fff" />
        </div>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: "var(--text-primary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user?.user_metadata?.name || "User"}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1 }}>
            {user?.email || "Personal Workspace"}
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        {navItems.map(({ label, icon: Icon, to }) => {
          const isActive = pathname === to;
          return (
            <Link
              key={label}
              to={to}
              className={`sidebar-link ${isActive ? "active" : ""}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          className="sidebar-link"
          style={{
            background: "none",
            border: "none",
            marginTop: 8,
            color: "var(--danger)",
            cursor: "pointer",
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </nav>

      {/* Dark / Light Mode Toggle Button */}
      <div style={{ paddingTop: 16 }}>
        <button
          onClick={toggleTheme}
          className="neu-card-sm"
          style={{
            width: "100%",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid var(--border-subtle)",
            cursor: "pointer",
            color: "var(--text-primary)",
            background: "var(--surface)",
            borderRadius: 12,
            transition: "all 0.2s ease",
          }}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {theme === "dark" ? (
              <Sun size={17} color="#fbbf24" />
            ) : (
              <Moon size={17} color="var(--primary)" />
            )}
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          </div>

          {/* Toggle pill */}
          <div
            style={{
              width: 34,
              height: 18,
              borderRadius: 10,
              background: theme === "dark" ? "var(--primary)" : "var(--shadow-dark)",
              position: "relative",
              transition: "background 0.2s ease",
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#ffffff",
                position: "absolute",
                top: 3,
                left: theme === "dark" ? 19 : 3,
                transition: "left 0.2s ease",
                boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
