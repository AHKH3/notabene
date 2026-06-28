import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "App",
  // The app screen is interactive and personal — keep it out of search results.
  robots: { index: false, follow: false },
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
