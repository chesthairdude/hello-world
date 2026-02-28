"use client";

export default function AuthForm() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "420px",
        padding: "44px 40px",
        borderRadius: "28px",
        background: "var(--glass-bg)",
        backdropFilter: "blur(32px) saturate(180%)",
        WebkitBackdropFilter: "blur(32px) saturate(180%)",
        border: "1px solid var(--glass-border)",
        boxShadow: "var(--glass-highlight), var(--glass-shadow)",
        animation: "authCardIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
      }}
    >
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <p
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--text-tertiary)",
            marginBottom: "8px",
          }}
        >
          FunnyOrNot
        </p>
        <h1
          style={{
            fontSize: "26px",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
            lineHeight: 1.2,
            marginBottom: "8px",
          }}
        >
          Welcome back
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-secondary)",
            fontWeight: 400,
          }}
        >
          Sign in with Google to start voting
        </p>
      </div>

      <a
        href="/auth/login"
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "14px",
          border: "1px solid rgba(255,255,255,0.6)",
          background: "linear-gradient(135deg, rgba(100,120,255,0.85), rgba(140,100,255,0.85))",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          color: "#fff",
          fontSize: "15px",
          fontWeight: 600,
          letterSpacing: "-0.01em",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(100,120,255,0.3)",
          transition: "all 0.2s ease",
          fontFamily: "var(--font-geist-sans)",
          textDecoration: "none",
          textAlign: "center",
          display: "block",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        Continue with Google
      </a>
    </div>
  );
}
