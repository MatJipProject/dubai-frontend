# 내 주변 맛집 지도 🍽️

Next.js + TypeScript + Tailwind CSS + Kakao Map API

현재 위치 기반으로 주변 맛집을 찾아주는 웹 애플리케이션입니다.

## 🔑 카카오맵 API 키 발급 방법 (필수!)

### 1단계: 카카오 개발자 계정

1. **[Kakao Developers](https://developers.kakao.com/)** 접속
2. 카카오톡 계정으로 로그인
3. 처음이라면 회원가입 진행

### 2단계: 애플리케이션 등록

1. 우측 상단 **"내 애플리케이션"** 클릭
2. **"애플리케이션 추가하기"** 클릭
3. 정보 입력:
   - **앱 이름**: `맛집지도` (원하는 이름)
   - **회사명**: `개인` 또는 본인 이름
   - **카테고리**: `라이프스타일` 선택
4. **"저장"** 클릭

### 3단계: JavaScript 키 복사

1. 생성된 앱 클릭
2. 좌측 **"앱 키"** 메뉴 클릭
3. **"JavaScript 키"** 복사 
   - 예: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

### 4단계: 플랫폼 등록 (중요!)

1. 좌측 **"플랫폼"** 메뉴 클릭
2. **"Web 플랫폼 등록"** 클릭
3. 사이트 도메인 입력:
   ```
   http://localhost:3000
   ```
4. **"저장"** 클릭

### 5단계: 카카오 지도 활성화

1. 좌측 **"제품 설정" > "Kakao 지도"** 클릭
2. **"활성화 설정"** 탭에서 **"활성화"** 버튼 클릭

### 6단계: 프로젝트에 API 키 적용 ⭐

**`components/KakaoMap.tsx`** 파일을 열고:

```typescript
// 9번째 줄 근처에서 이 부분을 찾으세요:
script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_API_KEY&autoload=false&libraries=services`;

// 복사한 JavaScript 키로 교체:
script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6&autoload=false&libraries=services`;
```

## 🚀 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 브라우저에서 확인
```
http://localhost:3000
```

**⚠️ 주의**: 처음 접속 시 브라우저에서 "위치 정보 접근 권한"을 허용해주세요!

## ✨ 주요 기능

- 📍 **현재 위치 자동 감지** - GPS를 사용하여 내 위치 파악
- 🗺️ **카카오맵 연동** - 실시간 지도 표시
- 🍽️ **주변 맛집 표시** - 현재 위치 기반 맛집 마커
- 📏 **거리 계산** - 맛집까지의 거리 표시
- 🎨 **반응형 디자인** - 모바일/태블릿/PC 모두 지원
- ⭐ **현재 위치 마커** - 별 모양 마커로 내 위치 표시

## 📁 프로젝트 구조

```
map-project/
├── app/
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 메인 페이지 (현재 위치 감지)
│   └── globals.css         # 전역 스타일
├── components/
│   ├── KakaoMap.tsx        # 카카오맵 컴포넌트 (위치 기반)
│   └── PlaceList.tsx       # 맛집 목록 컴포넌트
└── types/
    └── kakao.d.ts          # 타입 정의
```

## 🎨 커스터마이징

### 맛집 데이터 추가

`app/page.tsx`의 `sampleRestaurants` 배열에 맛집 추가:

```typescript
{
  id: 6,
  name: '새로운 맛집',
  lat: 37.5665,
  lng: 126.9780,
  category: '한식',  // 한식, 중식, 일식, 양식 등
  description: '맛집 설명',
}
```

### 카테고리 이모지 변경

`components/PlaceList.tsx`의 `categoryEmojis` 수정:

```typescript
const categoryEmojis = {
  '한식': '🍚',
  '중식': '🥟',
  '새카테고리': '🍕',
};
```

## 🔧 문제 해결

### ❌ 지도가 안 보이는 경우

1. ✅ API 키가 올바르게 입력되었는지 확인
2. ✅ 플랫폼에 `http://localhost:3000` 등록 확인
3. ✅ 카카오 지도 활성화 확인
4. ✅ 브라우저 콘솔(F12)에서 에러 확인

### ❌ 위치 정보를 못 가져오는 경우

1. ✅ 브라우저 설정에서 위치 권한 허용
2. ✅ HTTPS 환경에서 실행 (로컬은 HTTP도 가능)
3. ✅ 위치 서비스가 활성화되어 있는지 확인

### ❌ 마커가 안 보이는 경우

1. ✅ 위도/경도 값 확인
2. ✅ 지도 레벨(줌) 조정
3. ✅ 콘솔에서 JavaScript 에러 확인

## 📱 브라우저 지원

- Chrome (권장)
- Safari
- Firefox
- Edge

## 🌐 배포

Vercel, Netlify 등에 배포 시:
1. 카카오 개발자 콘솔에서 배포 도메인 추가
2. 환경 변수로 API 키 관리 권장

## 📄 라이선스

MIT License
