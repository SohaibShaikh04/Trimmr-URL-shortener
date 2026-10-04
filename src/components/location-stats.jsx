const COLORS = ["#3d6ef6", "#7c3aed", "#059669", "#d97706", "#ef4444"];

export default function LocationStats({ stats = [] }) {
  const countryCount = stats.reduce((acc, item) => {
    const key = item.country || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const sorted = Object.entries(countryCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const max = sorted[0]?.[1] || 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {sorted.map(([country, count], i) => (
        <div key={country} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 28, fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", flexShrink: 0 }}>
            {country.slice(0, 2).toUpperCase()}
          </span>
          <div style={{ flex: 1, height: 8, borderRadius: 4, overflow: "hidden", background: "var(--shadow-dark)", boxShadow: "inset 2px 2px 4px rgba(0,0,0,0.1)" }}>
            <div
              style={{
                height: "100%",
                width: `${(count / max) * 100}%`,
                background: COLORS[i % COLORS.length],
                borderRadius: 4,
                transition: "width 0.5s ease",
              }}
            />
          </div>
          <span style={{ width: 36, fontSize: 12, fontWeight: 700, color: "var(--text-primary)", textAlign: "right", flexShrink: 0 }}>
            {count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count}
          </span>
        </div>
      ))}
    </div>
  );
}
