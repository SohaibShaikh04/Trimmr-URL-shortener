import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader, BeatLoader } from "react-spinners";
import { Copy, Download, Pencil, Trash2, Link2, TrendingUp } from "lucide-react";
import { UrlState } from "@/context";
import { getClicksForUrl } from "@/db/apiClicks";
import { deleteUrl, getUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import LocationStats from "@/components/location-stats";
import DeviceStats from "@/components/device-stats";

const LinkPage = () => {
  const navigate = useNavigate();
  const { user } = UrlState();
  const { id } = useParams();

  const { loading, data: url, fn, error } = useFetch(getUrl, { id, user_id: user?.id });
  const { loading: loadingStats, data: stats, fn: fnStats } = useFetch(getClicksForUrl, id);
  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, id);

  useEffect(() => { fn(); }, []);
  useEffect(() => { if (!error && loading === false) fnStats(); }, [loading, error]);

  if (error) navigate("/dashboard");

  const shortCode = url?.custom_url || url?.short_url || "";
  const shortLink = `${window.location.origin}/${shortCode}`;

  const downloadQR = () => {
    const a = document.createElement("a");
    a.href = url.qr;
    a.download = `qr-${url.title}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {(loading || loadingStats) && (
        <BarLoader width="100%" color="var(--primary)" style={{ borderRadius: 4 }} />
      )}

      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>Link Analytics</h1>
          {url && (
            <div
              className="neu-card-sm"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px" }}
            >
              <Link2 size={14} color="var(--primary)" />
              <span style={{ fontSize: 13, color: "var(--primary)", fontWeight: 500 }}>{shortLink}</span>
              <button
                style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0, display: "flex" }}
                onClick={() => navigator.clipboard.writeText(shortLink)}
              >
                <Copy size={13} color="var(--text-muted)" />
              </button>
            </div>
          )}
        </div>

        {url && (
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="neu-card-sm"
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", background: "var(--bg)" }}
            >
              <Pencil size={14} />
              Edit
            </button>
            <button
              className="neu-card-sm"
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--danger)", background: "var(--bg)" }}
              onClick={() => fnDelete().then(() => navigate("/dashboard"))}
              disabled={loadingDelete}
            >
              {loadingDelete ? <BeatLoader size={5} color="var(--danger)" /> : <><Trash2 size={14} /> Delete</>}
            </button>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Total Clicks */}
          <div className="neu-card" style={{ padding: "28px 32px", textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}>
              Total Clicks
            </div>
            <div style={{ fontSize: 56, fontWeight: 800, color: "var(--primary)", lineHeight: 1 }}>
              {stats?.length?.toLocaleString() ?? "0"}
            </div>
            {stats?.length > 0 && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 10, color: "#22c55e", fontSize: 13, fontWeight: 600 }}>
                <TrendingUp size={14} />
                Growing
              </div>
            )}
          </div>

          {/* Bottom Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Location Data */}
            <div className="neu-card" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 14 }}>🌍</span>
                </div>
                <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>Location Data</span>
              </div>
              {stats?.length > 0 ? (
                <LocationStats stats={stats} />
              ) : (
                <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No location data yet.</p>
              )}
            </div>

            {/* Device Info */}
            <div className="neu-card" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 14 }}>💻</span>
                </div>
                <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>Device Info</span>
              </div>
              {stats?.length > 0 ? (
                <DeviceStats stats={stats} />
              ) : (
                <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No device data yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel — QR + Settings */}
        <div className="neu-card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: 18, color: "var(--text-primary)", marginBottom: 4 }}>QR Code</h3>
            <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>Scan to test destination</p>
          </div>

          {/* QR Image */}
          <div
            className="neu-inset"
            style={{ borderRadius: 12, padding: 16, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 160 }}
          >
            {url?.qr ? (
              <img src={url.qr} alt="QR Code" style={{ width: 130, height: 130, objectFit: "contain" }} />
            ) : (
              <div style={{ color: "var(--text-muted)", fontSize: 13 }}>No QR available</div>
            )}
          </div>

          {/* Download */}
          <button
            className="neu-btn-primary"
            onClick={downloadQR}
            disabled={!url?.qr}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <Download size={16} />
            Download PNG
          </button>

          {/* Link Settings */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 14 }}>
              Link Settings
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <ToggleRow label="Password Protection" enabled={false} />
              <ToggleRow label="UTM Parameters" enabled={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function ToggleRow({ label, enabled }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontSize: 13, color: "var(--text-primary)" }}>{label}</span>
      <div
        style={{
          width: 40,
          height: 22,
          borderRadius: 11,
          background: enabled ? "var(--primary)" : "var(--shadow-dark)",
          position: "relative",
          cursor: "pointer",
          boxShadow: "inset 2px 2px 5px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 3,
            left: enabled ? 20 : 3,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "1px 1px 4px rgba(0,0,0,0.2)",
            transition: "left 0.2s",
          }}
        />
      </div>
    </div>
  );
}

export default LinkPage;
