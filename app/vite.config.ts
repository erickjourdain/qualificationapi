import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import jotaiDebugLabel from 'jotai/babel/plugin-debug-label'
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      TanStackRouterVite(),
      react({ babel: { plugins: [jotaiDebugLabel, jotaiReactRefresh] } }),
      viteStaticCopy({
        targets: [
          {
            src: "node_modules/@tripetto/builder/fonts/",
            dest: "."
          }
        ]
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
