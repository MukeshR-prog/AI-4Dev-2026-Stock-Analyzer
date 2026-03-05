"use client";

import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";

export default function TopBar() {
  const { profile, logout } = useAuth();

  if (!profile) return null;

  return (
    <header className="fixed left-64 right-0 top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-8">
      {/* Page context */}
      <div>
        <p className="text-sm text-muted-foreground">
          {profile.company} <span className="mx-1 text-border">/</span> {profile.branch}
        </p>
      </div>

      {/* User info */}
      <div className="flex items-center gap-3">
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
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {profile.name[0]?.toUpperCase() || "U"}
          </div>
        )}

        <button
          onClick={logout}
          className="ml-1 flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </button>
      </div>
    </header>
  );
}
