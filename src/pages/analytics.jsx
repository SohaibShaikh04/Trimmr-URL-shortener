import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { 
  BarChart3, 
  Globe2, 
  Smartphone, 
  TrendingUp, 
  Link2, 
  ExternalLink, 
  MousePointerClick,
  ArrowUpRight
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { UrlState } from "@/context";
import { getUrls } from "@/db/apiUrls";
import { getClicksForUrls } from "@/db/apiClicks";
import useFetch from "@/hooks/use-fetch";

const DEVICE_COLORS = ["#4d7cf6", "#06b6d4", "#8b5cf6", "#f59e0b"];
const COUNTRY_COLORS = ["#4d7cf6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { user } = UrlState();

  const { loading: loadingUrls, data: urls, fn: fnUrls } = useFetch(getUrls, user?.id);
  const { loading: loadingClicks, data: clicks, fn: fnClicks } = useFetch(
    getClicksForUrls,
    urls?.map((u) => u.id)
  );

  useEffect(() => {
    fnUrls();
  }, []);

  useEffect(() => {
    if (urls?.length) {
      fnClicks();
    }
  }, [urls?.length]);

  const totalLinks = urls?.length || 0;
  const totalClicks = clicks?.length || 0;

  // Process Clicks over time (last 14 days)
  const clicksByDate = (clicks || []).reduce((acc, click) => {
    const dateStr = new Date(click.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    acc[dateStr] = (acc[dateStr] || 0) + 1;
    return acc;
  }, {});

  const timelineData = Object.entries(clicksByDate).map(([date, count]) => ({
    date,
    clicks: count,
  }));

  // Process Device Breakdown
  const deviceCounts = (clicks || []).reduce((acc, item) => {
    const key = (item.device || "desktop").toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const deviceData = Object.entries(deviceCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  // Process Country Breakdown
  const countryCounts = (clicks || []).reduce((acc, item) => {
    const key = item.country || "Global";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const sortedCountries = Object.entries(countryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const maxCountryClicks = sortedCountries[0]?.[1] || 1;
  const uniqueCountriesCount = Object.keys(countryCounts).length;

  // Map click counts to URLs for Top Performing Links
  const linkClickCounts = (clicks || []).reduce((acc, c) => {
    acc[c.url_id] = (acc[c.url_id] || 0) + 1;
    return acc;
  }, {});

  const rankedUrls = [...(urls || [])]
    .map((u) => ({
      ...u,
      clickCount: linkClickCounts[u.id] || 0,
    }))
    .sort((a, b) => b.clickCount - a.clickCount);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {(loadingUrls || loadingClicks) && (
        <BarLoader width="100%" color="var(--primary)" style={{ borderRadius: 4 }} />
      )}

      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>
          Analytics & Telemetry
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          Comprehensive traffic breakdown and performance insights across all your active links.
        </p>
      </div>

      {/* 4 KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
        <div className="neu-card" style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 10px rgba(61, 110, 246, 0.35)",
            }}
          >
            <MousePointerClick size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.1 }}>
              {totalClicks.toLocaleString()}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>Total Clicks Captured</div>
          </div>
        </div>

        <div className="neu-card" style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "#8b5cf6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 10px rgba(139, 92, 246, 0.35)",
            }}
          >
            <Link2 size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.1 }}>
              {totalLinks.toLocaleString()}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>Active Tracked Links</div>
          </div>
        </div>

        <div className="neu-card" style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 10px rgba(16, 185, 129, 0.35)",
            }}
          >
            <Globe2 size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.1 }}>
              {uniqueCountriesCount}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>Unique Countries</div>
          </div>
        </div>

        <div className="neu-card" style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "#f59e0b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 10px rgba(245, 158, 11, 0.35)",
            }}
          >
            <Smartphone size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.1 }}>
              {deviceData[0]?.name || "Desktop"}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>Dominant Platform</div>
          </div>
        </div>
      </div>

      {/* Traffic Trend Chart */}
      <div className="neu-card" style={{ padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(61,110,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TrendingUp size={16} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>Click Velocity Over Time</h2>
        </div>

        {timelineData.length > 0 ? (
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="clickColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface)",
                    borderColor: "var(--border-subtle)",
                    borderRadius: 12,
                    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                    color: "var(--text-primary)",
                    fontSize: 13,
                  }}
                />
                <Area type="monotone" dataKey="clicks" stroke="var(--primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#clickColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)", fontSize: 14 }}>
            No recorded click timelines yet. Share your links to generate live traffic!
          </div>
        )}
      </div>

      {/* Middle Row: Location & Device Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
        {/* Country Breakdown */}
        <div className="neu-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Globe2 size={16} color="#10b981" />
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>Top Regional Demographics</h2>
          </div>

          {sortedCountries.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {sortedCountries.map(([country, count], idx) => (
                <div key={country} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 32, fontSize: 12, fontWeight: 700, color: "var(--text-secondary)", flexShrink: 0 }}>
                    {country.slice(0, 3).toUpperCase()}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 10,
                      borderRadius: 6,
                      background: "var(--shadow-dark)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${(count / maxCountryClicks) * 100}%`,
                        background: COUNTRY_COLORS[idx % COUNTRY_COLORS.length],
                        borderRadius: 6,
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                  <span style={{ width: 44, fontSize: 13, fontWeight: 700, color: "var(--text-primary)", textAlign: "right" }}>
                    {count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "36px 0", color: "var(--text-muted)", fontSize: 14 }}>
              No geographic clicks recorded yet.
            </div>
          )}
        </div>

        {/* Device Breakdown */}
        <div className="neu-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(139,92,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Smartphone size={16} color="#8b5cf6" />
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>Device Categories</h2>
          </div>

          {deviceData.length > 0 ? (
            <div style={{ width: "100%", height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {deviceData.map((_, index) => (
                      <Cell key={index} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--surface)",
                      borderColor: "var(--border-subtle)",
                      borderRadius: 10,
                      color: "var(--text-primary)",
                      fontSize: 12,
                    }}
                  />
                  <Legend
                    iconType="circle"
                    formatter={(val) => <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "36px 0", color: "var(--text-muted)", fontSize: 14 }}>
              No device distribution recorded yet.
            </div>
          )}
        </div>
      </div>

      {/* Top Performing Links Table */}
      <div className="neu-card" style={{ padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(61,110,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BarChart3 size={16} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>Top Performing Links</h2>
        </div>

        {rankedUrls.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {rankedUrls.map((url) => {
              const shortUrl = `${window.location.origin}/${url.custom_url || url.short_url}`;
              return (
                <div
                  key={url.id}
                  className="neu-card-sm"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 18px",
                    gap: 16,
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>{url.title}</div>
                    <div style={{ fontSize: 12, color: "var(--primary)", marginTop: 2 }}>{shortUrl}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      <ExternalLink size={10} style={{ display: "inline", marginRight: 4 }} />
                      {url.original_url}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "var(--primary)" }}>{url.clickCount}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>clicks</div>
                    </div>
                    <button
                      className="neu-btn-icon"
                      onClick={() => navigate(`/link/${url.id}`)}
                      title="Inspect detailed analytics"
                    >
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "36px 0", color: "var(--text-muted)", fontSize: 14 }}>
            No links created yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
