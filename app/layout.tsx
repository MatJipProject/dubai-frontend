import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "내 주변 맛집 지도",
  description: "현재 위치 기반 맛집 찾기 - Next.js와 Kakao Map",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
