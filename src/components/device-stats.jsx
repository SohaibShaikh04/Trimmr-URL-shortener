import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ["#3d6ef6", "#06b6d4", "#7c3aed", "#f59e0b"];

export default function DeviceStats({ stats }) {
  const deviceCount = stats.reduce((acc, item) => {
    const key = item.device || "desktop";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(deviceCount).map(([name, value]) => ({ name, value }));

  return (
    <div style={{ width: "100%", height: 180 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={75}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "var(--bg)", border: "none", borderRadius: 10, boxShadow: "4px 4px 12px var(--shadow-dark)", fontSize: 12 }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span style={{ fontSize: 11, color: "var(--text-secondary)", textTransform: "capitalize" }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
