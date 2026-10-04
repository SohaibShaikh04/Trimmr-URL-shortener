import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Key, 
  Copy, 
  Check, 
  LogOut, 
  Sparkles,
  Palette
} from "lucide-react";
import { UrlState } from "@/context";
import { getAuthToken } from "@/db/apiClient";
import { logout } from "@/db/apiAuth";
import useFetch from "@/hooks/use-fetch";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, fetchUser, theme, toggleTheme } = UrlState();
  const { fn: fnLogout } = useFetch(logout);
  const [copiedToken, setCopiedToken] = useState(false);

  const token = getAuthToken() || "";
  const maskedToken = token ? `${token.substring(0, 16)}...${token.substring(token.length - 12)}` : "No active session token";

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const handleLogout = async () => {
    await fnLogout();
    fetchUser();
    navigate("/auth");
  };

  const initials = user?.user_metadata?.name
    ? user.user_metadata.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "LX";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 840 }}>
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>
          Platform Settings
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          Manage your account profile, theme preferences, and developer access credentials.
        </p>
      </div>

      {/* Profile Section */}
      <div className="neu-card" style={{ padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: "rgba(61, 110, 246, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={18} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>User Profile</h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
          {user?.user_metadata?.profile_pic ? (
            <img
              src={user.user_metadata.profile_pic}
              alt="Avatar"
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                objectFit: "cover",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                border: "2px solid var(--primary)",
              }}
            />
          ) : (
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--primary)",
                color: "#fff",
                fontSize: 22,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(61,110,246,0.35)",
              }}
            >
              {initials}
            </div>
          )}

          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>
              {user?.user_metadata?.name || "Anonymous User"}
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
              {user?.email || "No email on record"}
            </div>
            <div
              style={{
                display: "inline-block",
                marginTop: 6,
                fontSize: 11,
                padding: "2px 10px",
                borderRadius: 20,
                background: "rgba(61, 110, 246, 0.12)",
                color: "var(--primary)",
                fontWeight: 600,
              }}
            >
              User ID: {user?.id?.slice(0, 8)}...
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
              Full Name
            </label>
            <input
              readOnly
              className="neu-input"
              value={user?.user_metadata?.name || ""}
              style={{ opacity: 0.85, cursor: "not-allowed" }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
              Registered Email
            </label>
            <input
              readOnly
              className="neu-input"
              value={user?.email || ""}
              style={{ opacity: 0.85, cursor: "not-allowed" }}
            />
          </div>
        </div>
      </div>

      {/* Theme & Appearance Section */}
      <div className="neu-card" style={{ padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: "rgba(139, 92, 246, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Palette size={18} color="#8b5cf6" />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>Theme & Appearance</h2>
        </div>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20 }}>
          Choose your interface aesthetic. The authentic dark palette uses rich midnight slate and elevated contours (never pitch black).
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Light Mode Option */}
          <div
            className="neu-card-sm"
            onClick={() => theme !== "light" && toggleTheme()}
            style={{
              padding: 20,
              cursor: "pointer",
              border: theme === "light" ? "2px solid var(--primary)" : "1px solid var(--border-subtle)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              background: theme === "light" ? "rgba(61, 110, 246, 0.05)" : "var(--surface)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Sun size={20} color="#f59e0b" />
                <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>Light Mode</span>
              </div>
              {theme === "light" && (
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Check size={12} color="#fff" />
                </div>
              )}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4 }}>
              Soft light-gray tactile surface with gentle neumorphic ambient shadows.
            </div>
          </div>

          {/* Dark Mode Option */}
          <div
            className="neu-card-sm"
            onClick={() => theme !== "dark" && toggleTheme()}
            style={{
              padding: 20,
              cursor: "pointer",
              border: theme === "dark" ? "2px solid var(--primary)" : "1px solid var(--border-subtle)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              background: theme === "dark" ? "rgba(77, 124, 246, 0.12)" : "var(--surface)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Moon size={20} color="var(--primary)" />
                <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>Dark Mode</span>
              </div>
              {theme === "dark" && (
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Check size={12} color="#fff" />
                </div>
              )}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4 }}>
              Midnight slate & navy tone palette with subtle contour highlight rims.
            </div>
          </div>
        </div>
      </div>

      {/* Security & API Session */}
      <div className="neu-card" style={{ padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: "rgba(16, 185, 129, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShieldCheck size={18} color="#10b981" />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>Session & API Access</h2>
        </div>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20 }}>
          Your current session is authenticated via stateless JWT tokens with SHA-256 signature verification.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>
            Current Bearer Token
          </label>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div
              className="neu-inset"
              style={{
                flex: 1,
                padding: "10px 14px",
                fontSize: 13,
                fontFamily: "monospace",
                color: "var(--text-primary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {maskedToken}
            </div>
            <button
              onClick={handleCopyToken}
              className="neu-card-sm"
              style={{
                padding: "10px 16px",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                fontWeight: 600,
                color: copiedToken ? "var(--success)" : "var(--primary)",
                border: "none",
                cursor: "pointer",
              }}
            >
              {copiedToken ? <Check size={15} /> : <Copy size={15} />}
              {copiedToken ? "Copied" : "Copy Token"}
            </button>
          </div>
        </div>
      </div>

      {/* Account Actions / Logout */}
      <div className="neu-card" style={{ padding: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>Session Termination</div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
            Safely invalidate your current client credentials and log out of the workspace.
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="neu-card-sm"
          style={{
            padding: "10px 20px",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            fontWeight: 700,
            color: "var(--danger)",
            border: "none",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
