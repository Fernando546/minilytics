"use client"

import React from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

type DailyStat = {
  date: string
  views: number
}

export default function ViewsLineChart({ data }: { data: DailyStat[] }) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }))

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formatted} margin={{ top: 6, right: 12, left: 0, bottom: 6 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />
          <XAxis dataKey="label" tick={{ fill: "var(--tw-color-gray-600)" }} />
          <YAxis allowDecimals={false} tick={{ fill: "var(--tw-color-gray-600)" }} />
          <Tooltip formatter={(value: any) => [value, "Views"]} />
          <Line type="monotone" dataKey="views" stroke="#6366F1" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
