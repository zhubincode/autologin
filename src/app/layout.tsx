import type { Metadata } from "next/types";
import "./globals.css";

export const metadata: Metadata = {
  title: "登录态注入工具",
  description: "一个简单的登录态注入工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
