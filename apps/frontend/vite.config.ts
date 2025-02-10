/// <reference types="vitest" />
import { ConfigEnv, defineConfig, loadEnv, UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config https://vitest.dev/config
export default ({ mode }: ConfigEnv): UserConfig => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    server: {
      host: true,
      port: Number(process.env.VITE_PORT),
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: "assets/[name]-[hash].js",
          chunkFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash].[ext]",
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
        registerType: "autoUpdate",
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
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
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
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
              urlPattern: /\.(?:js|css)$/,
              handler: "StaleWhileRevalidate",
              options: {
                cacheName: "static-resources",
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
              urlPattern: /\.(?:html|htm)$/,
              handler: "NetworkFirst",
              options: {
                cacheName: "html",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
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
};
