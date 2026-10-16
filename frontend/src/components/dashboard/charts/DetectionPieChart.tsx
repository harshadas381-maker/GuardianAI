import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface DetectionPieChartProps {
  toxic: number;
  safe: number;
  cyberbullying: number;
}

interface DetectionData {
  name: string;
  value: number;
}

export default function DetectionPieChart({
  toxic,
  safe,
  cyberbullying,
}: DetectionPieChartProps) {
  const total = toxic + safe + cyberbullying;

  const safePercentage =
    total > 0 ? ((safe / total) * 100).toFixed(1) : "0.0";

  const toxicPercentage =
    total > 0 ? ((toxic / total) * 100).toFixed(1) : "0.0";

  const cyberbullyingPercentage =
    total > 0
      ? ((cyberbullying / total) * 100).toFixed(1)
      : "0.0";

  const data: DetectionData[] = [
    {
      name: "Safe",
      value: safe,
    },
    {
      name: "Toxic",
      value: toxic,
    },
    {
      name: "Cyberbullying",
      value: cyberbullying,
    },
  ].filter((item) => item.value > 0);

  const COLORS: Record<string, string> = {
    Safe: "#22c55e",
    Toxic: "#ef4444",
    Cyberbullying: "#a855f7",
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">
          Detection Results
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Distribution of Safe, Toxic and Cyberbullying content
        </p>
      </div>

      {/* Chart */}
      {total === 0 ? (
        <div className="flex h-72 items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-400">
              No analysis data
            </p>

            <p className="mt-2 text-sm text-slate-600">
              Analyze some content to see results.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={48}
                paddingAngle={3}
                label={({ name, value }) =>
                  `${name}: ${value}`
                }
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[entry.name]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name) => [
                  `${value} analyses`,
                  name,
                ]}
              />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Statistics */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">

        {/* Safe */}
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />

            <span className="text-sm font-semibold text-slate-300">
              Safe
            </span>
          </div>

          <p className="mt-2 text-2xl font-bold text-green-400">
            {safe}
          </p>

          <p className="text-xs text-slate-500">
            {safePercentage}% of analyses
          </p>
        </div>

        {/* Toxic */}
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />

            <span className="text-sm font-semibold text-slate-300">
              Toxic
            </span>
          </div>

          <p className="mt-2 text-2xl font-bold text-red-400">
            {toxic}
          </p>

          <p className="text-xs text-slate-500">
            {toxicPercentage}% of analyses
          </p>
        </div>

        {/* Cyberbullying */}
        <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-purple-500" />

            <span className="text-sm font-semibold text-slate-300">
              Cyberbullying
            </span>
          </div>

          <p className="mt-2 text-2xl font-bold text-purple-400">
            {cyberbullying}
          </p>

          <p className="text-xs text-slate-500">
            {cyberbullyingPercentage}% of analyses
          </p>
        </div>
      </div>

      {/* Total */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">
        <span className="text-sm text-slate-500">
          Total Analyses
        </span>

        <span className="font-bold text-cyan-400">
          {total}
        </span>
      </div>
    </div>
  );
}