import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  // Some school Chromebooks are stuck on Chrome 103.
  build: { target: ["chrome96", "safari15", "firefox100"] },
});
