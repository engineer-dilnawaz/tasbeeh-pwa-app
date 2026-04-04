import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      /** Avoid registering a service worker in dev — it can cache HTML and break `type="module"` loads (MIME text/html). */
      devOptions: {
        enabled: false,
      },
      includeAssets: [
        "favicon.svg",
        "favicon-32.png",
        "icon-192.png",
        "icon-512.png",
        "apple-touch-icon.png",
      ],
      manifest: {
        name: "Tasbeeh Flow",
        short_name: "Tasbeeh",
        description: "A calm and minimal tasbeeh app for daily dhikr",
        theme_color: "#0B0F0E",
        background_color: "#0B0F0E",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        categories: ["lifestyle", "utilities"],
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /\.(?:mp4|webm)$/i,
            handler: "NetworkOnly",
          },
        ],
        /** Do not SPA-fallback asset or module URLs (would return index.html as text/html for .js). */
        navigateFallbackDenylist: [/^\/assets\//, /^\/src\//, /\.(?:js|mjs|css|png|svg|ico|woff2?|mp4|webm)$/i],
      },
    }),
  ],
});
