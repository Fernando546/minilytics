"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  
} from "recharts"



type InputPoint = { date: string; visitors: number }

export default function ChartAreaInteractive({ data }: { data?: InputPoint[] }) {
  const [timeRange, setTimeRange] = React.useState("90d")

  // Use passed data if available; otherwise render with an empty dataset
  const sourceData: { date: string; visitors: number }[] = React.useMemo(() => {
    if (data && data.length) return data
    return []
  }, [data])

  const referenceDate = React.useMemo(() => new Date(sourceData[sourceData.length - 1]?.date || Date.now()), [sourceData])

  const filteredData = React.useMemo(() => {
    let daysToSubtract = 90
    if (timeRange === "30d") daysToSubtract = 30
    if (timeRange === "7d") daysToSubtract = 7

    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return sourceData.filter((item) => new Date(item.date) >= startDate)
  }, [timeRange, referenceDate, sourceData])

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between gap-4 border-b py-4 px-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Area Chart - Visitors</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Showing visitors over time</p>
        </div>

        <div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="hidden rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:block dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            <option value="90d">Last 3 months</option>
            <option value="30d">Last 30 days</option>
            <option value="7d">Last 7 days</option>
          </select>
        </div>
      </div>

      <div className="p-4 sm:p-6" style={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 6, right: 12, left: 0, bottom: 6 }}>
            <defs>
              <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#f3f4f6" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={20}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }}
            />
            <Tooltip
              contentStyle={{ background: "var(--tw-bg-white)", borderRadius: 8 }}
              labelFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            />
            <Area dataKey="visitors" type="natural" fill="url(#fillVisitors)" stroke="#6366F1" stackId="a" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
