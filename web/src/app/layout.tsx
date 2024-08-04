import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Overtake",
  description: "Your ultimate F1 companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
