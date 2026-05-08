/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        site: "#F8FAF9",
        brand: "#2F9E8F",
        brandSoft: "#EAF7F4",
        cardLine: "#D9EBE7",
        softLine: "#CFE7E2",
        ink: "#20302D",
        body: "#526763",
        muted: "#6A7B78",
        orangePoint: "#FFE8D1",
      },
      boxShadow: {
        soft: "0 20px 60px rgba(32, 48, 45, 0.08)",
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
