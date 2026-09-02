import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Escort matching | KakiMETch",
  description: "Internal escort matching for Loving Heart administrators.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
