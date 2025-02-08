/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config https://vitest.dev/config
export default defineConfig({
  server: {
    host: true,
    port: 4001,
  },
  plugins: [
    react(),
    TanStackRouterVite(),
    tsconfigPaths(),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mkcert(),
    VitePWA({
      devOptions: {
        enabled: true,
        type: "module",
      },
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      manifest: {
        theme_color: "#96d4b7",
        background_color: "#fffaf4",
        icons: [
          {
            purpose: "maskable",
            sizes: "512x512",
            src: "brand/icon512_maskable.png",
            type: "image/png",
          },
          {
            purpose: "any",
            sizes: "512x512",
            src: "brand/icon512_rounded.png",
            type: "image/png",
          },
        ],
        orientation: "any",
        display: "standalone",
        lang: "nl-NL",
        name: "Groei!",
        short_name: "Groei!",
      },
    }),
  ],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ".vitest/setup",
    include: ["**/test.{ts,tsx}"],
  },
});
