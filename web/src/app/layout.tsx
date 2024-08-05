import type { Metadata } from "next";
import "./globals.css";
import { IdentityProvider } from "./lib/context/identity";

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
      <body>
        <IdentityProvider>{children}</IdentityProvider>
      </body>
    </html>
  );
}
