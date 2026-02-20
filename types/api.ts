// ── API 응답 타입 정의 ──

export interface RestaurantNearbyResponse {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  distance: number;
  rating: number;
  review_count: number;
  category?: string;
  road_address?: string;
  address?: string;
  phone?: string;
  place_url?: string;
  images?: string[];
  review_preview?: string;
}

export interface RestaurantDetailResponse {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  rating: number;
  review_count: number;
  category?: string;
  road_address?: string;
  address?: string;
  phone?: string;
  place_url?: string;
  images?: string[];
  description?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface UserResponse {
  nickname: string;
  email: string;
  birth: string;
  phone?: string;
}

export interface ReviewResponse {
  id: number;
  user_id: number;
  restaurant_id: number;
  rating: number;
  content: string;
  created_at: string;
  images?: string[];
  nickname?: string;
}

export interface UserCreate {
  username: string;
  password: string;
  birth: string;
  email: string;
  phone?: string;
}

export interface SearchRestaurantResponse {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  rating: number;
  review_count: number;
  category?: string;
  road_address?: string;
  address?: string;
  phone?: string;
  place_url?: string;
  images?: string[];
  review_preview?: string;
}

export interface RestaurantCreate {
  name: string;
  category: string;
  address: string;
  road_address?: string;
  phone?: string;
  latitude: number;
  longitude: number;
  description?: string;
}
