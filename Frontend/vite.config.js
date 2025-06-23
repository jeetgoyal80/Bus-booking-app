import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "./", // ✅ Ensures proper asset loading after deployment
  plugins: [tailwindcss(), react()],
});
