// 개별 리뷰 (API 응답 구조 대비)
export interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  date: string;
  helpful?: number;
}

// 맛집 데이터 (API 응답 구조 대비)
export interface PlaceData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: string;
  description: string;
  address?: string;
  phone?: string;
  rating?: number;         // 평균 별점
  reviewCount?: number;    // 총 리뷰 수
  review?: string;         // 대표 리뷰 (한 줄 요약)
  reviews?: Review[];      // 개별 리뷰 목록
  link?: string;
  images?: string[];
  tags?: string[];         // 필터링용 태그
  priceRange?: string;     // 가격대 ("₩" ~ "₩₩₩₩")
  openHours?: string;      // 영업시간
  isHot?: boolean;         // 핫플레이스 여부
  area?: string;           // 지역 구분 (구로, 강남, 합정 등)
}

declare global {
  interface Window {
    kakao: any;
  }
}

export {};
