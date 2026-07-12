import type { Metadata } from "next";
import "@/styles/globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "ReasonLayer -- AI Validator Intelligence Protocol",
  description:
    "AI-native validator intelligence and trust scoring on GenLayer. Powered by on-chain AI consensus.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-primary-text antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
