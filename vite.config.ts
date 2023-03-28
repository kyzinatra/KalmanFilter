import { defineConfig } from "vite";

export default defineConfig({
  build: { target: "esnext" },
  experimental: {
    renderBuiltUrl(filename) {
      return "./" + filename;
    },
  },
});
