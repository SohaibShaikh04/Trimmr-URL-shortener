import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { Search, SlidersHorizontal, TrendingUp, Link2, MousePointerClick, Activity, Plus } from "lucide-react";
import { CreateLink } from "@/components/create-link";
import LinkCard from "@/components/link-card";
import useFetch from "@/hooks/use-fetch";
import { getUrls } from "@/db/apiUrls";
import { getClicksForUrls } from "@/db/apiClicks";
import { UrlState } from "@/context";

const StatCard = ({ icon: Icon, label, value, color = "var(--primary)" }) => (
  <div className="neu-card" style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 12,
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `3px 3px 8px ${color}55`,
      }}
    >
      <Icon size={20} color="#fff" />
    </div>
    <div>
      <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.2 }}>
        {value ?? "—"}
      </div>
      <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{label}</div>
    </div>
  </div>
);

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = UrlState();

  const { loading, error, data: urls, fn: fnUrls } = useFetch(getUrls, user.id);
  const { loading: loadingClicks, data: clicks, fn: fnClicks } = useFetch(
    getClicksForUrls,
    urls?.map((u) => u.id)
  );

  useEffect(() => { fnUrls(); }, []);
  useEffect(() => { if (urls?.length) fnClicks(); }, [urls?.length]);

  const filteredUrls = urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    url.short_url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {(loading || loadingClicks) && (
        <BarLoader width="100%" color="var(--primary)" style={{ borderRadius: 4 }} />
      )}

      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>Overview</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>Here&apos;s what&apos;s happening with your links today.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <StatCard icon={Link2} label="Total Links" value={urls?.length ?? 0} color="var(--primary)" />
        <StatCard icon={MousePointerClick} label="Total Clicks" value={clicks?.length ?? 0} color="#7c3aed" />
        <StatCard icon={TrendingUp} label="This Week" value={
          clicks?.filter((c) => new Date(c.created_at) > new Date(Date.now() - 7 * 86400000)).length ?? 0
        } color="#059669" />
        <StatCard icon={Activity} label="Active Links" value={
          urls?.filter((u) => !u.expires_at || new Date(u.expires_at) > new Date()).length ?? 0
        } color="#d97706" />
      </div>

      {/* Recent Links */}
      <div className="neu-card" style={{ padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>Recent Links</h2>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {/* Search */}
            <div className="neu-inset" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10 }}>
              <Search size={15} color="var(--text-muted)" />
              <input
                style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "var(--text-primary)", width: 180 }}
                placeholder="Search campaigns, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Filter icon */}
            <button className="neu-btn-icon">
              <SlidersHorizontal size={16} />
            </button>
            {/* Create */}
            <CreateLink />
          </div>
        </div>

        {error && (
          <p style={{ color: "var(--danger)", fontSize: 13, marginBottom: 12 }}>{error.message}</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {(filteredUrls || []).length === 0 && !loading && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)", fontSize: 14 }}>
              No links yet. Create your first short link!
            </div>
          )}
          {(filteredUrls || []).map((url) => (
            <LinkCard key={url.id} url={url} fetchUrls={fnUrls} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
