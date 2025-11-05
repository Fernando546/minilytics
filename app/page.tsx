'use client';

import { useState } from 'react';
import AuthModal from '@/components/AuthModal';
import { AuroraText } from "@/components/ui/aurora-text"
import { AnimatedSpan, Terminal, TypingAnimation } from "@/components/ui/terminal"

export default function Home() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-purple-950">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl dark:bg-purple-500/10" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl dark:bg-blue-500/10" />
        </div>

        {/* Header */}
        <header className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-purple-600">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Minilytics</span>
          </div>
          <button
            onClick={() => setIsAuthOpen(true)}
            className="rounded-full bg-blue-600 px-6 py-2 font-medium text-white transition-all hover:bg-blue-700 hover:shadow-lg"
          >
            Get Started
          </button>
        </header>

        {/* Hero Section */}
        <main className="relative z-10 mx-auto max-w-6xl px-6 py-20 lg:py-32">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
              </span>
              Privacy-First Analytics
            </div>

            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
              <AuroraText 
                className="block"
                colors={["#3b82f6", "#8b5cf6", "#06b6d4", "#6366f1"]}
              >
                Understand Your Visitors
              </AuroraText>
              <br />
              <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Without Invading Privacy
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              Lightweight, GDPR-compliant analytics that respects your users. Get real-time insights with a simple script—no cookies, no tracking, no complexity.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-2 rounded-full bg-linear-to-r from-blue-600 to-purple-600 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
              >
                Start Free Trial
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <a
                href="#features"
                className="rounded-full border-2 border-gray-300 px-8 py-3 font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-800"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Features Grid */}
          <div id="features" className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title="Lightning Fast"
              description="< 1KB script loads instantly. No performance impact on your site."
            />
            <FeatureCard
              icon={
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              title="Privacy First"
              description="No cookies, no fingerprinting. Fully GDPR & CCPA compliant out of the box."
            />
            <FeatureCard
              icon={
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              }
              title="Live Counter"
              description="See real-time visitor counts and page views as they happen."
            />
            <FeatureCard
              icon={
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              }
              title="Easy Integration"
              description="Single line of code. Works with any framework or static site."
            />
            <FeatureCard
              icon={
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              title="Open Source"
              description="Transparent codebase. Self-host or use our managed service."
            />
            <FeatureCard
              icon={
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Free Tier"
              description="Start with 10k events/month free. Scale as you grow."
            />
          </div>

          {/* Installation Examples */}
          <div className="mt-24">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
              Get started in seconds
            </h2>
            <div className="mx-auto flex max-w-4xl flex-col gap-6 md:flex-row">
              {/* NPM Installation */}
              <Terminal className="flex-1">
                <TypingAnimation delay={0} className="text-gray-300">
                  $ npm install @minilytics/tracker
                </TypingAnimation>
                
                <AnimatedSpan className="text-gray-300">
                  + @minilytics/tracker@1.0.0
                </AnimatedSpan>

                <AnimatedSpan className="text-gray-300">
                  added 1 package in 2s
                </AnimatedSpan>

                <AnimatedSpan className="text-green-400">
                  ✓ Ready to track!
                </AnimatedSpan>
              </Terminal>

              {/* Script Tag */}
              <Terminal className="flex-1">
                <TypingAnimation delay={0} className="text-gray-300">
                  &lt;script
                </TypingAnimation>
                
                <AnimatedSpan className="text-gray-300 pl-4">
                  defer
                </AnimatedSpan>
                
                <AnimatedSpan className="text-gray-300 pl-4">
                  src=&quot;https://minilytics.app/tracker.js&quot;
                </AnimatedSpan>
                
                <AnimatedSpan className="text-gray-300 pl-4">
                  data-site-id=&quot;YOUR_SITE_ID&quot;
                </AnimatedSpan>
                
                <AnimatedSpan className="text-gray-300">
                  &gt;&lt;/script&gt;
                </AnimatedSpan>
              </Terminal>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-gray-200 py-8 text-center text-sm text-gray-600 dark:border-gray-800 dark:text-gray-400">
          <p>© 2025 Minilytics. Privacy-first analytics for modern websites.</p>
        </footer>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white/50 p-6 backdrop-blur-sm transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900/50">
      <div className="mb-4 inline-flex rounded-lg bg-linear-to-br from-blue-600 to-purple-600 p-3 text-white">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
