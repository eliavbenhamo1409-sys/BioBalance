import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BioBalance Admin",
  description: "מערכת ניהול BioBalance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className="antialiased bg-gray-50">
        {children}
      </body>
    </html>
  );
}
