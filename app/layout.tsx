import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "배부룩 - 서울 맛집 지도",
  description: "배부룩이 큐레이팅한 서울 맛집 지도. 지역별 맛집 탐색, 메뉴 추천 룰렛, 실시간 리뷰까지.",
  openGraph: {
    title: "배부룩 - 서울 맛집 지도",
    description: "배부룩이 큐레이팅한 서울 맛집 지도. 지역별 맛집 탐색, 메뉴 추천 룰렛, 실시간 리뷰까지.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>{children}</body>
    </html>
  );
}
