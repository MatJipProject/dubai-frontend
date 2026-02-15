"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { PlaceData } from "@/types/kakao";

interface KakaoMapComponentProps {
  places: PlaceData[];
  onPlaceClick?: (place: PlaceData) => void;
  currentLocation?: { lat: number; lng: number } | null;
  focusPlace?: PlaceData | null;
}

// 맛집 핀 마커 (코랄)
const PLACE_PIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="42" viewBox="0 0 30 42">
  <path d="M15 40C15 40 28.5 25 28.5 15C28.5 7.54 22.46 1.5 15 1.5C7.54 1.5 1.5 7.54 1.5 15C1.5 25 15 40 15 40Z" fill="%23F87171" stroke="white" stroke-width="1.5"/>
  <circle cx="15" cy="15" r="5.5" fill="white"/>
  <circle cx="15" cy="15" r="2.5" fill="%23F87171"/>
</svg>`;

// 현재 위치 핀 마커 (블루 + 사람 아이콘)
const CURRENT_PIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="42" viewBox="0 0 30 42">
  <path d="M15 40C15 40 28.5 25 28.5 15C28.5 7.54 22.46 1.5 15 1.5C7.54 1.5 1.5 7.54 1.5 15C1.5 25 15 40 15 40Z" fill="%237DD3FC" stroke="white" stroke-width="1.5"/>
  <defs><clipPath id="cp"><circle cx="15" cy="15" r="5.5"/></clipPath></defs>
  <circle cx="15" cy="15" r="5.5" fill="white"/>
  <circle cx="15" cy="12.8" r="2" fill="%230EA5E9" clip-path="url(%23cp)"/>
  <ellipse cx="15" cy="19.5" rx="3.8" ry="2.8" fill="%230EA5E9" clip-path="url(%23cp)"/>
</svg>`;

function createMarkerImage(svg: string, w: number, h: number) {
  const uri = `data:image/svg+xml;charset=utf-8,${svg}`;
  return (kakao: any) =>
    new kakao.maps.MarkerImage(
      uri,
      new kakao.maps.Size(w, h),
      { offset: new kakao.maps.Point(w / 2, h) },
    );
}

const placeMarkerImage = createMarkerImage(PLACE_PIN_SVG, 30, 42);
const currentMarkerImage = createMarkerImage(CURRENT_PIN_SVG, 30, 42);

