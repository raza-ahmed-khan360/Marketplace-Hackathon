import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "gray-scales-black": "#272343",
        "gray-scales-white": "#fff",
        "gray-scales-off-white": "#f0f2f3",
        "accents-dark-accents": "#007580",
        "gray-scales-dark-gray": "#636270",
        whitesmoke: "#f7f7f7",
        teal: "#007580",
        whitesmoke1: "rgba(249, 249, 249, 0.15)",
        white: "#fff",
        "gray-1": "#333",
        "gray-2": "#4f4f4f",
        "status-success": "#01ad5a",
        "gray-scales-gray": "#9a9caa",
        "accents-accents": "#029fae",
        gainsboro: "#d9d9d9",
        darkcyan: "#029fae",
        gray: {
          "100": "#757575",
          "200": "#111",
          "300": "rgba(255, 255, 255, 0)",
          gray: "rgba(0, 0, 0, 0.7)",
        },
        black: "#000",
        darkgray: "#9a9caa",
        "dark-primary": "#2a254b",

        "status-warning": "#f5813f",
        primary: "#b88e2f",
      },
      spacing: {},
      fontFamily: {
        inter: "Inter",
        "nav-links": "Inter",
        poppins: "Poppins",
        "sale-price": "Inter",
        "body-medium": "Satoshi",
        "headings-h4": "Clash Display",
        "dm-sans": "'DM Sans'",
        h2: "Roboto",
      },
      borderRadius: {
        "3xs": "10px",
      },
    },
    fontSize: {
      smi: "13px",
      "31xl": "50px",
      base: "16px",
      inherit: "inherit",
      sm: "14px",
      xl: "20px",
      "3xs": "10px",
      lg: "18px",
    },
  },
  corePlugins: {
    preflight: false,
  },
};
export default config;
