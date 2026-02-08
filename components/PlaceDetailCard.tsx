'use client';

import { useState } from 'react';
import type { PlaceData } from '@/types/kakao';

interface PlaceDetailCardProps {
  place: PlaceData;
  onClose: () => void;
}

export default function PlaceDetailCard({ place, onClose }: PlaceDetailCardProps) {
  const [liked, setLiked] = useState(false);

  return (
    <>
      {/* 배경 클릭 시 닫기 */}
      <div className="absolute inset-0 z-40" onClick={onClose} />

      {/* 플로팅 팝업 카드 */}
      <div className="absolute right-4 top-4 bottom-4 w-[340px] bg-white rounded-2xl shadow-xl z-50 animate-popup-in overflow-y-auto">
        {/* 카테고리 + 하트 */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-md">
            {place.category}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
            className="w-8 h-8 flex items-center justify-center"
            aria-label="좋아요"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill={liked ? '#a855f7' : 'none'}
              stroke={liked ? '#a855f7' : '#d1d5db'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* 가게명 */}
        <div className="px-5 pb-1">
          <h3 className="text-xl font-bold text-gray-900">{place.name}</h3>
        </div>

        {/* 주소 */}
        {place.address && (
          <div className="px-5 pb-1">
            <p className="text-sm text-gray-500">{place.address}</p>
          </div>
        )}

        {/* 별점 */}
        {place.rating && (
          <div className="px-5 pb-1 flex items-center gap-1">
            <span className="text-yellow-500 text-sm">&#9733;</span>
            <span className="text-sm text-gray-700 font-medium">{place.rating}</span>
            {place.reviewCount && (
              <span className="text-sm text-gray-400">({place.reviewCount})</span>
            )}
          </div>
        )}

        {/* 링크 */}
        {place.link && (
          <div className="px-5 pb-3">
            <a
              href={place.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {place.link}
            </a>
          </div>
        )}

        {/* 리뷰 */}
        {place.review && (
          <div className="px-5 pb-2">
            <div className="bg-gray-50 rounded-lg p-3 flex gap-3 items-start">
              <div className="w-10 h-10 bg-gray-200 rounded-md shrink-0" />
              <p className="text-sm text-gray-700 leading-relaxed">{place.review}</p>
            </div>
          </div>
        )}

        {/* 더보기 */}
        <div className="px-5 pb-3 text-right">
          <button className="text-xs text-gray-400 hover:text-gray-600">더보기</button>
        </div>

        {/* 이미지 플레이스홀더 */}
        <div className="px-5 pb-5">
          <div className="grid grid-cols-2 gap-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="aspect-[4/3] bg-gray-100 rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