export default function KakaoMapComponent({
  places,
  onPlaceClick,
  currentLocation,
  focusPlace,
}: KakaoMapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const currentLocationMarkerRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [error, setError] = useState<string>("");

  // 지도 초기화 함수
  const initializeMap = useCallback(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    try {
      // 구로 디지털단지 기본 좌표
      const defaultLat = 37.4842;
      const defaultLng = 126.8959;

      const options = {
        center: new window.kakao.maps.LatLng(defaultLat, defaultLng),
        level: 4,
      };

      const map = new window.kakao.maps.Map(mapRef.current, options);
      mapInstanceRef.current = map;
      setIsLoading(false);
      setMapInitialized(true);
    } catch (err) {
      console.error("지도 생성 실패:", err);
      setError("지도를 생성할 수 없습니다.");
      setIsLoading(false);
    }
  }, []);

  // 카카오맵 스크립트 로드 및 지도 초기화
  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    // 이미 SDK가 로드되어 있는 경우
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        initializeMap();
      });
      return;
    }

    // 이미 스크립트 태그가 존재하는지 확인 (Strict Mode 이중 실행 방지)
    const existingScript = document.querySelector(
      'script[src*="dapi.kakao.com"]',
    );
    if (existingScript) {
      // 이미 스크립트가 있으면 로드 완료를 기다림 (최대 10초)
      let elapsed = 0;
      const checkLoaded = setInterval(() => {
        elapsed += 100;
        if (window.kakao && window.kakao.maps) {
          clearInterval(checkLoaded);
          window.kakao.maps.load(() => {
            initializeMap();
          });
        } else if (elapsed >= 10000) {
          clearInterval(checkLoaded);
          setError("카카오맵 스크립트 로드 시간이 초과되었습니다.");
          setIsLoading(false);
        }
      }, 100);

      return () => clearInterval(checkLoaded);
    }

    const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
    if (!apiKey) {
      setError(
        "카카오맵 API 키가 설정되지 않았습니다. .env.local 파일을 확인하세요.",
      );
      setIsLoading(false);
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        initializeMap();
      });
    };

    script.onerror = () => {
      console.error("카카오맵 스크립트 로드 실패");
      setError(
        "카카오맵을 불러올 수 없습니다. API 키와 도메인 설정을 확인하세요.",
      );
      setIsLoading(false);
    };

    document.head.appendChild(script);
    // Strict Mode에서 cleanup 시 스크립트를 제거하지 않음 (이중 로드 방지)
  }, [initializeMap]);

  // 현재 위치 마커 업데이트
  useEffect(() => {
    if (!mapInitialized || !mapInstanceRef.current || !currentLocation || !window.kakao) return;

    // 기존 현재 위치 마커 제거
    if (currentLocationMarkerRef.current) {
      currentLocationMarkerRef.current.setMap(null);
    }

    try {
      const currentMarker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(
          currentLocation.lat,
          currentLocation.lng,
        ),
        map: mapInstanceRef.current,
        image: currentMarkerImage(window.kakao),
      });

      currentLocationMarkerRef.current = currentMarker;

      // 지도 중심 이동
      mapInstanceRef.current.setCenter(
        new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
      );
    } catch (err) {
      console.error("현재 위치 마커 생성 실패:", err);
    }
  }, [currentLocation, mapInitialized]);

  // focusPlace 변경 시 해당 위치로 이동
  useEffect(() => {
    if (!mapInitialized || !mapInstanceRef.current || !focusPlace || !window.kakao) return;
    const position = new window.kakao.maps.LatLng(focusPlace.lat, focusPlace.lng);
    mapInstanceRef.current.setCenter(position);
    mapInstanceRef.current.setLevel(3);
  }, [focusPlace, mapInitialized]);

  // 장소 마커 업데이트
  useEffect(() => {
    if (!mapInitialized || !mapInstanceRef.current || !window.kakao || places.length === 0) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => {
      try {
        marker.setMap(null);
      } catch (e) {
        console.error("마커 제거 실패:", e);
      }
    });
    markersRef.current = [];

    // 새 마커 생성
    places.forEach((place) => {
      try {
        const markerPosition = new window.kakao.maps.LatLng(
          place.lat,
          place.lng,
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          map: mapInstanceRef.current,
          image: placeMarkerImage(window.kakao),
        });

        window.kakao.maps.event.addListener(marker, "click", () => {
          if (onPlaceClick) {
            onPlaceClick(place);
          }
          mapInstanceRef.current.setCenter(markerPosition);
        });

        markersRef.current.push(marker);
      } catch (err) {
        console.error("마커 생성 실패:", place.name, err);
      }
    });
  }, [places, onPlaceClick, mapInitialized]);

  return (
    <div className="w-full h-full relative min-h-[250px] sm:min-h-[300px] md:min-h-[400px]">
      {/* 지도 div는 항상 렌더링 (숨겨져 있어도 ref가 연결되어야 초기화 가능) */}
      <div
        ref={mapRef}
        className="w-full h-full min-h-[250px] sm:min-h-[300px] md:min-h-[400px]"
      />

      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-3 relative">
              <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
              <div className="absolute inset-0 rounded-full border-2 border-[#E8513D] border-t-transparent animate-spin" />
            </div>
            <p className="text-gray-500 text-sm font-medium">지도를 불러오는 중...</p>
          </div>
        </div>
      )}

      {/* 현재 위치로 이동 버튼 */}
      {mapInitialized && currentLocation && (
        <button
          onClick={() => {
            if (mapInstanceRef.current && window.kakao) {
              mapInstanceRef.current.setCenter(
                new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng)
              );
              mapInstanceRef.current.setLevel(4);
            }
          }}
          className="absolute bottom-5 right-4 z-10 w-11 h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white active:scale-90 transition-all"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)" }}
          aria-label="현재 위치로 이동"
        >
          <svg className="w-5 h-5 text-[#0EA5E9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2m0 16v2m10-10h-2M4 12H2" />
          </svg>
        </button>
      )}

      {/* 에러 오버레이 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50/80 backdrop-blur-sm">
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg mx-4 max-w-sm" style={{ border: "1px solid rgba(0,0,0,0.04)" }}>
            <div className="w-12 h-12 mx-auto mb-3 bg-red-50 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-900 text-sm font-bold mb-1">지도 로드 실패</p>
            <p className="text-gray-500 text-xs leading-relaxed">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
