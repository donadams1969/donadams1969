import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Super Duper Valor Ai+®️©️™️ OS // v.OMEGA_VALORCHAIN",
  description: "Sovereign Throne Room Interface",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}