"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { PlaceData } from "@/types/kakao";

interface KakaoMapComponentProps {
  places: PlaceData[];
  onPlaceClick?: (place: PlaceData) => void;
  currentLocation?: { lat: number; lng: number } | null;
  onMapReady?: () => void;
}

export default function KakaoMapComponent({
  places,
  onPlaceClick,
  currentLocation,
  onMapReady,
}: KakaoMapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const currentLocationMarkerRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const onMapReadyRef = useRef(onMapReady);
  onMapReadyRef.current = onMapReady;
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
      onMapReadyRef.current?.();
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
      // 이미 스크립트가 있으면 로드 완료를 기다림
      const checkLoaded = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(checkLoaded);
          window.kakao.maps.load(() => {
            initializeMap();
          });
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
        image: new window.kakao.maps.MarkerImage(
          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
          new window.kakao.maps.Size(24, 35),
        ),
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
    <div className="w-full h-full relative" style={{ minHeight: "400px" }}>
      {/* 지도 div는 항상 렌더링 (숨겨져 있어도 ref가 연결되어야 초기화 가능) */}
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ minHeight: "400px" }}
      />

      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">지도를 불러오는 중...</p>
          </div>
        </div>
      )}

      {/* 에러 오버레이 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg">
          <div className="text-center p-6">
            <p className="text-red-600 text-lg font-semibold mb-2">
              지도 로드 실패
            </p>
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
