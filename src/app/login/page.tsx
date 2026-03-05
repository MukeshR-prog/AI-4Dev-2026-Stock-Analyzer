"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { isSetupComplete } from "@/lib/auth";

export default function LoginPage() {
  const { firebaseUser, loading, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  // If already signed in, redirect
  useEffect(() => {
    if (!loading && firebaseUser) {
      if (isSetupComplete()) {
        router.replace("/dashboard");
      } else {
        router.replace("/setup");
      }
    }
  }, [loading, firebaseUser, router]);

  const handleGoogleLogin = async () => {
    setError("");
    setSigningIn(true);
    try {
      await signInWithGoogle();
      // After sign-in, check if profile setup is done
      if (isSetupComplete()) {
        router.push("/dashboard");
      } else {
        router.push("/setup");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign-in failed";
      setError(msg);
      setSigningIn(false);
    }
  };

  if (loading || (!loading && firebaseUser)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
            RI
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Retail Intelligence Platform
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Reduce waste. Optimise inventory. Smarter retail.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          {error && (
            <div className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={signingIn}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-accent hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {signingIn ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                Signing in…
              </span>
            ) : (
              <>
                <FcGoogle className="h-5 w-5" />
                Continue with Google
              </>
            )}
          </button>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            Sign in to access your store dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
