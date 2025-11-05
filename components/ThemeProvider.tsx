"use client"

import { useEffect } from "react"

type Theme = "light" | "dark" | "system"

export default function ThemeProvider() {
  useEffect(() => {
    const root = document.documentElement

    const apply = (newTheme: Theme) => {
      if (newTheme === "dark") {
        root.classList.add("dark")
      } else if (newTheme === "light") {
        root.classList.remove("dark")
      } else {
        // system
        const mq = window.matchMedia("(prefers-color-scheme: dark)")
        const setFromMq = (e: MediaQueryList | MediaQueryListEvent) => {
          const matches = 'matches' in e ? e.matches : (mq.matches ?? false)
          if (matches) root.classList.add("dark")
          else root.classList.remove("dark")
        }

        // initial
        setFromMq(mq)

        // listen for changes
        if (mq.addEventListener) {
          mq.addEventListener("change", setFromMq)
        } else if ((mq as any).addListener) {
          ;(mq as any).addListener(setFromMq)
        }

        // cleanup when switching theme explicitly handled below
        return () => {
          if (mq.removeEventListener) {
            mq.removeEventListener("change", setFromMq)
          } else if ((mq as any).removeListener) {
            ;(mq as any).removeListener(setFromMq)
          }
        }
      }
    }

    const saved = (localStorage.getItem("theme") as Theme) || "system"
    const cleanup = apply(saved)

    return () => {
      if (typeof cleanup === "function") cleanup()
    }
  }, [])

  return null
}
