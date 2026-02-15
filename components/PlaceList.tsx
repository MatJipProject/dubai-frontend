'use client';

import type { PlaceData } from '@/types/kakao';

interface PlaceListProps {
  places: PlaceData[];
  selectedPlace: PlaceData | null;
  onPlaceSelect: (place: PlaceData) => void;
  isSearching?: boolean;
}

const categoryEmojis: { [key: string]: string } = {
  '한식': '🍚',
  '중식': '🥟',
  '일식': '🍣',
  '양식': '🍝',
  '분식': '🍜',
  '카페': '☕',
  '디저트': '🍰',
  '음식점': '🍴',
};

export default function PlaceList({ places, selectedPlace, onPlaceSelect, isSearching }: PlaceListProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 overflow-y-auto h-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🍽️ 맛집 목록</h2>

      {isSearching && (
        <div className="text-center py-12 text-gray-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-lg">주변 음식점을 검색하는 중...</p>
        </div>
      )}

      {!isSearching && places.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">주변에 음식점을 찾지 못했습니다.</p>
        </div>
      )}

      <div className="space-y-3">
        {places.map((place) => {
          const isSelected = selectedPlace?.id === place.id;
          return (
            <button
              key={place.id}
              onClick={() => onPlaceSelect(place)}
              className={`w-full text-left p-4 rounded-lg transition-all ${
                isSelected
                  ? 'bg-orange-500 text-white shadow-md transform scale-105'
                  : 'bg-gray-50 hover:bg-orange-50 text-gray-800 hover:shadow'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">
                  {categoryEmojis[place.category] || '🍴'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-lg mb-1 truncate">{place.name}</h3>
                    {place.area && (
                      <span className={`text-xs whitespace-nowrap ${
                        isSelected ? 'text-orange-100' : 'text-gray-400'
                      }`}>
                        {place.area}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm mb-1 ${
                    isSelected ? 'text-orange-100' : 'text-gray-500'
                  }`}>
                    {place.category}
                  </p>
                  {place.address && (
                    <p className={`text-sm truncate ${
                      isSelected ? 'text-orange-100' : 'text-gray-500'
                    }`}>
                      📍 {place.address}
                    </p>
                  )}
                  {place.phone && (
                    <p className={`text-sm ${
                      isSelected ? 'text-orange-100' : 'text-gray-500'
                    }`}>
                      📞 {place.phone}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
