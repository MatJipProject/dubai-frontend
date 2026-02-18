"use client";

import { useState, useEffect, useCallback } from "react";
import KakaoMapComponent from "@/components/KakaoMap";
import PlaceDetailCard from "@/components/PlaceDetailCard";
import MenuRoulette from "@/components/MenuRoulette";
import PlaceListPage from "@/components/PlaceListPage";
import HomePage from "@/components/HomePage";
import MyPage from "@/components/MyPage";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { dummyPlaces } from "@/data/dummyPlaces";
import { tabHashMap, hashTabMap } from "@/data/constants";
import type { Tab } from "@/data/constants";
import type { PlaceData } from "@/types/kakao";
import { useAuth } from "@/hooks/useAuth";

// Swiper CSS를 최상위에서 로드 (HomePage 렌더 전 스타일 적용 보장)
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function Home() {
  const [selectedPlace, setSelectedPlace] = useState<PlaceData | null>(null);
  const [focusPlace, setFocusPlace] = useState<PlaceData | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("홈");
  const [listSearch, setListSearch] = useState("");
  const [mapFilterRegion, setMapFilterRegion] = useState("전체");

  // 인증 상태
  const auth = useAuth();

  // URL hash → 초기 탭 설정
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && hashTabMap[hash]) {
      setActiveTab(hashTabMap[hash]);
    }
    const onHashChange = () => {
      const h = window.location.hash.replace("#", "");
      if (h !== undefined && hashTabMap[h] !== undefined) {
        setActiveTab(hashTabMap[h]);
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
    setSelectedPlace(null);
    if (tab !== "맛집 지도") setMapFilterRegion("전체");
    const hash = tabHashMap[tab];
    window.history.replaceState(null, "", hash ? `#${hash}` : window.location.pathname);
  }, []);

  const handleNavigateToPlace = useCallback((place: PlaceData) => {
    setActiveTab("맛집 지도");
    setSelectedPlace(place);
    setFocusPlace(place);
    window.history.replaceState(null, "", "#map");
  }, []);

  const handleMapPlaceClick = useCallback((place: PlaceData) => {
    setSelectedPlace(place);
    setFocusPlace(place);
  }, []);

  const handleFindPlaces = useCallback((menu: string) => {
    setListSearch(menu);
    setActiveTab("맛집 목록");
    window.history.replaceState(null, "", "#list");
  }, []);

  const handleNavigateToRegion = useCallback((region: string) => {
    setMapFilterRegion(region);
    setActiveTab("맛집 지도");
    setSelectedPlace(null);
    window.history.replaceState(null, "", "#map");

    // 해당 지역 맛집들의 중심 좌표 계산
    const regionPlaces = dummyPlaces.filter((p) => p.area === region);
    if (regionPlaces.length > 0) {
      const avgLat = regionPlaces.reduce((sum, p) => sum + p.lat, 0) / regionPlaces.length;
      const avgLng = regionPlaces.reduce((sum, p) => sum + p.lng, 0) / regionPlaces.length;
      setFocusPlace({ id: "center", name: region, lat: avgLat, lng: avgLng, category: "", description: "" });
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        () => {
          setCurrentLocation({ lat: 37.4955, lng: 126.8875 });
        },
      );
    } else {
      setCurrentLocation({ lat: 37.4955, lng: 126.8875 });
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "홈":
        return <HomePage onNavigateToPlace={handleNavigateToPlace} onTabChange={handleTabChange} onNavigateToRegion={handleNavigateToRegion} />;
      case "맛집 지도": {
        const mapPlaces = mapFilterRegion === "전체"
          ? dummyPlaces
          : dummyPlaces.filter((p) => p.area === mapFilterRegion);
        return (
          <div className="relative flex-1">
            {mapFilterRegion !== "전체" && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 bg-white/95 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full shadow-md border border-gray-100">
                <svg className="w-3.5 h-3.5 text-[#E8513D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs font-bold text-gray-700">{mapFilterRegion}</span>
                <span className="text-[10px] text-gray-400">{mapPlaces.length}곳</span>
                <button
                  onClick={() => setMapFilterRegion("전체")}
                  className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors ml-0.5"
                >
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            <KakaoMapComponent
              places={mapPlaces}
              onPlaceClick={handleMapPlaceClick}
              currentLocation={currentLocation}
              focusPlace={focusPlace}
            />
            {selectedPlace && (
              <PlaceDetailCard
                place={selectedPlace}
                onClose={() => setSelectedPlace(null)}
                isLoggedIn={auth.isLoggedIn}
              />
            )}
          </div>
        );
      }
      case "메뉴 추천":
        return <MenuRoulette onFindPlaces={handleFindPlaces} />;
      case "맛집 목록":
        return (
          <PlaceListPage
            places={dummyPlaces}
            onPlaceClick={handleNavigateToPlace}
            initialSearch={listSearch}
          />
        );
      case "마이":
        return (
          <MyPage
            user={auth.user}
            isLoggedIn={auth.isLoggedIn}
            onLogin={auth.login}
            onSignup={auth.signup}
            onLogout={auth.logout}
          />
        );
      default:
        return (
          <div className="flex-1 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-300 mb-2">
                {activeTab}
              </p>
              <p className="text-sm text-gray-400">준비 중입니다</p>
            </div>
          </div>
        );
    }
  };

  return (
    <main className="h-[100dvh] flex flex-col overflow-hidden">
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        user={auth.user}
        isLoggedIn={auth.isLoggedIn}
      />
      <div key={activeTab} className="flex-1 flex flex-col overflow-hidden tab-content-enter">
        {renderContent()}
      </div>
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </main>
  );
}
