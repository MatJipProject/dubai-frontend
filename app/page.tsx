"use client";

import { useState, useEffect, useCallback } from "react";
import KakaoMapComponent from "@/components/KakaoMap";
import PlaceDetailCard from "@/components/PlaceDetailCard";
import { dummyPlaces } from "@/data/dummyPlaces";
import type { PlaceData } from "@/types/kakao";

const HEADER_HEIGHT = 48;

const tabs = ["홈", "맛집 지도", "맛집 목록", "마이"] as const;
type Tab = (typeof tabs)[number];

export default function Home() {
  const [selectedPlace, setSelectedPlace] = useState<PlaceData | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("맛집 지도");

  // 탭 전환 시 선택된 장소 초기화
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSelectedPlace(null);
  };

  // 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        () => {
          setCurrentLocation({ lat: 37.4842, lng: 126.8959 });
        },
      );
    } else {
      setCurrentLocation({ lat: 37.4842, lng: 126.8959 });
    }
  }, []);

  const handleMapReady = useCallback(() => {}, []);

  return (
    <main className="h-screen flex flex-col overflow-hidden">
      {/* 헤더 */}
      <header
        className="bg-white border-b border-gray-200 flex items-center px-6 shrink-0"
        style={{ height: HEADER_HEIGHT }}
      >
        <h1 className="text-[25px] font-bold text-red-500 mr-10 tracking-wide">
          배부룩
        </h1>
        <nav className="flex items-center gap-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`text-sm font-medium transition-colors ${
                tab === activeTab
                  ? "text-red-500"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      {/* 콘텐츠 영역 */}
      {activeTab === "맛집 지도" ? (
        <div className="relative flex-1">
          <KakaoMapComponent
            places={dummyPlaces}
            onPlaceClick={setSelectedPlace}
            currentLocation={currentLocation}
            onMapReady={handleMapReady}
          />

          {/* 마커 클릭 시 플로팅 팝업 카드 */}
          {selectedPlace && (
            <PlaceDetailCard
              place={selectedPlace}
              onClose={() => setSelectedPlace(null)}
            />
          )}
        </div>
      ) : (
        <div className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-300 mb-2">{activeTab}</p>
            <p className="text-sm text-gray-400">준비 중입니다</p>
          </div>
        </div>
      )}
    </main>
  );
}
