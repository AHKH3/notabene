import type { Metadata } from "next";
import { Titlebar } from "@/components/electron/titlebar";

export const metadata: Metadata = {
  title: "App",
  robots: { index: false, follow: false },
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Titlebar />
      {children}
    </>
  );
}
