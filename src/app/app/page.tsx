"use client";

import { StoreProvider } from "@/components/app/store";
import { CuratorProvider } from "@/components/app/curator-context";
import { AppShell } from "@/components/app/app-shell";

export default function AppPage() {
  return (
    <StoreProvider>
      <CuratorProvider>
        <AppShell />
      </CuratorProvider>
    </StoreProvider>
  );
}
