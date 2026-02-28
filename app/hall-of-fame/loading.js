export default function Loading() {
  return (
    <main
      style={{
        marginLeft: "220px",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-gradient)",
      }}
    >
      <div
        style={{
          width: "420px",
          height: "600px",
          borderRadius: "20px",
          background: "var(--glass-bg)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          border: "1px solid var(--glass-border)",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
    </main>
  );
}
