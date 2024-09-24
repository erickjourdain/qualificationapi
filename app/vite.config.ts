import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label'
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), "");

  return {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@routes": path.resolve(__dirname, "./src/routes"),
      },
    },
    plugins: [
      TanStackRouterVite(),
      react({ babel: { plugins: [jotaiDebugLabel, jotaiReactRefresh] } }),
      viteStaticCopy({
        targets: [
          {
            src: "node_modules/@tripetto/builder/fonts/",
            dest: "."
          },
          {
            src: "src/public/documentation.pdf",
            dest: "./assets"
          }
        ]
      }),
      nodePolyfills({
        globals: {
          Buffer: true, // can also be 'build', 'dev', or false
          global: true,
          process: true,
        },
      })
    ],
    build: {
      outDir: __dirname + "/public/assets",
    },
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    server: {
      port: 9000,
      host: "0.0.0.0",
    }
  }
})
