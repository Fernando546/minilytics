'use client';

import { useEffect, useMemo, useState } from 'react';
import { CodeBlock } from "@/components/ui/code-block";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/stateful-button";
import { Plus, Trash2 } from "lucide-react";
import { getSupabaseClient } from '@/lib/supabaseClient';

type Site = {
  id: string;
  created_at: string;
  domain: string;
  site_id: string;
};

export default function SitesPanel() {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [domain, setDomain] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        if (!token) {
          setError('Please log in to manage your sites.');
          setLoading(false);
          return;
        }
        const res = await fetch('/api/sites', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to load sites');
        if (mounted) setSites(json.sites || []);
      } catch (e: any) {
        if (mounted) setError(e.message || 'Failed to load sites');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [supabase]);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain) return;
    try {
      setCreating(true);
      setError(null);
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error('Not authenticated');
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ domain }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create site');
      setSites((prev) => [json.site, ...prev]);
      setDomain('');
    } catch (e: any) {
      setError(e.message || 'Failed to create site');
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Your Sites</h2>

      <form onSubmit={onCreate} className="flex flex-col gap-3 sm:flex-row items-center">
        <Input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="example.com"
          required
          className="h-9"
        />
        <button
          type="submit"
          disabled={creating}
          className="ml-2 flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white/80 text-blue-600 transition-all hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 hover:ring-2 hover:ring-blue-200 hover:shadow disabled:opacity-50 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15"
          aria-label="Add site"
          title="Add site"
        >
          <Plus size={20} className="text-blue-600" />
        </button>
      </form>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : sites.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          {sites.map((site) => (
            <SiteCard key={site.id} site={site} onRemove={(id) => setSites((prev) => prev.filter((s) => s.id !== id))} />
          ))}
        </div>
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="rounded-md border border-dashed p-6 text-center text-gray-600 dark:border-gray-700 dark:text-gray-400">
      No sites yet. Add your domain above to get your site ID and integration instructions.
    </div>
  );
}

function SiteCard({ site, onRemove }: { site: Site, onRemove: (id: string) => void }) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const scriptSnippet = `<script defer src=\"${origin}/tracker.js\" data-site-id=\"${site.site_id}\"></script>`;

  const npmInstall = `npm install @fernando546/tracker@beta`;
  const npmSnippet = `import { MinilyticsTracker } from '@fernando546/tracker';
MinilyticsTracker.init({ endpoint: '${origin}/api/track', siteId: '${site.site_id}' });`;

  // Multi-framework examples using environment variables
  const nextAppRouterSnippet = `// app/layout.tsx
import { MinilyticsProvider } from '@fernando546/tracker/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MinilyticsProvider
          siteId={process.env.NEXT_PUBLIC_MINILY_SITE_ID!}
          apiUrl={process.env.NEXT_PUBLIC_MINILY_ENDPOINT}
          debug={true}
        >
          {children}
        </MinilyticsProvider>
      </body>
    </html>
  );
}`;

  const nextPagesRouterSnippet = `// pages/_app.tsx
import type { AppProps } from 'next/app';
import { MinilyticsProvider } from '@fernando546/tracker/react';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MinilyticsProvider
      siteId={process.env.NEXT_PUBLIC_MINILY_SITE_ID!}
      apiUrl={process.env.NEXT_PUBLIC_MINILY_ENDPOINT}
      debug={true}
    >
      <Component {...pageProps} />
    </MinilyticsProvider>
  );
}`;

  const viteReactSnippet = `// App.tsx or main.tsx
import { MinilyticsProvider } from '@fernando546/tracker/react';

export default function App() {
  return (
    <MinilyticsProvider
      siteId={import.meta.env.VITE_MINILY_SITE_ID}
      apiUrl={import.meta.env.VITE_MINILY_ENDPOINT}
      debug={true}
    >
      <div>Your App</div>
    </MinilyticsProvider>
  );
}`;

  const vueSnippet = `// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { MinilyticsTracker } from '@fernando546/tracker';

MinilyticsTracker.init({
  endpoint: import.meta.env.VITE_MINILY_ENDPOINT,
  siteId: import.meta.env.VITE_MINILY_SITE_ID,
});

createApp(App).mount('#app');`;

  // .env examples for different frameworks
  const nextEnvExample = `# .env.local (Next.js)
NEXT_PUBLIC_MINILY_ENDPOINT=${origin}/api/track
NEXT_PUBLIC_MINILY_SITE_ID=${site.site_id}`;

  const viteEnvExample = `# .env (Vite - React/Vue/TS)
VITE_MINILY_ENDPOINT=${origin}/api/track
VITE_MINILY_SITE_ID=${site.site_id}`;

  const [removing, setRemoving] = useState(false);
  const handleRemove = async () => {
    if (!confirm('Remove this site?')) return;
    setRemoving(true);
    try {
      const supabase = getSupabaseClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error('Not authenticated');
      const res = await fetch(`/api/sites/${site.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to remove site');
      onRemove(site.id);
    } catch (e) {
      alert('Failed to remove site');
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="rounded-lg border p-4 dark:border-neutral-700">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{site.domain}</h3>
          <p className="text-sm text-gray-500">Site ID: <code>{site.site_id}</code></p>
        </div>
        <button
          type="button"
          className="ml-4 flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white/80 text-red-600 transition-all hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 hover:ring-2 hover:ring-red-200 hover:shadow disabled:opacity-50 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15"
          disabled={removing}
          onClick={handleRemove}
          aria-label="Remove site"
          title="Remove site"
        >
          <Trash2 size={18} className="text-red-600" />
        </button>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <h4 className="mb-2 font-medium">Copy-paste script</h4>
          <CodeBlock
            language="html"
            filename="index.html"
            code={scriptSnippet}
          />
        </div>
        <div>
          <h4 className="mb-2 font-medium">NPM (React/JS/TS)</h4>
          <CodeBlock
            language="bash"
            filename="Terminal"
            code={npmInstall}
          />
          <div className="h-2" />
          <CodeBlock
            language="typescript"
            filename="integration.ts"
            tabs={[
              { name: 'Next.js (app/layout.tsx)', code: nextAppRouterSnippet, language: 'tsx', highlightLines: [2, 8, 9, 10, 11, 12, 14] },
              { name: 'Next.js (pages/_app.tsx)', code: nextPagesRouterSnippet, language: 'tsx', highlightLines: [3, 7, 8, 9, 10, 11, 13] },
              { name: 'Vite/React', code: viteReactSnippet, language: 'tsx', highlightLines: [2, 6, 7, 8, 9, 10, 12] },
              { name: 'Vue (main.ts)', code: vueSnippet, language: 'ts', highlightLines: [4, 5, 6, 7, 8, 9] }
            ]}
          />
          <div className="h-2" />
          <CodeBlock
            language="bash"
            filename=".env examples"
            tabs={[
              { name: '.env.local (Next.js)', code: nextEnvExample, language: 'bash', highlightLines: [2,3] },
              { name: '.env (Vite)', code: viteEnvExample, language: 'bash', highlightLines: [2,3] }
            ]}
          />
        </div>
      </div>
    </div>
  );
}
