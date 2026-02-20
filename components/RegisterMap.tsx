"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PLACE_PIN_SVG, createMarkerImage } from "@/utils/svg";

interface RegisterMapProps {
  latitude: number;
  longitude: number;
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}

const placeMarkerImage = createMarkerImage(PLACE_PIN_SVG, 30, 42);

export default function RegisterMap({ latitude, longitude, onLocationSelect }: RegisterMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const initMap = useCallback(() => {
    if (!mapRef.current || !window.kakao) return;

    const options = {
      center: new window.kakao.maps.LatLng(latitude, longitude),
      level: 3,
    };

    const map = new window.kakao.maps.Map(mapRef.current, options);
    mapInstanceRef.current = map;

    const marker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(latitude, longitude),
      map: map,
      image: placeMarkerImage(window.kakao),
      draggable: true
    });
    markerRef.current = marker;

    const geocoder = new window.kakao.maps.services.Geocoder();

    // 마커 드래그 종료 시 좌표 업데이트 및 주소 추출
    window.kakao.maps.event.addListener(marker, 'dragend', function() {
      const latlng = marker.getPosition();
      const lat = latlng.getLat();
      const lng = latlng.getLng();
      
      geocoder.coord2Address(lng, lat, (result: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const address = result[0].address.address_name;
          onLocationSelect(lat, lng, address);
        } else {
          onLocationSelect(lat, lng, "");
        }
      });
    });

    // 지도 클릭 시 마커 이동
    window.kakao.maps.event.addListener(map, 'click', function(mouseEvent: any) {
      const latlng = mouseEvent.latLng;
      marker.setPosition(latlng);
      const lat = latlng.getLat();
      const lng = latlng.getLng();

      geocoder.coord2Address(lng, lat, (result: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const address = result[0].address.address_name;
          onLocationSelect(lat, lng, address);
        } else {
          onLocationSelect(lat, lng, "");
        }
      });
    });

    setIsLoaded(true);
  }, [onLocationSelect]);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => initMap());
    }
  }, [initMap]);

  // 외부에서 좌표가 변경될 때 (주소 검색 등) 지도 중심 및 마커 이동
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current && window.kakao) {
      const newPos = new window.kakao.maps.LatLng(latitude, longitude);
      mapInstanceRef.current.setCenter(newPos);
      markerRef.current.setPosition(newPos);
    }
  }, [latitude, longitude]);

  return (
    <div className="relative w-full h-[200px] rounded-xl overflow-hidden border border-gray-200">
      <div ref={mapRef} className="w-full h-full" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50">
          <span className="text-xs text-gray-400">지도를 불러오는 중...</span>
        </div>
      )}
      <div className="absolute bottom-2 left-2 z-10 bg-black/60 text-white text-[10px] px-2 py-1 rounded">
        마커를 움직여 정확한 위치를 선택하세요
      </div>
    </div>
  );
}
