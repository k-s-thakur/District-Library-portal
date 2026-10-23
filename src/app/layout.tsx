import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "District Public Library · Staff & Administration Portal",
  description: "Circulation desk, cataloguing, member management, fees and administrative oversight.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-slate-900 text-slate-100">
      <body className="min-h-full font-sans antialiased bg-slate-900 text-slate-100">
        {children}
      </body>
    </html>
  );
}
