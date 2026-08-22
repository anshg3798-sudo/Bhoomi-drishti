import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from "recharts";

const GRID = "#1b2540";
const AXIS = "#5c667f";

const tooltipStyle = {
  background: "#111826",
  border: "1px solid #253251",
  borderRadius: 8,
  fontSize: 12,
  color: "#e8ecf5"
};

export function RainfallNdviChart({ series = [] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={series} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="season" stroke={AXIS} tick={{ fontSize: 11 }} />
        <YAxis yAxisId="left" stroke={AXIS} tick={{ fontSize: 11 }} />
        <YAxis yAxisId="right" orientation="right" stroke={AXIS} tick={{ fontSize: 11 }} domain={[0, 1]} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Line yAxisId="left" type="monotone" dataKey="rainfall" name="Rainfall (mm)" stroke="#4a93c9" strokeWidth={2} dot={false} />
        <Line yAxisId="right" type="monotone" dataKey="ndvi" name="NDVI" stroke="#3ea66d" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ForecastChart({ series = [], forecast }) {
  const data = [...series];
  if (forecast) {
    data.push({
      season: "Next Season",
      soilLoss: null,
      forecastLoss: forecast.nextSeasonSoilLoss,
      link: forecast.nextSeasonSoilLoss
    });
    if (data.length >= 2) data[data.length - 2].link = data[data.length - 2].soilLoss;
  }
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="season" stroke={AXIS} tick={{ fontSize: 11 }} />
        <YAxis stroke={AXIS} tick={{ fontSize: 11 }} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Line type="monotone" dataKey="soilLoss" name="Historical soil loss" stroke="#c1713f" strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="link" name="" stroke="#c1713f" strokeWidth={2} strokeDasharray="4 4" dot={false} legendType="none" />
        <Line type="monotone" dataKey="forecastLoss" name="Forecast" stroke="#d1553a" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function RusleFactorChart({ factors = {} }) {
  const data = Object.entries(factors).map(([key, value]) => ({ factor: key, value }));
  const colors = ["#4a93c9", "#3ea66d", "#e0a63a", "#c1713f", "#d1553a"];
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="factor" stroke={AXIS} tick={{ fontSize: 11 }} />
        <YAxis stroke={AXIS} tick={{ fontSize: 11 }} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

const RISK_COLOR = { "Very Low": "#3ea66d", Low: "#3ea66d", Moderate: "#e0a63a", High: "#c1713f", "Very High": "#d1553a", Critical: "#a83a2c" };

export function RiskDistributionChart({ zones = [] }) {
  const counts = {};
  zones.forEach((z) => { counts[z.erosionRisk] = (counts[z.erosionRisk] || 0) + 1; });
  const data = Object.entries(counts).map(([name, value]) => ({ name, value }));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={2}>
          {data.map((d, i) => <Cell key={i} fill={RISK_COLOR[d.name] || "#5c667f"} />)}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
