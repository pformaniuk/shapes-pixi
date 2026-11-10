import { defineConfig, type Plugin } from "vite";

/** Local dev keeps using the TypeScript entry, even if index.html is the published build. */
function devEntry(): Plugin {
  return {
    name: "dev-entry",
    apply: "serve",
    transformIndexHtml(html) {
      return html
        .replace(/src="\/shapes-pixi\/assets\/[^"]+\.js"/, 'src="/src/main.ts"')
        .replaceAll("/shapes-pixi/", "/");
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Project site: https://pformaniuk.github.io/shapes-pixi/
  base: command === "build" ? "/shapes-pixi/" : "/",
  plugins: [devEntry()],
  server: {
    port: 8080,
    open: true,
  },
}));
