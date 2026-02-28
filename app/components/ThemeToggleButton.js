"use client";

import { useTheme } from "../providers/ThemeProvider";

export default function ThemeToggleButton() {
  const { isDark, toggle } = useTheme();

  return (
    <div style={{ marginTop: "auto", paddingTop: "16px" }}>
      <button
        onClick={toggle}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "10px 14px",
          borderRadius: "12px",
          border: "1px solid var(--glass-border)",
          background: "var(--nav-item-bg)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: 500,
          color: "var(--text-primary)",
          transition: "all 0.18s ease",
          width: "100%",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--nav-item-hover)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--nav-item-bg)";
        }}
      >
        <div
          style={{
            width: "36px",
            height: "20px",
            borderRadius: "999px",
            background: isDark
              ? "linear-gradient(135deg, #6478ff, #a064ff)"
              : "rgba(180,180,200,0.35)",
            border: "1px solid var(--glass-border)",
            position: "relative",
            transition: "background 0.3s ease",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "2px",
              left: isDark ? "18px" : "2px",
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              background: "#fff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              transition: "left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          />
        </div>
        <span>{isDark ? "🌙 Dark" : "☀️ Light"}</span>
      </button>
    </div>
  );
}
