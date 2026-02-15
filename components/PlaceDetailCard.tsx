'use client';

import { useState } from 'react';
import type { PlaceData } from '@/types/kakao';
import { getCategoryEmoji } from '@/data/constants';

interface PlaceDetailCardProps {
  place: PlaceData;
  onClose: () => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-xs ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export default function PlaceDetailCard({ place, onClose }: PlaceDetailCardProps) {
  const [liked, setLiked] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const reviews = place.reviews || [];
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 2);

  return (
    <>
      {/* 배경 클릭 시 닫기 */}
      <div className="absolute inset-0 z-40" onClick={onClose} />

      {/* 플로팅 팝업 카드 */}
      <div
        className="absolute left-0 right-0 bottom-0 h-[65vh] md:left-auto md:right-4 md:top-4 md:bottom-4 md:h-auto md:w-[380px] bg-white rounded-t-3xl md:rounded-2xl z-50 animate-slide-up md:animate-popup-in overflow-y-auto"
        style={{ boxShadow: "0 -4px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)" }}
        role="dialog"
        aria-label={`${place.name} 상세 정보`}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-gray-100 hover:bg-gray-100 transition-all active:scale-90"
          aria-label="닫기"
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 모바일 드래그 핸들 */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* 상단 이모지 배너 */}
        <div className="mx-5 mt-3 mb-4 h-28 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #000 1px, transparent 0)", backgroundSize: "20px 20px" }} />
          <span className="text-5xl drop-shadow-sm">{getCategoryEmoji(place.category)}</span>
        </div>

        {/* 카테고리 + 태그 + 하트 */}
        <div className="flex items-center justify-between px-5 pb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center px-2.5 py-1 bg-[#E8513D]/8 text-[#E8513D] text-[11px] font-bold rounded-full">
              {place.category}
            </span>
            {place.priceRange && (
              <span className="text-[11px] text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-full">{place.priceRange}</span>
            )}
            {place.isHot && (
              <span className="inline-flex items-center px-2 py-0.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold rounded-full">HOT</span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-90 ${liked ? "bg-red-50" : "hover:bg-gray-50"}`}
            aria-label="좋아요"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={liked ? '#E8513D' : 'none'}
              stroke={liked ? '#E8513D' : '#d1d5db'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${liked ? "scale-110" : ""}`}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* 가게명 */}
        <div className="px-5 pb-1">
          <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">{place.name}</h3>
          {place.description && (
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">{place.description}</p>
          )}
        </div>

        {/* 별점 종합 */}
        {place.rating && (
          <div className="px-5 py-2.5 flex items-center gap-2.5">
            <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1 rounded-full">
              <StarRating rating={Math.round(place.rating)} />
              <span className="text-sm text-gray-900 font-bold ml-0.5">{place.rating}</span>
            </div>
            {place.reviewCount && (
              <span className="text-xs text-gray-400">리뷰 {place.reviewCount.toLocaleString()}개</span>
            )}
          </div>
        )}

        {/* 정보 */}
        <div className="mx-5 bg-gray-50 rounded-xl p-3.5 space-y-2.5 mb-3">
          {place.address && (
            <div className="flex items-start gap-2.5">
              <svg className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-[13px] text-gray-600">{place.address}</p>
            </div>
          )}
          {place.openHours && (
            <div className="flex items-start gap-2.5">
              <svg className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[13px] text-gray-600">{place.openHours}</p>
            </div>
          )}
          {place.phone && (
            <div className="flex items-start gap-2.5">
              <svg className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href={`tel:${place.phone}`} className="text-[13px] text-[#E8513D] font-medium hover:underline">{place.phone}</a>
            </div>
          )}
        </div>

        {/* 태그 */}
        {place.tags && place.tags.length > 0 && (
          <div className="px-5 pb-3 flex flex-wrap gap-1.5">
            {place.tags.map((tag) => (
              <span key={tag} className="text-[11px] text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 구분선 */}
        <div className="mx-5 border-t border-gray-100" />

        {/* 리뷰 목록 */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-gray-900">
              리뷰 {reviews.length > 0 ? `(${reviews.length})` : ''}
            </h4>
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-2.5">
              {visibleReviews.map((review, idx) => {
                const avatarColors = [
                  "from-[#E8513D] to-[#F97316]",
                  "from-[#6366F1] to-[#8B5CF6]",
                  "from-[#0EA5E9] to-[#38BDF8]",
                  "from-[#10B981] to-[#34D399]",
                ];
                return (
                  <div key={review.id} className="bg-gray-50/80 rounded-xl p-3.5 border border-gray-100/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} rounded-full shrink-0 flex items-center justify-center shadow-sm`}>
                          <span className="text-[10px] text-white font-bold">
                            {review.author.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-gray-700 block leading-none">{review.author}</span>
                          <span className="text-[10px] text-gray-400">{review.date}</span>
                        </div>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-[13px] text-gray-600 leading-relaxed">{review.content}</p>
                    {review.helpful != null && review.helpful > 0 && (
                      <div className="mt-2 flex items-center gap-1">
                        <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        <span className="text-[10px] text-gray-400 font-medium">{review.helpful}</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {reviews.length > 2 && (
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="w-full text-center text-xs text-gray-500 hover:text-gray-700 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                >
                  {showAllReviews ? '접기' : `리뷰 ${reviews.length - 2}개 더보기`}
                </button>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-6">아직 리뷰가 없어요</p>
          )}
        </div>

        {/* 카카오맵 링크 */}
        {place.link && (
          <div className="px-5 pb-5 pt-2">
            <a
              href={place.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full text-sm font-semibold text-white bg-gradient-to-r from-[#E8513D] to-[#F2734E] hover:from-[#d4462f] hover:to-[#e5623f] py-3 rounded-xl transition-all active:scale-[0.98] shadow-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              카카오맵에서 보기
            </a>
          </div>
        )}
      </div>
    </>
  );
}
