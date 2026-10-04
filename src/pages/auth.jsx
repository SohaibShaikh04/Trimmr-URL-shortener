import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { BeatLoader } from "react-spinners";
import { Link2 } from "lucide-react";
import { login } from "@/db/apiAuth";
import { signup } from "@/db/apiAuth";
import useFetch from "@/hooks/use-fetch";
import { UrlState } from "@/context";

function AuthPage() {
  const [tab, setTab] = useState("login");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading: ctxLoading, fetchUser } = UrlState();
  const longLink = searchParams.get("createNew");

  useEffect(() => {
    if (isAuthenticated && !ctxLoading) {
      navigate(`/dashboard${longLink ? `?createNew=${longLink}` : ""}`);
    }
  }, [isAuthenticated, ctxLoading]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      {/* Brand */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "4px 4px 10px rgba(61,110,246,0.4)",
            }}
          >
            <Link2 size={20} color="#fff" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--primary)", letterSpacing: -0.5 }}>
            Trimmr
          </h1>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Physical minimalism for digital links.</p>
      </div>

      {/* Card */}
      <div className="neu-card" style={{ width: "100%", maxWidth: 420, padding: 32 }}>
        {/* Tab Switcher */}
        <div
          className="neu-inset"
          style={{ display: "flex", padding: 4, borderRadius: 12, marginBottom: 28 }}
        >
          {["login", "signup"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: "10px 0",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 10,
                transition: "all 0.2s",
                background: tab === t ? "var(--bg)" : "transparent",
                color: tab === t ? "var(--primary)" : "var(--text-secondary)",
                boxShadow: tab === t
                  ? "4px 4px 10px var(--shadow-dark), -4px -4px 10px var(--shadow-light)"
                  : "none",
              }}
            >
              {t === "login" ? "Login" : "Sign Up"}
            </button>
          ))}
        </div>

        {tab === "login" ? (
          <LoginForm longLink={longLink} onSuccess={() => { fetchUser(); navigate(`/dashboard${longLink ? `?createNew=${longLink}` : ""}`); }} />
        ) : (
          <SignupForm longLink={longLink} onSuccess={() => { fetchUser(); navigate(`/dashboard${longLink ? `?createNew=${longLink}` : ""}`); }} />
        )}
      </div>
    </div>
  );
}

function LoginForm({ longLink, onSuccess }) {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { loading, error, fn: fnLogin, data } = useFetch(login, formData);

  useEffect(() => {
    if (error === null && data) onSuccess();
  }, [error, data]);

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    setErrors({});
    try {
      await Yup.object({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
      }).validate(formData, { abortEarly: false });
      await fnLogin();
    } catch (e) {
      const errs = {};
      e?.inner?.forEach((err) => { errs[err.path] = err.message; });
      setErrors(errs);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <FieldGroup label="Email Address" error={errors.email}>
        <input className="neu-input" name="email" type="email" placeholder="you@company.com" onChange={handleChange} />
      </FieldGroup>
      <FieldGroup label="Password" error={errors.password}>
        <input className="neu-input" name="password" type="password" placeholder="••••••••" onChange={handleChange} />
      </FieldGroup>
      {error && <p style={{ color: "var(--danger)", fontSize: 13 }}>{error.message}</p>}
      <button
        className="neu-btn-primary"
        onClick={handleSubmit}
        disabled={loading}
        style={{ width: "100%", padding: "14px", marginTop: 4 }}
      >
        {loading ? <BeatLoader size={8} color="#fff" /> : "Login"}
      </button>
    </div>
  );
}

function SignupForm({ longLink, onSuccess }) {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ name: "", email: "", password: "", profile_pic: null });
  const { loading, error, fn: fnSignup, data } = useFetch(signup, formData);

  useEffect(() => {
    if (error === null && data) onSuccess();
  }, [error, loading]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((p) => ({ ...p, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async () => {
    setErrors({});
    try {
      await Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().min(6, "At least 6 characters").required("Password is required"),
      }).validate(formData, { abortEarly: false });
      await fnSignup();
    } catch (e) {
      const errs = {};
      e?.inner?.forEach((err) => { errs[err.path] = err.message; });
      setErrors(errs);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <FieldGroup label="Full Name" error={errors.name}>
        <input className="neu-input" name="name" type="text" placeholder="John Doe" onChange={handleChange} />
      </FieldGroup>
      <FieldGroup label="Email Address" error={errors.email}>
        <input className="neu-input" name="email" type="email" placeholder="you@company.com" onChange={handleChange} />
      </FieldGroup>
      <FieldGroup label="Password" error={errors.password}>
        <input className="neu-input" name="password" type="password" placeholder="••••••••" onChange={handleChange} />
      </FieldGroup>
      <FieldGroup label="Profile Picture (optional)">
        <input
          name="profile_pic"
          type="file"
          accept="image/*"
          onChange={handleChange}
          style={{ fontSize: 13, color: "var(--text-secondary)" }}
        />
      </FieldGroup>
      {error && <p style={{ color: "var(--danger)", fontSize: 13 }}>{error.message}</p>}
      <button
        className="neu-btn-primary"
        onClick={handleSubmit}
        disabled={loading}
        style={{ width: "100%", padding: "14px", marginTop: 4 }}
      >
        {loading ? <BeatLoader size={8} color="#fff" /> : "Create Account"}
      </button>
    </div>
  );
}

function FieldGroup({ label, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{label}</label>
      {children}
      {error && <span style={{ fontSize: 12, color: "var(--danger)" }}>{error}</span>}
    </div>
  );
}

export default AuthPage;
