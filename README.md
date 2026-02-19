# 배부룩 - 서울 맛집 지도

> 큐레이팅된 서울 맛집을 한눈에. 지도 탐색, 메뉴 추천 룰렛, 실시간 리뷰까지.

**[https://www.baebulook.site](https://www.baebulook.site/)**

## Tech Stack

| 분류 | 기술 |
|------|------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 3.4 |
| **Map** | Kakao Maps JavaScript SDK |
| **Carousel** | Swiper.js 12 |
| **Auth** | JWT (Bearer Token), localStorage |
| **API** | REST API (`api.baebulook.site`) |
| **Deploy** | Vercel |

## Architecture

```
Single Page App (Tab-based Routing via URL Hash)
├── 홈         (#)        → 큐레이팅 랜딩 페이지
├── 맛집 지도   (#map)     → Kakao Maps + 마커 클러스터링
├── 메뉴 추천   (#roulette) → SVG 룰렛 휠 애니메이션
├── 맛집 목록   (#list)     → 검색/필터/정렬 리스트
└── 마이        (#my)       → 인증 (로그인/회원가입/프로필)
```

### 주요 설계 결정

- **하이브리드 데이터 소스**: 홈페이지는 큐레이팅된 정적 데이터, 지도/목록은 API 연동 가능 구조
- **컴포넌트 분리**: Header, BottomNav, 각 탭 콘텐츠를 독립 컴포넌트로 분리하여 코드 스플리팅 최적화
- **URL Hash 라우팅**: SPA 내 탭 전환을 URL hash로 관리하여 브라우저 뒤로가기/공유 링크 지원
- **모바일 퍼스트**: `100dvh`, safe-area-inset, touch-action 최적화, iOS 입력 확대 방지

## Features

### 홈페이지
- 히어로 배너 (Swiper fade effect + 자동 재생)
- 지역별 맛집 탐색 (클릭 시 지도 탭으로 이동 + 해당 지역 중심 좌표 계산)
- 메뉴 카테고리 그리드
- 저장된 맛집 캐러셀 (dynamic pagination)
- 실시간 리뷰 무한 마퀴 (양방향)
- 통계 카운트업 애니메이션 (Intersection Observer)
- 주간 맛집 TOP 5 랭킹 (프로그레스 바 애니메이션)

### 맛집 지도
- Kakao Maps SDK 동적 로딩 (autoload=false)
- 현재 위치 자동 감지 (Geolocation API)
- 커스텀 SVG 마커 (장소/현재 위치 구분)
- 지역 필터링 (평균 좌표 기반 자동 센터링)
- 장소 클릭 시 상세 카드 (모바일 바텀시트 / 데스크탑 사이드패널)

### 메뉴 추천 룰렛
- SVG 기반 룰렛 휠 (카테고리별 세그먼트)
- CSS transition 기반 스핀 애니메이션 (cubic-bezier 감속)
- 반응형 휠 크기 (useWheelSize 훅)
- 결과 → 맛집 목록 연계 검색

### 맛집 목록
- 실시간 검색 (이름, 카테고리, 태그, 주소)
- 다중 필터 (지역 + 카테고리)
- 정렬 (별점순, 리뷰순, 이름순)

### 인증
- JWT 기반 로그인/회원가입
- localStorage 토큰 관리
- 로그인 상태 헤더 반영

## Project Structure

```
├── app/
│   ├── layout.tsx              # RootLayout (viewport, meta, PWA)
│   ├── page.tsx                # 탭 라우터 + 상태 관리
│   └── globals.css             # 애니메이션, safe-area, 마퀴
├── components/
│   ├── Header.tsx              # 헤더 (데스크탑 탭 + 모바일 탭명)
│   ├── BottomNav.tsx           # 모바일 하단 네비게이션
│   ├── HomePage.tsx            # 홈 탭 (히어로, 통계, 랭킹, 리뷰)
│   ├── KakaoMap.tsx            # 카카오맵 (마커, 포커스, 현재위치)
│   ├── PlaceDetailCard.tsx     # 장소 상세 바텀시트/사이드패널
│   ├── PlaceListPage.tsx       # 맛집 목록 (검색, 필터, 정렬)
│   ├── MenuRoulette.tsx        # 메뉴 추천 룰렛
│   ├── MyPage.tsx              # 로그인/회원가입/프로필
│   └── StarRating.tsx          # 별점 컴포넌트
├── hooks/
│   ├── useAuth.ts              # 인증 상태 관리 훅
│   ├── useWheelSize.ts         # 반응형 룰렛 크기 훅
│   ├── useCountUp.ts           # 카운트업 애니메이션 훅
│   └── useScrollReveal.ts      # 스크롤 트리거 애니메이션 훅
├── data/
│   ├── constants.ts            # 탭, 지역, 카테고리, 히어로 설정
│   └── dummyPlaces.ts          # 큐레이팅 맛집 데이터
├── types/
│   ├── kakao.d.ts              # PlaceData, Review, Kakao SDK 타입
│   └── api.ts                  # API 요청/응답 타입
├── utils/
│   ├── api.ts                  # API 클라이언트 (fetch wrapper)
│   ├── mappers.ts              # API ↔ PlaceData 변환
│   └── svg.ts                  # SVG 마커 생성 + arc 유틸
└── tailwind.config.ts          # Tailwind 설정 (data/ 포함)
```

## Getting Started

### 환경 변수 설정

```bash
# .env.local
NEXT_PUBLIC_KAKAO_MAP_KEY=your_kakao_javascript_key
```

> Kakao JavaScript 키는 [Kakao Developers](https://developers.kakao.com/) > 내 애플리케이션 > 앱 키에서 발급

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버
npm run dev

# 프로덕션 빌드
npm run build && npm start
```

### Kakao Maps 플랫폼 등록

카카오 개발자 콘솔 > 플랫폼 > Web에 도메인 추가:

```
http://localhost:3000
https://www.baebulook.site
```

## Design System

| 요소 | 값 |
|------|-----|
| Brand Color | `#E8513D` (coral red) |
| Gradient | `#E8513D → #F97316` |
| Card Shadow | `0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)` |
| Glassmorphism | `bg-white/80 backdrop-blur-xl` |
| Border Radius | `rounded-2xl` (cards), `rounded-full` (pills) |
| Font | System font stack (-apple-system, BlinkMacSystemFont, ...) |

## Mobile Optimization

- `h-[100dvh]` — 모바일 브라우저 주소창 대응
- `viewport-fit=cover` + `safe-area-inset-*` — 노치/다이나믹 아일랜드 대응
- `maximum-scale=1` — iOS 더블탭 줌 방지
- `font-size: 16px` on inputs — iOS 자동 확대 방지
- `touch-action: manipulation` — 300ms 탭 딜레이 제거
- `-webkit-tap-highlight-color: transparent` — 탭 하이라이트 제거
- `overscroll-behavior: none` — pull-to-refresh 간섭 방지
- 최소 터치 타겟 44px (버튼, 네비게이션)

## License

MIT License
