/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        site: "#F4F1EA",
        brand: "#1F7A83",
        brandSoft: "#DDF1EC",
        cardLine: "#D6DED9",
        softLine: "#BFD6D0",
        ink: "#17242B",
        body: "#475A5C",
        muted: "#6D7A7A",
        orangePoint: "#F2B84B",
      },
      boxShadow: {
        soft: "0 22px 70px rgba(23, 36, 43, 0.12)",
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "Noto Sans KR",
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
