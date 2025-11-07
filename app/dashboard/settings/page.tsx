"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, Monitor, Bell, Shield, Database, User, Mail, Trash2, Download } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabaseClient"

type Theme = "light" | "dark" | "system"

export default function SettingsPage() {
  const [theme, setTheme] = useState<Theme>("system")
  const [userEmail, setUserEmail] = useState<string>("")
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
    
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme") as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      applyTheme("system")
    }
  }, [])

  const fetchUserData = async () => {
    const supabase = getSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      setUserEmail(user.email || "")
    }
    setLoading(false)
  }

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    
    if (newTheme === "dark") {
      root.classList.add("dark")
    } else if (newTheme === "light") {
      root.classList.remove("dark")
    } else {
      // system
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (prefersDark) {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    }
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    applyTheme(newTheme)
  }

  const handleSignOut = async () => {
    const supabase = getSupabaseClient()
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Settings</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Manage your account preferences and application settings
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Appearance Section */}
        <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="border-b border-neutral-200 p-6 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-neutral-100 p-2 dark:bg-neutral-800">
                <Sun className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Appearance
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Customize how Minilytics looks
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <label className="mb-3 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Theme Preference
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleThemeChange("light")}
                className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                  theme === "light"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                    : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600"
                }`}
              >
                <Sun className="h-6 w-6" />
                <span className="text-sm font-medium">Light</span>
              </button>

              <button
                onClick={() => handleThemeChange("dark")}
                className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                  theme === "dark"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                    : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600"
                }`}
              >
                <Moon className="h-6 w-6" />
                <span className="text-sm font-medium">Dark</span>
              </button>

              <button
                onClick={() => handleThemeChange("system")}
                className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                  theme === "system"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                    : "border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600"
                }`}
              >
                <Monitor className="h-6 w-6" />
                <span className="text-sm font-medium">System</span>
              </button>
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="border-b border-neutral-200 p-6 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-neutral-100 p-2 dark:bg-neutral-800">
                <User className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Account
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Manage your account information
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Email Address
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-800">
                <Mail className="h-4 w-4 text-neutral-500" />
                <span className="text-sm text-neutral-900 dark:text-white">
                  {loading ? "Loading..." : userEmail}
                </span>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="border-b border-neutral-200 p-6 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-neutral-100 p-2 dark:bg-neutral-800">
                <Bell className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Notifications
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Configure notification preferences
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  Email Reports
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Receive weekly analytics summaries
                </p>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotifications ? "bg-blue-600" : "bg-neutral-300 dark:bg-neutral-700"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailNotifications ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              Coming soon: Email notifications will be available in a future update
            </p>
          </div>
        </div>

        {/* Privacy & Data Section */}
        <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="border-b border-neutral-200 p-6 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-neutral-100 p-2 dark:bg-neutral-800">
                <Shield className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Privacy & Data
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Control your data and privacy
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-3">
            <button className="flex w-full items-center gap-3 rounded-lg border border-neutral-200 px-4 py-3 text-left transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
              <Download className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  Export Data
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Download all your analytics data
                </p>
              </div>
            </button>
            <button className="flex w-full items-center gap-3 rounded-lg border border-neutral-200 px-4 py-3 text-left transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
              <Database className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  Data Retention
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  Configure storage duration (Coming soon)
                </p>
              </div>
            </button>
            <button className="flex w-full items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-left transition-colors hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:hover:bg-red-900">
              <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-400">
                  Delete All Data
                </p>
                <p className="text-xs text-red-600 dark:text-red-500">
                  Permanently remove all analytics data
                </p>
              </div>
            </button>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              Data management features coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
