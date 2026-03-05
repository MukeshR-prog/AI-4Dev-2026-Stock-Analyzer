"use client";

import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function TopBar() {
  const { profile, logout } = useAuth();

  if (!profile) return null;

  return (
    <header className="fixed left-64 right-0 top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-card px-8">
      {/* Page context */}
      <div>
        <p className="text-sm text-muted-foreground">
          {profile.company} &middot; {profile.branch}
        </p>
      </div>

      {/* User info */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground leading-tight">
            {profile.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {profile.role.replace("_", " ")}
          </p>
        </div>

        {profile.photoURL ? (
          <Image
            src={profile.photoURL}
            alt=""
            width={36}
            height={36}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {profile.name[0]?.toUpperCase() || "U"}
          </div>
        )}

        <button
          onClick={logout}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
