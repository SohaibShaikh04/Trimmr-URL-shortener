import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Link2, 
  Zap, 
  BarChart3, 
  ShieldCheck, 
  QrCode, 
  Globe, 
  ArrowRight, 
  ChevronDown, 
  Sparkles, 
  CheckCircle2, 
  Activity,
  Layers
} from "lucide-react";
import { UrlState } from "@/context";

const faqs = [
  {
    q: "How does Trimmr work?",
    a: "Paste any long web address into our shorten engine. Trimmr instantly allocates a low-collision Base62 code or your chosen custom alias, generates a server-side vector QR code, and caches it in Redis for sub-12ms instant redirection."
  },
  {
    q: "What telemetry and analytics are tracked?",
    a: "Every click asynchronously captures city, country, device category (Mobile, Desktop, Tablet), operating system, and referral headers via background worker queues without adding latency to the visitor."
  },
  {
    q: "Can I use custom branded aliases?",
    a: "Yes! Authenticated users can specify customized slugs (e.g. /my-portfolio) with real-time conflict validation and automatic sanitization against private or malicious IP targets."
  },
  {
    q: "Is Trimmr completely free to use?",
    a: "Yes, you can shorten unlimited URLs, view real-time audience charts, and export custom high-resolution QR codes right away."
  }
];

