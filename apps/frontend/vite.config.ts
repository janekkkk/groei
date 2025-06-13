/// <reference types="vitest" />
import { ConfigEnv, defineConfig, loadEnv, UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import mkcert from "vite-plugin-mkcert";
import { readFileSync } from "fs";
import path from "path";

// Generate a build timestamp for cache busting
const buildTimestamp = new Date().toISOString();

// Read package.json version for service worker versioning
const packageJson = JSON.parse(
  readFileSync(path.resolve(__dirname, "package.json"), "utf-8"),
);
const appVersion = packageJson.version || "1.0.0";

// https://vitejs.dev/config https://vitest.dev/config
export default ({ mode }: ConfigEnv): UserConfig => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    server: {
      host: true,
      port: Number(process.env.VITE_PORT),
    },
    define: {
      // Make version available in the app
      "import.meta.env.APP_VERSION": JSON.stringify(appVersion),
      "import.meta.env.BUILD_TIMESTAMP": JSON.stringify(buildTimestamp),
    },
    build: {
      // Always generate new file names with unique hashes
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name]-[hash]-${buildTimestamp.substring(0, 10)}.js`,
          chunkFileNames: `assets/[name]-[hash]-${buildTimestamp.substring(0, 10)}.js`,
          assetFileNames: `assets/[name]-[hash]-${buildTimestamp.substring(0, 10)}.[ext]`,
        },
      },
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
        registerType: "prompt", // Change to prompt to give more control
        injectRegister: "auto",
        manifest: {
          name: "Groei Garden Planner",
          short_name: "Groei",
          version: appVersion,
          build: buildTimestamp,
          icons: [
            {
              src: "/favicons/web-app-manifest-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/favicons/web-app-manifest-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "/brand/icon512_maskable.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
          theme_color: "#ffffff",
          background_color: "#ffffff",
          display: "standalone",
          start_url: "/",
        },
        workbox: {
          // Force SW updates when new deployments happen
          clientsClaim: true,
          skipWaiting: true,
          // Use cacheId instead of buildID for versioning
          cacheId: `groei-v${appVersion}-${buildTimestamp.substring(0, 10)}`,
          globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
          // Don't cache API responses for too long
          runtimeCaching: [
            {
              // Env does not load by some reason.
              urlPattern: new RegExp(
                "^https:\\/\\/groei-api\\.janekozga\\.nl\\/api\\/.*|^http:\\/\\/localhost:4000\\/api\\/.*",
              ),
              handler: "NetworkFirst",
              options: {
                cacheName: "api-requests",
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60, // Reduced to 1 hour to get fresher data
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
              handler: "CacheFirst",
              options: {
                cacheName: "images",
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              // Change JS files to use NetworkFirst for more reliable updates
              urlPattern: /\.(?:js|css)$/,
              handler: "NetworkFirst",
              options: {
                cacheName: "static-resources",
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 24 * 60 * 60, // Reduced to 1 day
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\.(?:html|htm)$/,
              handler: "NetworkFirst",
              options: {
                cacheName: "html",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60, // Reduced to 1 hour
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\.(?:woff2?|ttf|otf|eot)$/,
              handler: "CacheFirst",
              options: {
                cacheName: "fonts",
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
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
};
