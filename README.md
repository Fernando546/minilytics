# @fernando546/tracker

[![npm version](https://badge.fury.io/js/@fernando546%2Ftracker.svg)](https://www.npmjs.com/package/@fernando546/tracker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight, privacy-first analytics tracker for modern web applications. Built with TypeScript and designed for simplicity.

## ✨ Features

- 🪶 **Lightweight** - Only ~2KB gzipped (core library)
- 🔒 **Privacy-First** - Respects Do Not Track (DNT) settings automatically
- ⚡ **Zero Config** - Works out of the box with sensible defaults
- 🎯 **SPA Support** - Automatic route change detection for single-page apps
- ⚛️ **React Ready** - First-class React hooks and provider included
- 📦 **Framework Agnostic** - Works with any JavaScript framework
- 🌐 **Server-Side Friendly** - Safe for SSR/SSG (Next.js, Nuxt, etc.)
- 🔧 **TypeScript Native** - Full TypeScript support with complete type definitions
- 🚫 **No Dependencies** - Zero external dependencies in production

## 🚀 Quick Start

### Installation

```bash
npm install @fernando546/tracker@beta
```

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/@fernando546/tracker@beta/dist/index.js"></script>
  <script>
    MinilyticsTracker.init({
      siteId: 'your-site-id',
      endpoint: 'https://your-analytics-domain.com/api/track'
    });
  </script>
</head>
<body>
  <!-- Your content -->
</body>
</html>
```

### React / Next.js

```tsx
import { MinilyticsProvider, usePageTracking } from '@fernando546/tracker/react';

function App() {
  return (
    <MinilyticsProvider
      siteId={process.env.NEXT_PUBLIC_SITE_ID}
      endpoint={process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT}
    >
      <YourApp />
    </MinilyticsProvider>
  );
}

function YourApp() {
  // Automatically tracks page views on route changes
  usePageTracking();
  
  return <div>Your app content</div>;
}
```

### Vue / Nuxt

```javascript
import { MinilyticsTracker } from '@fernando546/tracker';

// In your app entry point (main.js, app.vue, etc.)
MinilyticsTracker.init({
  siteId: import.meta.env.VITE_SITE_ID,
  endpoint: import.meta.env.VITE_ANALYTICS_ENDPOINT,
  debug: import.meta.env.DEV
});
```

## 📖 API Reference

### Core Tracker

#### `MinilyticsTracker.init(config)`

Initialize the tracker with your configuration.

```typescript
MinilyticsTracker.init({
  siteId: string,        // Your unique site identifier
  endpoint: string,      // Your analytics API endpoint
  debug?: boolean        // Enable console logging (default: false)
});
```

#### `MinilyticsTracker.trackPageView()`

Manually track a page view.

```typescript
MinilyticsTracker.trackPageView();
```

#### `MinilyticsTracker.trackEvent(eventName, properties?)`

Track custom events with optional properties.

```typescript
MinilyticsTracker.trackEvent('button_click', {
  button_id: 'cta-signup',
  location: 'hero-section'
});
```

### React Hooks

#### `MinilyticsProvider`

Context provider to configure the tracker for your React app.

```tsx
<MinilyticsProvider
  siteId={string}
  endpoint={string}
  debug={boolean}
>
  {children}
</MinilyticsProvider>
```

#### `usePageTracking()`

Hook that automatically tracks page views on route changes.

```tsx
function MyComponent() {
  usePageTracking();
  return <div>Content</div>;
}
```

#### `useMinilytics()`

Hook to access the tracker instance for custom events.

```tsx
function MyComponent() {
  const tracker = useMinilytics();
  
  const handleClick = () => {
    tracker.trackEvent('custom_event', { foo: 'bar' });
  };
  
  return <button onClick={handleClick}>Track Event</button>;
}
```

## 🎯 Why Choose This Over Alternatives?

### vs Traditional Analytics Solutions

| Feature | @fernando546/tracker | Traditional Solutions |
|---------|---------------------|----------------------|
| **Privacy** | ✅ No cookies, respects DNT | ❌ Extensive tracking, cookies |
| **GDPR Compliant** | ✅ By default | ⚠️ Requires consent banners |
| **Bundle Size** | ✅ ~2KB | ❌ 10-50KB+ |
| **Your Data** | ✅ You own it | ❌ Third-party owned |
| **Ad Blocking** | ✅ Less likely to be blocked | ❌ Commonly blocked |
| **Setup Time** | ✅ 1 minute | ⚠️ 10-30 minutes |

### vs Paid Privacy-Focused Services

| Feature | @fernando546/tracker | Paid Services |
|---------|---------------------|---------------|
| **Self-Hosted** | ✅ Full control | ⚠️ Paid plans only |
| **Cost** | ✅ Free (your infra only) | ❌ $9-50/month |
| **Customization** | ✅ Fully customizable | ⚠️ Limited options |
| **Open Source** | ✅ MIT License | ⚠️ Varies |
| **Event Tracking** | ✅ Built-in | ✅ Built-in |

### vs Other Self-Hosted Solutions

| Feature | @fernando546/tracker | Other Self-Hosted |
|---------|---------------------|-------------------|
| **Bundle Size** | ✅ ~2KB | ⚠️ 5-15KB |
| **Framework Support** | ✅ React hooks included | ⚠️ Basic script only |
| **TypeScript** | ✅ Native TS, full types | ⚠️ Partial or no types |
| **Setup Complexity** | ✅ npm install + 2 lines | ⚠️ Docker/complex setup |
| **Dependencies** | ✅ Zero in production | ⚠️ Multiple dependencies |

## 🛡️ Privacy Features

- **No Cookies** - Completely cookie-free tracking
- **No Personal Data** - Only tracks page views and events, no PII
- **Respects DNT** - Automatically honors Do Not Track browser settings
- **No Fingerprinting** - No device or browser fingerprinting
- **GDPR/CCPA Ready** - Designed with privacy laws in mind

## 🔧 Environment Variables

Set these in your project's environment:

```bash
# Next.js (.env.local)
NEXT_PUBLIC_SITE_ID=my-awesome-site
NEXT_PUBLIC_ANALYTICS_ENDPOINT=https://analytics.example.com/api/track

# Vite (.env)
VITE_SITE_ID=my-awesome-site
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com/api/track

# Create React App (.env)
REACT_APP_SITE_ID=my-awesome-site
REACT_APP_ANALYTICS_ENDPOINT=https://analytics.example.com/api/track
```

## 📊 What Gets Tracked?

The tracker sends minimal data:

```typescript
{
  domain: "example.com",           // Current domain
  path: "/blog/my-post",           // Page path
  referrer: "https://google.com",  // Referrer URL (if any)
  title: "My Blog Post",           // Page title
  event: "pageview",               // Event type
  properties: {},                   // Custom event data (optional)
  site_id: "your-site-id"          // Your site identifier
}
```

## 🧪 Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Development mode (watch)
npm run dev

# Type check
npm run typecheck
```

## 📦 Package Contents

- **ESM** - `dist/index.mjs` - Modern ES modules
- **CJS** - `dist/index.js` - CommonJS for older tools
- **Types** - `dist/*.d.ts` - Full TypeScript definitions
- **React** - `dist/react.*` - React-specific bundle with hooks
- **Source Maps** - Included for all builds

## 🤝 Contributing

Contributions are welcome! This is part of the [Minilytics](https://github.com/Fernando546/minilytics) project.

## 📄 License

MIT © [Fernando546](https://github.com/Fernando546)

## 🔗 Links

- [npm Package](https://www.npmjs.com/package/@fernando546/tracker)
- [GitHub Repository](https://github.com/Fernando546/minilytics)
- [Report Issues](https://github.com/Fernando546/minilytics/issues)

---

**Made with ❤️ for privacy-conscious developers**
