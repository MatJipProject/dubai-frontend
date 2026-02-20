"use client";

import { useState, useMemo, useEffect } from "react";
import type { PlaceData } from "@/types/kakao";
import { regions as areas, categories, getCategoryEmoji } from "@/data/constants";

type SortKey = "rating" | "reviewCount" | "name";

interface PlaceListPageProps {
  places: PlaceData[];
  onPlaceClick: (place: PlaceData) => void;
  onRegisterClick?: () => void;
  initialSearch?: string;
}

export default function PlaceListPage({ places, onPlaceClick, onRegisterClick, initialSearch }: PlaceListPageProps) {
  const [search, setSearch] = useState(initialSearch || "");

  useEffect(() => {
    if (initialSearch) setSearch(initialSearch);
  }, [initialSearch]);
  const [selectedArea, setSelectedArea] = useState("전체");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortBy, setSortBy] = useState<SortKey>("rating");

  const filtered = useMemo(() => {
    let result = [...places];

    // 검색
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.address?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q)),
      );
    }

    // 지역
    if (selectedArea !== "전체") {
      result = result.filter((p) => p.area === selectedArea);
    }

    // 카테고리
    if (selectedCategory !== "전체") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // 정렬
    result.sort((a, b) => {
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "reviewCount") return (b.reviewCount || 0) - (a.reviewCount || 0);
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [places, search, selectedArea, selectedCategory, sortBy]);

  const sortLabels: Record<SortKey, string> = {
    rating: "별점순",
    reviewCount: "리뷰순",
    name: "이름순",
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/50">
      <div className="max-w-[900px] mx-auto px-4 md:px-6 py-6">
        {/* 헤더 */}
        <div className="mb-5">
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight mb-0.5">맛집 목록</h2>
          <p className="text-sm text-gray-400">총 <span className="font-semibold text-[#E8513D]">{filtered.length}</span>곳의 맛집</p>
        </div>

        {/* 검색 */}
        <div className="relative mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="맛집 이름, 카테고리, 태그, 주소 검색"
            className="w-full bg-white rounded-xl px-4 py-3 pl-10 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E8513D]/20 transition-all placeholder:text-gray-300"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.06)" }}
          />
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* 필터 + 정렬 */}
        <div className="flex flex-col gap-2.5 mb-5">
          {/* 지역 필터 */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {areas.map((area) => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 min-h-[36px] active:scale-95 ${
                  selectedArea === area
                    ? "bg-[#E8513D] text-white shadow-sm shadow-red-200"
                    : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {area}
              </button>
            ))}
          </div>

          {/* 카테고리 + 정렬 */}
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 min-h-[36px] active:scale-95 ${
                    selectedCategory === cat
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="shrink-0 flex items-center gap-1 bg-white border border-gray-200 rounded-full px-3 py-2 min-h-[36px]">
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="text-xs text-gray-600 font-medium bg-transparent focus:outline-none appearance-none pr-1 cursor-pointer"
              >
                <option value="rating">별점순</option>
                <option value="reviewCount">리뷰순</option>
                <option value="name">이름순</option>
              </select>
            </div>
          </div>
        </div>

        {/* 목록 */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm font-medium">검색 결과가 없습니다</p>
            <p className="text-gray-300 text-xs mt-1">다른 키워드로 검색해보세요</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((place, idx) => (
              <div
                key={place.id}
                onClick={() => onPlaceClick(place)}
                className="bg-white rounded-2xl p-3.5 sm:p-4 cursor-pointer group transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] active:bg-gray-50/50"
                style={{
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
                  border: "1px solid rgba(0,0,0,0.04)",
                  animationDelay: `${idx * 30}ms`,
                }}
              >
                <div className="flex items-start gap-3">
                  {/* 이모지 썸네일 */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center shrink-0 group-hover:from-orange-50 group-hover:to-red-50 transition-all duration-300">
                    <span className="text-xl sm:text-2xl md:text-3xl drop-shadow-sm">
                      {getCategoryEmoji(place.category)}
                    </span>
                  </div>

                  {/* 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm md:text-base font-bold text-gray-900 truncate group-hover:text-[#E8513D] transition-colors">
                        {place.name}
                      </h3>
                      {place.isHot && (
                        <span className="shrink-0 text-[10px] bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-1.5 py-0.5 rounded-full">
                          HOT
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-xs text-gray-400 font-medium">{place.category}</span>
                      <span className="w-0.5 h-0.5 bg-gray-300 rounded-full" />
                      <span className="text-xs text-gray-400 font-medium">{place.area}</span>
                      {place.priceRange && (
                        <>
                          <span className="w-0.5 h-0.5 bg-gray-300 rounded-full" />
                          <span className="text-xs text-gray-400">{place.priceRange}</span>
                        </>
                      )}
                    </div>

                    <p className="text-xs text-gray-400 line-clamp-1 mb-2 leading-relaxed">
                      {place.review}
                    </p>

                    {/* 태그 */}
                    {place.tags && place.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {place.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 별점 & 리뷰 */}
                  <div className="text-right shrink-0">
                    {place.rating && (
                      <div className="flex items-center gap-0.5 justify-end bg-yellow-50 px-2 py-0.5 rounded-full mb-1">
                        <span className="text-yellow-500 text-[10px]">★</span>
                        <span className="text-xs font-bold text-gray-800">{place.rating}</span>
                      </div>
                    )}
                    {place.reviewCount != null && (
                      <p className="text-[11px] text-gray-400">
                        리뷰 {place.reviewCount.toLocaleString()}
                      </p>
                    )}
                    {place.openHours && (
                      <p className="text-[10px] text-gray-300 mt-1">{place.openHours}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
