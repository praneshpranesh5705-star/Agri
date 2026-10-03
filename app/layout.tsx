import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgriConnect | Smart Agriculture Portal",
  description: "A modern agriculture portal for crop information, weather and market insights.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
