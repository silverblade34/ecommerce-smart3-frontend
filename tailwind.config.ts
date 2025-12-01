import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";
const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
    
        fontFamily: {
          poppins: ['Poppins', 'sans-serif'],
        },
        
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      colors: {
        transparent: "transparent",
        bg_gray: "#F7F7F7",
        primary_sokso: "#8331A7",
        secondary_sokso: "#2D2A26",
        secondary2_sokso: "#afa9a6",
        green: "#D2EF9A",
        black: "#1F1F1F",
        gray_sokso : "#079C20",
        vino_sokso : "#800000",
        secondary: "#8331A7",
        secondary2: "#A0A0A0",
        white: "#ffffff",
        surface: "#F7F7F7",
        red: "#DB4444",
        purple: "#8684D4",
        success: "#3DAB25",
        yellow: "#ECB018",
        pink: "#F4407D",
        cyan: "#109DFA",
        line: "#E9E9E9",
        outline: "rgba(0, 0, 0, 0.15)",
        surface2: "rgba(255, 255, 255, 0.2)",
        surface1: "rgba(255, 255, 255, 0.1)",
      },
    },
    container: {
      padding: {
        DEFAULT: "16px",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
export default config;