const LandingPage = () => {
  const [longUrl, setLongUrl] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();
  const { user } = UrlState();

  const handleShorten = (e) => {
    e.preventDefault();
    if (longUrl.trim()) {
      navigate(`/auth?createNew=${encodeURIComponent(longUrl.trim())}`);
    }
  };

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      {/* Top Navbar */}
      <header
        style={{
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "4px 4px 12px rgba(61,110,246,0.35)",
            }}
          >
            <Link2 size={22} color="#fff" />
          </div>
          <div>
            <span style={{ fontSize: 20, fontWeight: 800, color: "var(--primary)", letterSpacing: -0.5 }}>
              Trimmr
            </span>
            <span
              style={{
                marginLeft: 8,
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 20,
                background: "rgba(61,110,246,0.12)",
                color: "var(--primary)",
                textTransform: "uppercase",
              }}
            >
              v2.0
            </span>
          </div>
        </div>

        <nav style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => navigate("/auth")}
            className="neu-card-sm"
            style={{
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text-primary)",
              border: "none",
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="neu-btn-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            Get Started
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1, width: "100%", maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ textAlign: "center", maxWidth: 840, margin: "0 auto" }}>
          {/* Pill Badge */}
          <div
            className="neu-card-sm"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 18px",
              marginBottom: 24,
              fontSize: 13,
              fontWeight: 600,
              color: "var(--primary)",
            }}
          >
            <Sparkles size={15} />
            <span>Physical minimalism for digital links</span>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: "clamp(34px, 5vw, 58px)",
              fontWeight: 900,
              color: "var(--text-primary)",
              lineHeight: 1.15,
              letterSpacing: -1,
              marginBottom: 20,
            }}
          >
            Smarter Links. Instant QR Codes. <br />
            <span style={{ color: "var(--primary)" }}>Real-Time Intelligence.</span>
          </h1>

          <p
            style={{
              fontSize: "clamp(15px, 2vw, 18px)",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              maxWidth: 680,
              margin: "0 auto 36px",
            }}
          >
            Transform unruly URLs into clean, memorable, and high-performance links backed by distributed Redis caching, asynchronous click telemetry, and automated QR generation.
          </p>

          {/* Shortener Input Form */}
          <form
            onSubmit={handleShorten}
            className="neu-card"
            style={{
              padding: 10,
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              alignItems: "center",
              maxWidth: 680,
              margin: "0 auto 16px",
            }}
          >
            <div
              className="neu-inset"
              style={{
                flex: 1,
                minWidth: 260,
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 18px",
                borderRadius: 12,
              }}
            >
              <Globe size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
              <input
                type="url"
                required
                placeholder="Paste your long link here (e.g. https://yourdomain.com/catalog/item)..."
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: 15,
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <button
              type="submit"
              className="neu-btn-primary"
              style={{
                padding: "14px 28px",
                fontSize: 15,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                flexShrink: 0,
              }}
            >
              Shorten Link <Zap size={16} />
            </button>
          </form>

          {/* Trust points */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 20,
              fontSize: 13,
              color: "var(--text-muted)",
              marginBottom: 56,
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <CheckCircle2 size={14} color="var(--primary)" /> Zero latency redirection
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <CheckCircle2 size={14} color="var(--primary)" /> Auto QR code generator
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <CheckCircle2 size={14} color="var(--primary)" /> Free & open metrics
            </span>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
            marginBottom: 64,
          }}
        >
          <div className="neu-card" style={{ padding: "28px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(61,110,246,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Zap size={22} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)" }}>
              Sub-12ms Redirection
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Powered by a distributed Redis Cache-Aside layer with in-memory fallbacks to deliver instant 302 redirections at high scale.
            </p>
          </div>

          <div className="neu-card" style={{ padding: "28px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(124,58,237,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <QrCode size={22} color="#7c3aed" />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)" }}>
              Automated QR Engines
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Each link instantly synthesizes a downloadable dot-matrix QR code rendered server-side for print and mobile distribution.
            </p>
          </div>

          <div className="neu-card" style={{ padding: "28px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(5,150,105,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BarChart3 size={22} color="#059669" />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)" }}>
              Asynchronous Telemetry
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Non-blocking message queues compute visitor countries, browser signatures, and device families without slowing down link redirects.
            </p>
          </div>

          <div className="neu-card" style={{ padding: "28px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(217,119,6,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldCheck size={22} color="#d97706" />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)" }}>
              Enterprise Hardened
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Zero-trust design with SSRF mitigation (blocking private IP ranges), multi-tier rate limiting, bcrypt encryption, and strict schema validation.
            </p>
          </div>
        </div>

        {/* Live Interface Preview Showcase */}
        <div
          className="neu-card"
          style={{
            padding: "40px 32px",
            marginBottom: 64,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "var(--primary)",
              marginBottom: 8,
            }}
          >
            Tactile Neumorphic Experience
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16 }}>
            Designed for Clarity. Engineered for Resilience.
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", maxWidth: 640, marginBottom: 32 }}>
            Switch seamlessly between your personal link dashboard, deep analytics view, custom aliases, and high-res QR code exports with physical, tactile UI responsiveness.
          </p>

          <div
            className="neu-inset"
            style={{
              width: "100%",
              maxWidth: 720,
              padding: "24px 28px",
              borderRadius: 16,
              display: "flex",
              flexWrap: "wrap",
              gap: 20,
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 32, fontWeight: 900, color: "var(--primary)" }}>&lt; 12ms</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>Median Redirection</div>
            </div>
            <div style={{ width: 1, height: 40, background: "var(--shadow-dark)" }} />
            <div>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#7c3aed" }}>100%</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>Payload Sanitized</div>
            </div>
            <div style={{ width: 1, height: 40, background: "var(--shadow-dark)" }} />
            <div>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#059669" }}>99.9%</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)" }}>Service Availability</div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{ maxWidth: 760, margin: "0 auto 64px" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              Everything you need to know about the platform and its architecture.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="neu-card-sm"
                  style={{
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onClick={() => toggleFaq(idx)}
                >
                  <div
                    style={{
                      padding: "18px 24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 16,
                    }}
                  >
                    <span style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={18}
                      color="var(--text-muted)"
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                        flexShrink: 0,
                      }}
                    />
                  </div>
                  {isOpen && (
                    <div
                      style={{
                        padding: "0 24px 20px",
                        fontSize: 14,
                        color: "var(--text-secondary)",
                        lineHeight: 1.6,
                      }}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div
          className="neu-card"
          style={{
            padding: "48px 32px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            borderRadius: 20,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "4px 4px 14px rgba(61,110,246,0.4)",
            }}
          >
            <Link2 size={28} color="#fff" />
          </div>
          <h2 style={{ fontSize: 30, fontWeight: 900, color: "var(--text-primary)" }}>
            Ready to Shorten, Share & Track?
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", maxWidth: 520 }}>
            Join now to unlock your personal management dashboard, custom link slugs, and real-time demographic reports.
          </p>
          <button
            onClick={() => navigate("/auth")}
            className="neu-btn-primary"
            style={{ padding: "16px 36px", fontSize: 16, display: "inline-flex", alignItems: "center", gap: 8, marginTop: 8 }}
          >
            Get Started Free <ArrowRight size={18} />
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(197, 201, 214, 0.4)",
          padding: "24px 24px",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: 13,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6 }}>
          <Link2 size={16} color="var(--primary)" />
          <strong style={{ color: "var(--text-primary)" }}>Trimmr</strong> — High Velocity URL Shortener
        </div>
        <div>Engineered with React, Node.js, Express, TypeScript & Redis.</div>
      </footer>
    </div>
  );
};

export default LandingPage;
