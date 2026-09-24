import type { Metadata } from "next";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

export const metadata: Metadata = {
  title: "Daily Network Test",
  description:
    "Check whether your browser and network can connect to Daily calls.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ background: "var(--gray-a2" }}>
        <Theme>{children}</Theme>
      </body>
    </html>
  );
}
