"use client";

import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Inter } from "next/font/google";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

const inter = Inter({ subsets: ["latin"] });

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Mkaazi Navigator" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#4f46e5" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <MantineProvider
          defaultColorScheme="light"
          theme={{
            primaryColor: "blue",
            colors: {
              blue: [
                "#eef3ff",
                "#dbe8ff",
                "#bdd3ff",
                "#8bb5ff",
                "#598eff",
                "#3b6eff",
                "#1b4cff",
                "#0a38e6",
                "#092db3",
                "#0b268f",
              ],
            },
            components: {
              Button: {
                defaultProps: {
                  radius: "md",
                },
              },
              Card: {
                defaultProps: {
                  radius: "lg",
                  shadow: "sm",
                },
              },
            },
          }}
        >
          <Notifications position="top-right" />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}