"use client";

import { useState, useEffect, useRef } from "react";
import { dummyPlaces } from "@/data/dummyPlaces";
import { regions, getCategoryEmoji, hotPlaceConfigs, menuCategories, filterByArea } from "@/data/constants";
import type { Tab } from "@/data/constants";
import type { PlaceData } from "@/types/kakao";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";

interface HomePageProps {
  onNavigateToPlace: (place: PlaceData) => void;
  onTabChange: (tab: Tab) => void;
  onNavigateToRegion?: (region: string) => void;
}

export default function HomePage({ onNavigateToPlace, onTabChange, onNavigateToRegion }: HomePageProps) {
  const [heroVisible, setHeroVisible] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const regionScrollRef = useRef<HTMLDivElement>(null);

  // 스크롤 애니메이션 refs
  const statsReveal = useScrollReveal();
  const rankReveal = useScrollReveal();
  const reviewTickerReveal = useScrollReveal();

  // 통계 카운트업
  const totalPlaces = useCountUp(dummyPlaces.length, 1500, statsReveal.revealed);
  const totalReviews = useCountUp(
    dummyPlaces.reduce((sum, p) => sum + (p.reviewCount || 0), 0),
    2000,
    statsReveal.revealed,
  );
  const avgRating = useCountUp(46, 1200, statsReveal.revealed); // 4.6 x 10
  const totalAreas = useCountUp(
    new Set(dummyPlaces.map((p) => p.area)).size,
    1000,
    statsReveal.revealed,
  );

  // 랭킹 데이터 (리뷰 수 기준 TOP 5)
  const topRanked = [...dummyPlaces]
    .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
    .slice(0, 5);
  const maxReviewCount = topRanked[0]?.reviewCount || 1;

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // hotPlaces를 실제 데이터에서 구성
  const hotPlaces = hotPlaceConfigs
    .map((config, i) => {
      const place = dummyPlaces.find((p) => p.id === config.placeId);
      if (!place) return null;
      return { ...config, place, rank: i + 1 };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      {/* 섹션 1: 히어로 배너 */}
      <section
        className={`hero-section relative overflow-hidden transition-all duration-1000 ease-out ${
          heroVisible ? "hero-expanded" : "hero-collapsed"
        }`}
      >
        <div className="hero-swiper">
          <Swiper
            modules={[Pagination, Autoplay, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
            onSlideChange={(swiper) => setActiveHeroIndex(swiper.realIndex)}
            className="h-full"
          >
            {hotPlaces.map((item) => (
              <SwiperSlide key={item.rank}>
                <div
                  className="relative min-h-[240px] sm:min-h-[260px] md:min-h-[300px] cursor-pointer"
                  style={{ background: `linear-gradient(to bottom right, ${item.gradientFrom}, ${item.gradientTo})` }}
                  onClick={() => onNavigateToPlace(item.place)}
                >
                  {/* 배경 장식 */}
                  <div className="absolute top-4 right-4 w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-full bg-white/[0.04]" />
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/[0.04]" />

                  <div className="relative max-w-[900px] mx-auto px-4 sm:px-5 md:px-8 py-5 sm:py-7 md:py-10 h-full">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-5 md:gap-10 h-full">
                      {/* 텍스트 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 flex-wrap">
                          <span className="inline-flex items-center bg-white/15 backdrop-blur-sm text-white text-[9px] sm:text-[10px] md:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full tracking-wider border border-white/10">
                            THICKEATSCORE
                          </span>
                          <span className="inline-flex items-center bg-white/20 text-white text-[9px] sm:text-[10px] md:text-xs font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                            {item.tag}
                          </span>
                        </div>
                        <h2 className="text-[20px] sm:text-[22px] md:text-[36px] font-extrabold text-white leading-tight mb-0.5 sm:mb-1">
                          지금 가장 핫한 맛집
                        </h2>
                        <p className="text-white/70 text-xs sm:text-sm md:text-base mb-3 sm:mb-5">
                          배부룩 큐레이팅이 들려주는 진짜 맛집
                        </p>
                        {/* 순위 + 별점 */}
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="bg-white text-[#E8513D] text-xs md:text-sm font-extrabold w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-md">
                            {item.rank}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-yellow-300 text-xs sm:text-sm">★</span>
                            <span className="text-white font-bold text-xs sm:text-sm">{item.place.rating}</span>
                            <span className="text-white/50 text-[10px] sm:text-xs">({item.place.reviewCount})</span>
                          </div>
                        </div>
                      </div>

                      {/* 이미지 + 정보 카드 — 모바일에서 크기 축소 */}
                      <div className="w-full sm:w-auto md:w-[260px] shrink-0 hidden sm:block">
                        <div className="relative">
                          <div className="w-full aspect-[4/3] bg-white/15 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10">
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-5xl md:text-7xl drop-shadow-lg">{item.emoji}</span>
                            </div>
                          </div>
                          <div className="absolute -bottom-3 left-2 md:left-0 bg-white rounded-xl shadow-lg px-3 sm:px-3.5 py-2 sm:py-2.5 max-w-[200px] sm:max-w-[210px]">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <p className="text-[11px] sm:text-xs font-bold text-gray-900 truncate">{item.place.name}</p>
                              <span className="text-[9px] sm:text-[10px] text-gray-400 shrink-0 bg-gray-100 px-1.5 py-0.5 rounded">{item.place.category}</span>
                            </div>
                            <p className="text-[9px] sm:text-[10px] text-gray-500 line-clamp-1">{item.place.review}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* 커스텀 슬라이드 카운터 */}
          <div className="absolute bottom-3 right-4 md:right-8 z-10 bg-black/30 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-full border border-white/10">
            {activeHeroIndex + 1} / {hotPlaces.length}
          </div>
        </div>
      </section>

      {/* 섹션 2: 지역 선택 */}
      <section className="max-w-[900px] mx-auto px-4 md:px-6 pt-6 sm:pt-7 pb-2 animate-fade-in-up animate-delay-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 bg-[#E8513D] rounded-full" />
          <p className="text-sm text-gray-800 font-bold">지역별 맛집 탐색</p>
        </div>
        <div
          ref={regionScrollRef}
          className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => {
                setSelectedRegion(region);
                if (region !== "전체" && onNavigateToRegion) {
                  onNavigateToRegion(region);
                }
              }}
              className={`shrink-0 px-4 py-2.5 rounded-full text-[13px] sm:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 min-h-[40px] active:scale-95 ${
                selectedRegion === region
                  ? "bg-[#E8513D] text-white shadow-sm shadow-red-200"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {region}
              {region !== "전체" && (
                <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* 섹션 3: 지금 끌리는 메뉴는? */}
      <section className="mt-6 menu-crave-section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F97316] to-[#EA580C]" />

        <div className="relative max-w-[900px] mx-auto px-4 md:px-6 py-8 sm:py-10 md:py-14">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-2xl sm:text-3xl md:text-4xl">🍴</span>
          </div>
          <p className="text-center text-white/70 text-[10px] sm:text-xs tracking-[0.2em] mb-1 uppercase">
            Pasta &middot; Korean &middot; Japanese
          </p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white text-center mb-6 sm:mb-8 md:mb-10">
            지금 끌리는 메뉴는?
          </h2>

          <div className="grid grid-cols-3 gap-x-4 gap-y-5 sm:gap-x-6 sm:gap-y-6 max-w-[340px] sm:max-w-[400px] mx-auto">
            {menuCategories.map((cat, i) => {
              const delayClasses = ["animate-delay-1", "animate-delay-2", "animate-delay-3", "animate-delay-1", "animate-delay-2", "animate-delay-3"];
              return (
              <div
                key={cat.name}
                onClick={() => onTabChange("메뉴 추천")}
                className={`flex flex-col items-center cursor-pointer group animate-fade-in-up active:scale-95 transition-transform ${delayClasses[i]}`}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white/90 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                  <span className="text-2xl sm:text-3xl md:text-4xl">{cat.emoji}</span>
                </div>
                <p className="text-white text-[11px] sm:text-xs md:text-sm font-medium mt-1.5 sm:mt-2 text-center">
                  {cat.name}
                </p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 섹션 4: 방금 저장된 맛집 (지역 필터 연동) */}
      <section className="max-w-[900px] mx-auto px-4 md:px-6 pt-10 md:pt-14 pb-10 md:pb-16">
        <div className="text-center mb-8 md:mb-10 animate-fade-in-up">
          <p className="text-xs text-[#E8513D] font-bold tracking-widest uppercase mb-1">Recently Saved</p>
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
            방금 저장된 맛집
          </h2>
        </div>

        {filterByArea(dummyPlaces, selectedRegion).length === 0 ? (
          <div className="text-center py-16 animate-fade-in-up animate-delay-1">
            <p className="text-3xl mb-3">🍽️</p>
            <p className="text-gray-400 text-sm">이 지역에는 아직 등록된 맛집이 없어요</p>
            <button
              onClick={() => setSelectedRegion("전체")}
              className="mt-3 text-xs text-[#E8513D] font-medium hover:underline"
            >
              전체 보기
            </button>
          </div>
        ) : (
          <div className="saved-swiper animate-fade-in-up animate-delay-1">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView={1.2}
              centeredSlides={false}
              pagination={{ clickable: true, dynamicBullets: true, dynamicMainBullets: 3 }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{
                480: { slidesPerView: 1.5, spaceBetween: 16 },
                640: { slidesPerView: 2.2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 20 },
              }}
              className="pb-10"
            >
              {filterByArea(dummyPlaces, selectedRegion).map((place) => (
                <SwiperSlide key={place.id}>
                  <div
                    className="group cursor-pointer"
                    onClick={() => onNavigateToPlace(place)}
                  >
                    <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden mb-3 relative shadow-sm group-hover:shadow-md transition-shadow duration-300">
                      <div className="w-full h-full group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                        <span className="text-4xl md:text-5xl drop-shadow-sm">{getCategoryEmoji(place.category)}</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white/90 text-xs leading-relaxed line-clamp-2 font-medium">
                          &ldquo;{place.review}&rdquo;
                        </p>
                      </div>
                      {place.isHot && (
                        <div className="absolute top-2.5 left-2.5">
                          <span className="text-[10px] font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 px-2 py-0.5 rounded-full">HOT</span>
                        </div>
                      )}
                    </div>
                    <div className="px-0.5">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <p className="text-sm font-bold text-gray-900 group-hover:text-[#E8513D] transition-colors truncate">
                          {place.name}
                        </p>
                        {place.rating && (
                          <div className="flex items-center gap-0.5 shrink-0 bg-yellow-50 px-1.5 py-0.5 rounded-full">
                            <span className="text-yellow-500 text-[10px]">★</span>
                            <span className="text-[11px] text-gray-700 font-bold">{place.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs text-gray-400 font-medium">{place.category} · {place.area}</p>
                        {place.reviewCount && (
                          <span className="text-[10px] text-gray-300">리뷰 {place.reviewCount.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        <div className="flex justify-center mt-6 animate-fade-in-up animate-delay-3">
          <button
            onClick={() => onTabChange("맛집 목록")}
            className="group flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-8 py-3 rounded-full hover:bg-gray-800 active:scale-95 transition-all shadow-sm"
          >
            전체 맛집 보기
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* 섹션 5: 실시간 리뷰 피드 (무한 마퀴) */}
      <section className="py-10 md:py-14 bg-gray-50 overflow-hidden">
        <div
          ref={reviewTickerReveal.ref}
          className={`scroll-reveal ${reviewTickerReveal.revealed ? "revealed" : ""}`}
        >
          <div className="max-w-[900px] mx-auto px-4 md:px-6 mb-6">
            <p className="text-xs text-[#E8513D] font-bold tracking-widest uppercase mb-1">Live Reviews</p>
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">
              지금 올라오는 생생한 리뷰
            </h2>
          </div>

          {/* 1번 줄 → */}
          <div className="mb-3 sm:mb-4 overflow-hidden">
            <div className="marquee-track">
              {[...dummyPlaces, ...dummyPlaces].map((place, i) => {
                const review = place.reviews?.[0];
                if (!review) return null;
                return (
                  <div
                    key={`a-${i}`}
                    onClick={() => onNavigateToPlace(place)}
                    className="shrink-0 w-[260px] sm:w-[300px] md:w-[340px] mx-1.5 sm:mx-2 bg-white rounded-2xl p-3 sm:p-4 cursor-pointer hover:-translate-y-1 transition-all duration-300"
                    style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)" }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#E8513D] to-[#F97316] flex items-center justify-center shrink-0">
                        <span className="text-[10px] text-white font-bold">{review.author.charAt(0)}</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{review.author}</span>
                      <span className="text-yellow-400 text-xs">{"★".repeat(review.rating)}</span>
                      <span className="text-[10px] text-gray-400 ml-auto">{review.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-2">{review.content}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#E8513D]">{place.name}</span>
                      <span className="text-[10px] text-gray-400">{place.area}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2번 줄 ← (역방향) */}
          <div className="overflow-hidden">
            <div className="marquee-track-reverse">
              {[...dummyPlaces, ...dummyPlaces].map((place, i) => {
                const review = place.reviews?.[1] || place.reviews?.[0];
                if (!review) return null;
                return (
                  <div
                    key={`b-${i}`}
                    onClick={() => onNavigateToPlace(place)}
                    className="shrink-0 w-[240px] sm:w-[280px] md:w-[320px] mx-1.5 sm:mx-2 bg-white rounded-2xl p-3 sm:p-4 cursor-pointer hover:-translate-y-1 transition-all duration-300"
                    style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)" }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center shrink-0">
                        <span className="text-[10px] text-white font-bold">{review.author.charAt(0)}</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{review.author}</span>
                      <span className="text-yellow-400 text-xs">{"★".repeat(review.rating)}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{review.content}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 섹션 6: 배부룩 통계 (카운트업 애니메이션) */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#0F172A] animated-gradient" />
        {/* 플로팅 파티클 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[5%] text-4xl opacity-10 float-particle-1">🍣</div>
          <div className="absolute top-[60%] left-[15%] text-3xl opacity-10 float-particle-2">🍖</div>
          <div className="absolute top-[20%] right-[10%] text-5xl opacity-10 float-particle-3">🍝</div>
          <div className="absolute top-[70%] right-[20%] text-3xl opacity-10 float-particle-1">☕</div>
          <div className="absolute top-[40%] left-[50%] text-4xl opacity-10 float-particle-2">🍕</div>
          <div className="absolute top-[80%] left-[60%] text-3xl opacity-[0.07] float-particle-3">🍜</div>
        </div>

        <div
          ref={statsReveal.ref}
          className={`relative max-w-[900px] mx-auto px-4 md:px-6 py-16 md:py-24 scroll-reveal ${statsReveal.revealed ? "revealed" : ""}`}
        >
          <p className="text-center text-[#E8513D] text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-2">
            Baeburook in Numbers
          </p>
          <h2 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-white text-center mb-3 sm:mb-4">
            숫자로 보는 배부룩
          </h2>
          <p className="text-center text-white/40 text-xs sm:text-sm mb-8 sm:mb-12 md:mb-16">
            매일 업데이트되는 실시간 맛집 데이터
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              { value: totalPlaces, suffix: "곳", label: "등록된 맛집", icon: "📍" },
              { value: totalReviews, suffix: "+", label: "누적 리뷰", icon: "💬", format: true },
              { value: avgRating, suffix: "", label: "평균 별점", icon: "⭐", decimal: true },
              { value: totalAreas, suffix: "개", label: "탐험 지역", icon: "🗺️" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="text-center group"
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-125 transition-transform duration-300">
                  {stat.icon}
                </div>
                <p className="stat-number text-2xl sm:text-3xl md:text-5xl font-black text-white mb-1">
                  {stat.decimal
                    ? (stat.value / 10).toFixed(1)
                    : stat.format
                      ? stat.value.toLocaleString()
                      : stat.value}
                  <span className="text-[#E8513D] text-sm sm:text-lg md:text-2xl ml-0.5">{stat.suffix}</span>
                </p>
                <p className="text-white/50 text-[10px] sm:text-xs md:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 섹션 7: 이 주의 맛집 TOP 5 (애니메이션 랭킹) */}
      <section className="max-w-[900px] mx-auto px-4 md:px-6 py-12 md:py-16">
        <div
          ref={rankReveal.ref}
          className={`scroll-reveal ${rankReveal.revealed ? "revealed" : ""}`}
        >
          <div className="flex items-end justify-between mb-8 md:mb-10">
            <div>
              <p className="text-xs text-[#E8513D] font-bold tracking-widest uppercase mb-1">Weekly Ranking</p>
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">이 주의 맛집 TOP 5</h2>
            </div>
            <span className="text-xs text-gray-400">리뷰 수 기준</span>
          </div>

          <div className="space-y-4">
            {topRanked.map((place, i) => {
              const barWidth = ((place.reviewCount || 0) / maxReviewCount) * 100;
              const medals = ["🥇", "🥈", "🥉"];
              return (
                <div
                  key={place.id}
                  onClick={() => onNavigateToPlace(place)}
                  className="group cursor-pointer rank-card"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="bg-white rounded-2xl p-4 md:p-5 transition-all duration-200 hover:-translate-y-0.5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)" }}>
                    <div className="flex items-center gap-3 md:gap-4 mb-3">
                      {/* 순위 */}
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        i === 0 ? "bg-gradient-to-br from-amber-100 to-yellow-50" :
                        i === 1 ? "bg-gradient-to-br from-gray-100 to-slate-50" :
                        i === 2 ? "bg-gradient-to-br from-orange-50 to-amber-50" :
                        "bg-gray-50"
                      }`}>
                        {i < 3 ? (
                          <span className="text-xl md:text-2xl">{medals[i]}</span>
                        ) : (
                          <span className="text-lg md:text-xl font-black text-gray-300">{i + 1}</span>
                        )}
                      </div>
                      {/* 정보 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-sm md:text-base font-bold text-gray-900 group-hover:text-[#E8513D] transition-colors truncate">
                            {place.name}
                          </h3>
                          {place.isHot && (
                            <span className="shrink-0 text-[10px] bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-1.5 py-0.5 rounded-full">HOT</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 font-medium">{place.category} · {place.area}</p>
                      </div>
                      {/* 별점 + 리뷰 수 */}
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 justify-end bg-yellow-50 px-2 py-0.5 rounded-full mb-0.5">
                          <span className="text-yellow-500 text-xs">★</span>
                          <span className="text-sm font-bold text-gray-800">{place.rating}</span>
                        </div>
                        <p className="text-[11px] text-gray-400">리뷰 {(place.reviewCount || 0).toLocaleString()}</p>
                      </div>
                    </div>
                    {/* 프로그레스 바 */}
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-[1.5s] ease-out ${
                          i === 0 ? "bg-gradient-to-r from-[#E8513D] to-[#F97316]" :
                          i === 1 ? "bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]" :
                          i === 2 ? "bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8]" :
                          "bg-gray-200"
                        }`}
                        style={{ width: rankReveal.revealed ? `${barWidth}%` : "0%" }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-center py-10 px-4">
        <p className="text-lg font-black bg-gradient-to-r from-[#E8513D] to-[#F97316] bg-clip-text text-transparent mb-2">배부룩</p>
        <p className="text-[11px] text-gray-500">큐레이팅된 서울 맛집 지도</p>
        <p className="text-[11px] text-gray-600 mt-4">&copy; {new Date().getFullYear()} 배부룩. All rights reserved.</p>
      </footer>
    </div>
  );
}
