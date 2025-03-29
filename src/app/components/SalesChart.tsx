// import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

// interface SalesData {
//   date: string;
//   total: number;
// }

// interface SalesChartProps {
//   data: SalesData[];
//   loading: boolean;
//   error: string;
// }

// export default function SalesChart({ data, loading, error }: SalesChartProps) {
//   return (
//     <div className="bg-white p-4 shadow rounded-lg mt-4">
//       <h2 className="text-lg font-semibold mb-4">Sales Chart</h2>
//       {loading ? (
//         <p className="text-gray-500">Loading sales data...</p>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : (
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="date" />
//             <YAxis />
//             <Tooltip />
//             <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} />
//           </LineChart>
//         </ResponsiveContainer>
//       )}
//     </div>
//   );
// }

"use client"

import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { Loader2 } from "lucide-react"

interface SalesData {
  date: string
  total: number
}

interface SalesChartProps {
  data: SalesData[]
  loading: boolean
  error: string
  isDarkTheme?: boolean
}

export default function SalesChart({ data, loading, error, isDarkTheme = false }: SalesChartProps) {
  // Theme-dependent styles
  const styles = {
    container: isDarkTheme
      ? "bg-slate-800/80 border border-slate-700 text-white"
      : "bg-white border border-slate-200 text-slate-800",
    title: isDarkTheme ? "text-slate-100" : "text-slate-800",
    subtitle: isDarkTheme ? "text-slate-400" : "text-slate-500",
    loading: isDarkTheme ? "text-slate-400" : "text-slate-500",
    error: isDarkTheme ? "text-rose-400" : "text-rose-500",
    chartColors: {
      line: isDarkTheme ? "#38bdf8" : "#0284c7", // sky-400 in dark, sky-600 in light
      grid: isDarkTheme ? "rgba(148, 163, 184, 0.15)" : "rgba(148, 163, 184, 0.2)", // slate-400 with opacity
      tooltip: {
        bg: isDarkTheme ? "rgba(30, 41, 59, 0.9)" : "rgba(255, 255, 255, 0.9)", // slate-800/white with opacity
        border: isDarkTheme ? "rgba(71, 85, 105, 0.5)" : "rgba(203, 213, 225, 0.5)", // slate-600/300 with opacity
        text: isDarkTheme ? "#f1f5f9" : "#1e293b", // slate-100/slate-800
      },
    },
  }

  // Custom tooltip component for better theming
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-3 rounded-lg shadow-lg border ${isDarkTheme ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}
          style={{ backdropFilter: "blur(4px)" }}
        >
          <p className={`text-sm font-medium ${isDarkTheme ? "text-slate-300" : "text-slate-600"}`}>{label}</p>
          <p className={`text-base font-bold ${isDarkTheme ? "text-sky-400" : "text-sky-600"}`}>
            ${payload[0].value.toFixed(2)}
          </p>
        </div>
      )
    }
    return null
  }

  // Format the Y-axis ticks to show dollar signs
  const formatYAxis = (value: number) => {
    return `$${value}`
  }

  return (
    <div className={`${styles.container} p-5 rounded-xl shadow-md`}>
      <div className="mb-6">
        <h2 className={`text-lg font-semibold ${styles.title}`}>Sales Trend</h2>
        <p className={`text-sm ${styles.subtitle}`}>Revenue over time</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[300px]">
          <Loader2 className={`h-8 w-8 ${styles.loading} animate-spin mb-2`} />
          <p className={`text-sm ${styles.loading}`}>Loading sales data...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-[300px]">
          <p className={`text-sm ${styles.error}`}>{error}</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[300px]">
          <p className={`text-sm ${styles.subtitle}`}>No sales data available for this period</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={styles.chartColors.line} stopOpacity={0.8} />
                <stop offset="95%" stopColor={styles.chartColors.line} stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={styles.chartColors.grid} vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: isDarkTheme ? "#cbd5e1" : "#475569" }}
              tickLine={{ stroke: isDarkTheme ? "#475569" : "#cbd5e1" }}
              axisLine={{ stroke: isDarkTheme ? "#475569" : "#cbd5e1" }}
            />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fill: isDarkTheme ? "#cbd5e1" : "#475569" }}
              tickLine={{ stroke: isDarkTheme ? "#475569" : "#cbd5e1" }}
              axisLine={{ stroke: isDarkTheme ? "#475569" : "#cbd5e1" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: "10px",
                color: isDarkTheme ? "#cbd5e1" : "#475569",
              }}
            />
            <Line
              type="monotone"
              dataKey="total"
              name="Revenue"
              stroke={styles.chartColors.line}
              strokeWidth={3}
              dot={{
                fill: styles.chartColors.line,
                stroke: isDarkTheme ? "#1e293b" : "#ffffff",
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                fill: styles.chartColors.line,
                stroke: isDarkTheme ? "#1e293b" : "#ffffff",
                strokeWidth: 2,
                r: 6,
              }}
              fillOpacity={1}
              fill="url(#colorTotal)"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

