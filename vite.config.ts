/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

/**
 * Builds the Content Security Policy for the given environment.
 *
 * The app loads no remote images, fonts, iframes or workers, so everything
 * except the ProtoPedia API endpoint can be denied. The dev server needs a
 * single relaxation: inline scripts for the React Fast Refresh preamble. Its
 * HMR WebSocket needs no extra source, because `connect-src 'self'` already
 * matches a ws:// URL on the page's own host and port. Every other directive,
 * `connect-src` and `img-src` included, is identical in both modes, so
 * exfiltration behaves the same way in development as in production.
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
    // The single legitimate destination for the API token, in both modes. The
    // dev server's HMR WebSocket needs no entry of its own: CSP matches a ws://
    // URL against 'self', so it keeps working through whichever loopback
    // hostname and port the page was reached on.
    "connect-src 'self' https://protopedia.net",
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
