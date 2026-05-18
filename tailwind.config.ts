import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        executive: "0 18px 50px rgba(15, 23, 42, 0.10)"
      }
    }
  },
  plugins: []
} satisfies Config;
