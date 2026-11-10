import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Project site: https://pformaniuk.github.io/shapes-pixi/
  base: command === "build" ? "/shapes-pixi/" : "/",
  server: {
    port: 8080,
    open: true,
  },
}));
