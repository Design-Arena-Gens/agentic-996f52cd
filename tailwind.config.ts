import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./styles/**/*.{ts,tsx}",
    "./ui/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecf9ff",
          100: "#d6efff",
          200: "#b0e1ff",
          300: "#7bcaff",
          400: "#39adff",
          500: "#0d8dff",
          600: "#006ce6",
          700: "#0053b4",
          800: "#003d82",
          900: "#002e60"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)"]
      },
      keyframes: {
        pulseWave: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.4" },
          "50%": { transform: "scale(1.05)", opacity: "1" }
        }
      },
      animation: {
        pulseWave: "pulseWave 4s ease-in-out infinite"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
