import {ResponsiveContainer,LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,BarChart,Bar,Cell,PieChart,Pie,Legend,} from "recharts";
const GRID = "#eae3c9";
const AXIS = "#93855f";
const tooltipStyle = {
  background: "#fdfcf6",
  border: "1px solid #ddd3b0",
  borderRadius: 8,
  fontSize: 12,
  color: "#2a2416",
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
  const data = series.map((item) => ({ ...item }));

  if (forecast) {
    if (data.length >= 1) {
      const lastIndex = data.length - 1;
      data[lastIndex] = { ...data[lastIndex], link: data[lastIndex].soilLoss };
    }

    data.push({
      season: "Next Season",
      soilLoss: null,
      forecastLoss: forecast.nextSeasonSoilLoss,
      link: forecast.nextSeasonSoilLoss,
    });
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
          {data.map((_, index) => (
            <Cell key={index} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

const RISK_COLOR = {
  "Very Low": "#3ea66d",
  Low: "#3ea66d",
  Moderate: "#e0a63a",
  High: "#c1713f",
  "Very High": "#d1553a",
  Critical: "#a83a2c",
};

export function RiskDistributionChart({ zones = [] }) {
  const counts = {};
  zones.forEach((zone) => {
    const risk = zone.erosionRisk;
    counts[risk] = (counts[risk] || 0) + 1;
  });

  const data = Object.entries(counts).map(([name, value]) => ({ name, value }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={2}>
          {data.map((item, index) => (
            <Cell key={index} fill={RISK_COLOR[item.name] || "#93855f"} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}