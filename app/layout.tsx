import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mkaazi Navigator",
  description: "Legal access for Kenyan tenants & property buyers",
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