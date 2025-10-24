import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "국어 지문 기반 문제 자동 생성기",
  description: "AI를 활용한 국어 지문 기반 객관식 문제 자동 생성 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
