export interface PlaceData {
  id: number | string;
  name: string;
  lat: number;
  lng: number;
  category: string;
  description: string;
  address?: string;
  phone?: string;
  distance?: string;
  rating?: number;
  reviewCount?: number;
  review?: string;
  link?: string;
  images?: string[];
}

declare global {
  interface Window {
    kakao: any;
  }
}

export {};
