/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

/**
 * Builds the Content Security Policy for the given environment.
 *
 * The app loads no remote images, fonts, iframes or workers, so everything
 * except the ProtoPedia API endpoint can be denied. The dev server needs two
 * relaxations: inline scripts for the React Fast Refresh preamble, and its HMR
 * WebSocket. The http(s) origins reachable through `connect-src` and `img-src`
 * are the same in both modes, so exfiltration behaves identically there.
 *
 * Delivery differs per environment: GitHub Pages serves static files only and
 * cannot set response headers, so the production policy travels in a
 * `<meta http-equiv>` tag. Note that `frame-ancestors`, `report-uri`,
 * `report-to` and `sandbox` are ignored when delivered that way, and
 * `Content-Security-Policy-Report-Only` is not available at all.
 */
function buildContentSecurityPolicy(
  mode: 'production' | 'development',
): string {
  const isDev = mode === 'development';

  return [
    // Deny anything not explicitly listed below, including future directives.
    "default-src 'none'",
    // Bundled scripts only. Blocks injected inline and remote scripts.
    // The dev server injects the React Fast Refresh preamble inline, so
    // 'unsafe-inline' is unavoidable there.
    `script-src 'self'${isDev ? " 'unsafe-inline'" : ''}`,
    // MUI (Emotion) injects <style> elements at runtime, so inline styles are
    // unavoidable here.
    "style-src 'self' 'unsafe-inline'",
    // The app renders no <img> elements; 'self' just covers same-origin assets
    // such as a favicon. `data:` issues no network request, so neither source
    // can be used to smuggle data out.
    "img-src 'self' data:",
    // The single legitimate destination for the API token. The dev server also
    // needs its HMR WebSocket; the port is wildcarded because Vite picks the
    // next free one when its default is taken (and --port overrides it), which
    // would otherwise break HMR silently. Every other origin stays denied, so
    // exfiltration behaviour is identical to production.
    `connect-src 'self' https://protopedia.net${
      isDev ? ' ws://localhost:*' : ''
    }`,
    // No form performs a real submission; the token form calls preventDefault().
    "form-action 'none'",
    // Prevents an injected <base> tag from rewriting relative URLs.
    "base-uri 'none'",
  ].join('; ');
}

/**
 * Injects the CSP meta tag into `index.html` at build time.
 *
 * Build-only because the meta tag exists to work around GitHub Pages being
 * unable to set response headers. The dev server can set them, so it serves the
 * development policy through `server.headers` instead.
 */
function contentSecurityPolicyPlugin(): Plugin {
  return {
    name: 'inject-csp-meta',
    apply: 'build',
    transformIndexHtml(_html, ctx) {
      // Storybook's react-vite framework merges this config and builds its own
      // iframe.html through the same hook. That document needs inline scripts
      // and framing, so restrict the policy to the app's own entry point.
      if (ctx.path !== '/index.html') {
        return [];
      }

      return [
        {
          tag: 'meta',
          attrs: {
            'http-equiv': 'Content-Security-Policy',
            content: buildContentSecurityPolicy('production'),
          },
          // A meta policy only governs what follows it, so it must come first.
          injectTo: 'head-prepend',
        },
      ];
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: '/PROMIDAS-demo/',
  plugins: [react(), contentSecurityPolicyPlugin()],
  server: {
    // Unlike GitHub Pages, the dev server can set response headers, so the
    // policy is delivered that way here rather than through the meta tag.
    headers: {
      'Content-Security-Policy': buildContentSecurityPolicy('development'),
    },
  },
  preview: {
    // `vite preview` would otherwise inherit server.headers and serve the
    // development policy next to the production meta tag. Clearing it keeps
    // preview a faithful stand-in for GitHub Pages, where the meta tag is the
    // only policy in effect.
    headers: {},
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('@mui/material') || id.includes('@mui/system')) {
              return 'mui-core';
            }
            if (id.includes('@mui/icons-material')) {
              return 'mui-icons';
            }
            if (id.includes('promidas-utils')) {
              return 'promidas-utils';
            }
            if (id.includes('promidas')) {
              return 'promidas';
            }
            if (id.includes('protopedia-api-v2-client')) {
              return 'protopedia-api-v2-client';
            }
          }
        },
      },
    },
  },
});
