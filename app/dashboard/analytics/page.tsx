"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabaseClient"
import ViewsLineChart from "@/components/analytics/ViewsLineChart"
import ChartAreaInteractive from "@/components/analytics/ChartAreaInteractive"
import { BarChart3, TrendingUp, Eye, Globe } from "lucide-react"

type Site = {
  site_id: string
  domain: string
  created_at: string
}

type PageView = {
  id: string
  created_at: string
  domain: string | null
  path: string | null
  site_id: string | null
}

type DailyStats = {
  date: string
  views: number
}

export default function AnalyticsPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [selectedSite, setSelectedSite] = useState<string>("all")
  const [pageViews, setPageViews] = useState<PageView[]>([])
  const [loading, setLoading] = useState(true)
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([])

  useEffect(() => {
    fetchSites()
  }, [])

  useEffect(() => {
    fetchAnalytics()
  }, [selectedSite])

  const fetchSites = async () => {
    const supabase = getSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) return

    const response = await fetch('/api/sites', {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      setSites(data.sites || [])
    }
  }

  const fetchAnalytics = async () => {
    setLoading(true)
    const supabase = getSupabaseClient()
    
    try {
      let query = supabase
        .from('page_views')
        .select('*')
        .order('created_at', { ascending: false })

      if (selectedSite !== "all") {
        query = query.eq('site_id', selectedSite)
      }

      const { data, error } = await query

      if (error) throw error

      setPageViews(data || [])
      calculateDailyStats(data || [])
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateDailyStats = (views: PageView[]) => {
    const stats: { [key: string]: number } = {}
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split('T')[0]
    }).reverse()

    last7Days.forEach(date => {
      stats[date] = 0
    })

    views.forEach(view => {
      const date = new Date(view.created_at).toISOString().split('T')[0]
      if (stats[date] !== undefined) {
        stats[date]++
      }
    })

    setDailyStats(
      Object.entries(stats).map(([date, views]) => ({
        date,
        views
      }))
    )
  }

  const totalViews = pageViews.length
  const totalSites = sites.length
  const todayViews = pageViews.filter(v => {
    const today = new Date().toISOString().split('T')[0]
    const viewDate = new Date(v.created_at).toISOString().split('T')[0]
    return today === viewDate
  }).length

  const maxViews = Math.max(...dailyStats.map(s => s.views), 1)

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your website performance
          </p>
        </div>

        <select
          value={selectedSite}
          onChange={(e) => setSelectedSite(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <option value="all">All Sites</option>
          {sites.map((site) => (
            <option key={site.site_id} value={site.site_id}>
              {site.domain}
            </option>
          ))}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Eye className="h-6 w-6" />}
          title="Total Views"
          value={totalViews.toLocaleString()}
          color="blue"
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6" />}
          title="Today"
          value={todayViews.toLocaleString()}
          color="green"
        />
        <StatCard
          icon={<Globe className="h-6 w-6" />}
          title="Total Sites"
          value={totalSites.toLocaleString()}
          color="purple"
        />
        <StatCard
          icon={<BarChart3 className="h-6 w-6" />}
          title="Avg/Day"
          value={Math.round(totalViews / 7).toLocaleString()}
          color="orange"
        />
      </div>

      {/* Chart */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
          Last 7 Days
        </h2>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
          <div>
            {/* Interactive area chart (template) */}
            <ChartAreaInteractive data={dailyStats.map(d => ({ date: d.date, visitors: d.views }))} />
          </div>
        )}
      </div>

      {/* Top Pages */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
          Top Pages
        </h2>
        
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="pb-3 text-left font-medium text-gray-700 dark:text-gray-300">Page</th>
                <th className="pb-3 text-left font-medium text-gray-700 dark:text-gray-300">Domain</th>
                <th className="pb-3 text-right font-medium text-gray-700 dark:text-gray-300">Views</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {Object.entries(
                pageViews.reduce((acc, view) => {
                  const key = `${view.domain}${view.path}`
                  acc[key] = {
                    domain: view.domain || '',
                    path: view.path || '/',
                    count: (acc[key]?.count || 0) + 1
                  }
                  return acc
                }, {} as Record<string, { domain: string; path: string; count: number }>)
              )
                .sort(([, a], [, b]) => b.count - a.count)
                .slice(0, 10)
                .map(([key, data]) => (
                  <tr key={key}>
                    <td className="py-3 text-gray-900 dark:text-white">{data.path}</td>
                    <td className="py-3 text-gray-600 dark:text-gray-400">{data.domain}</td>
                    <td className="py-3 text-right text-gray-900 dark:text-white">{data.count}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          
          {pageViews.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              No data yet. Add the tracker to your sites.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ 
  icon, 
  title, 
  value, 
  color 
}: { 
  icon: React.ReactNode
  title: string
  value: string
  color: "blue" | "green" | "purple" | "orange"
}) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-center gap-3">
        <div className={`rounded-lg bg-linear-to-br ${colorClasses[color]} p-2 text-white`}>
          {icon}
        </div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
    </div>
  )
}
