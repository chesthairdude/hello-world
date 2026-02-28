"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

function friendlyAuthError(message) {
  const text = String(message || "").toLowerCase();
  if (text.includes("invalid login")) {
    return "Email or password is incorrect.";
  }
  if (text.includes("email not confirmed")) {
    return "Please confirm your email before signing in.";
  }
  if (text.includes("already registered")) {
    return "This email is already registered. Try signing in instead.";
  }
  if (text.includes("password")) {
    return "Password must meet the minimum requirements.";
  }
  return "Authentication failed. Please try again.";
}

const baseInputStyle = {
  width: "100%",
  padding: "13px 16px",
  borderRadius: "12px",
  border: "1px solid var(--input-border)",
  background: "var(--input-bg)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  fontSize: "14px",
  fontWeight: 500,
  color: "var(--text-primary)",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "var(--font-geist-sans)",
  transition: "border 0.2s ease, box-shadow 0.2s ease",
};

export default function AuthForm() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingAction, setLoadingAction] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleSignIn() {
    setError("");
    setNotice("");
    setLoadingAction("signin");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(friendlyAuthError(signInError.message));
      setLoadingAction("");
      return;
    }

    router.push("/vote");
    router.refresh();
  }

  async function handleSignUp() {
    setError("");
    setNotice("");
    setLoadingAction("signup");

    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (signUpError) {
      setError(friendlyAuthError(signUpError.message));
      setLoadingAction("");
      return;
    }

    setNotice("Account created. You can now sign in.");
    setLoadingAction("");
  }

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
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: 400 }}>
          Sign in or create an account to start voting
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          style={baseInputStyle}
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          style={baseInputStyle}
        />
      </div>

      <button
        type="button"
        onClick={handleSignIn}
        disabled={loadingAction !== ""}
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
          cursor: loadingAction ? "not-allowed" : "pointer",
          marginBottom: "10px",
          boxShadow: "0 4px 20px rgba(100,120,255,0.3)",
          transition: "all 0.2s ease",
          fontFamily: "var(--font-geist-sans)",
          opacity: loadingAction ? 0.7 : 1,
        }}
      >
        {loadingAction === "signin" ? "Signing in..." : "Sign In"}
      </button>

      <button
        type="button"
        onClick={handleSignUp}
        disabled={loadingAction !== ""}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "14px",
          border: "1px solid rgba(180,180,210,0.4)",
          background: "rgba(255,255,255,0.35)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          color: "#555",
          fontSize: "15px",
          fontWeight: 600,
          letterSpacing: "-0.01em",
          cursor: loadingAction ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          fontFamily: "var(--font-geist-sans)",
          opacity: loadingAction ? 0.7 : 1,
        }}
      >
        {loadingAction === "signup" ? "Creating account..." : "Create Account"}
      </button>

      {notice ? (
        <div
          style={{
            marginTop: "16px",
            padding: "12px 16px",
            borderRadius: "12px",
            background: "rgba(76,222,128,0.12)",
            border: "1px solid rgba(76,222,128,0.35)",
            color: "#2f9a5a",
            fontSize: "13px",
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          {notice}
        </div>
      ) : null}

      {error ? (
        <div
          style={{
            marginTop: "16px",
            padding: "12px 16px",
            borderRadius: "12px",
            background: "rgba(255,68,88,0.08)",
            border: "1px solid rgba(255,68,88,0.25)",
            color: "#FF4458",
            fontSize: "13px",
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          {error}
        </div>
      ) : null}
    </div>
  );
}
