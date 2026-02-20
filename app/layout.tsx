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
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "mobile-web-app-capable": "yes",
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" />
        <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" async></script>
      </head>
      <body className="overscroll-none">{children}</body>
    </html>
  );
}
