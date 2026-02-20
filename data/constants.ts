// 공통 상수 (여러 컴포넌트에서 공유)
import type { PlaceData } from "@/types/kakao";

// ── 레이아웃 ──
export const HEADER_HEIGHT = 56;
export const BOTTOM_NAV_HEIGHT = 56;

// ── 탭 ──
export const tabs = ["홈", "맛집 지도", "메뉴 추천", "맛집 목록", "마이"] as const;
export type Tab = (typeof tabs)[number];

export const tabHashMap: Record<Tab, string> = {
  "홈": "",
  "맛집 지도": "map",
  "메뉴 추천": "roulette",
  "맛집 목록": "list",
  "마이": "my",
};

export const hashTabMap = Object.fromEntries(
  Object.entries(tabHashMap).map(([k, v]) => [v, k as Tab]),
) as Record<string, Tab>;

export const tabLabels: Record<Tab, string> = {
  "홈": "홈",
  "맛집 지도": "지도",
  "메뉴 추천": "추천",
  "맛집 목록": "목록",
  "마이": "마이",
};

// ── 지역 / 카테고리 ──
export const regions = [
  "전체", "구로", "강남", "합정", "한남", "이태원", "성수", "을지로", "서초", "신사", "청담", "용산",
];

export const categories = ["전체", "한식", "양식", "일식", "오마카세", "카페"];

export const categoryEmojis: Record<string, string> = {
  "오마카세": "🍣",
  "한식": "🍖",
  "양식": "🍝",
  "일식": "🍱",
  "카페": "☕",
};

export function getCategoryEmoji(category: string): string {
  return categoryEmojis[category] || "🍽️";
}

// ── 히어로 슬라이드 설정 ──
export const hotPlaceConfigs = [
  { placeId: "102", emoji: "🫙", gradientFrom: "#78350F", gradientTo: "#B45309", tag: "40년 전통" },
  { placeId: "1", emoji: "🍣", gradientFrom: "#E8513D", gradientTo: "#F2734E", tag: "예약 필수" },
  { placeId: "6", emoji: "🍽️", gradientFrom: "#1E1B4B", gradientTo: "#312E81", tag: "미쉐린 2스타" },
  { placeId: "101", emoji: "🍜", gradientFrom: "#065F46", gradientTo: "#10B981", tag: "구로 핫플" },
  { placeId: "2", emoji: "🥩", gradientFrom: "#92400E", gradientTo: "#D97706", tag: "숯불 맛집" },
  { placeId: "105", emoji: "🍣", gradientFrom: "#0C4A6E", gradientTo: "#0284C7", tag: "가성비 초밥" },
  { placeId: "3", emoji: "🍝", gradientFrom: "#064E3B", gradientTo: "#059669", tag: "파인다이닝" },
];

// ── 홈 메뉴 카테고리 ──
export const menuCategories = [
  { name: "파스타", emoji: "🍝", color: "#F87171" },
  { name: "한식", emoji: "🍚", color: "#FB923C" },
  { name: "돈까스/우동", emoji: "🍛", color: "#FBBF24" },
  { name: "양식", emoji: "🍕", color: "#34D399" },
  { name: "카페", emoji: "☕", color: "#60A5FA" },
  { name: "치킨", emoji: "🍗", color: "#A78BFA" },
];

// ── 룰렛 카테고리 + 메뉴 ──
export interface MenuCategory {
  name: string;
  emoji: string;
  menus: string[];
}

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    name: "한식",
    emoji: "🍚",
    menus: ["김치찌개", "된장찌개", "비빔밥", "불고기", "삼겹살", "갈비탕", "냉면", "제육볶음"],
  },
  {
    name: "중식",
    emoji: "🥟",
    menus: ["짜장면", "짬뽕", "탕수육", "마파두부", "볶음밥", "깐풍기", "양장피", "마라탕"],
  },
  {
    name: "일식",
    emoji: "🍣",
    menus: ["초밥", "라멘", "우동", "돈카츠", "카레", "사시미", "오코노미야끼", "소바"],
  },
  {
    name: "양식",
    emoji: "🍝",
    menus: ["파스타", "스테이크", "리조또", "피자", "햄버거", "오믈렛", "그라탕", "샐러드"],
  },
  {
    name: "분식",
    emoji: "🍜",
    menus: ["떡볶이", "순대", "김밥", "라볶이", "튀김", "어묵", "쫄면", "비빔국수"],
  },
  {
    name: "카페/디저트",
    emoji: "☕",
    menus: ["아메리카노", "카페라떼", "케이크", "마카롱", "와플", "빙수", "스무디", "크로플"],
  },
  {
    name: "치킨",
    emoji: "🍗",
    menus: ["후라이드", "양념치킨", "간장치킨", "마늘치킨", "허니버터", "불닭", "반반치킨", "순살치킨"],
  },
  {
    name: "야식",
    emoji: "🌙",
    menus: ["족발", "보쌈", "곱창", "회", "닭발", "떡볶이", "라면", "치즈볼"],
  },
];

// ── 룰렛 세그먼트 색상 ──
export const SEGMENT_COLORS = [
  "#F87171", "#FB923C", "#FBBF24", "#34D399",
  "#60A5FA", "#A78BFA", "#F472B6", "#38BDF8",
];

// ── 유틸 함수 ──
export function filterByArea(places: PlaceData[], area: string) {
  if (area === "전체") return places;
  return places.filter((p) => p.area === area);
}
