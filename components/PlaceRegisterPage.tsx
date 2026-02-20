"use client";

import { useState, useCallback, useEffect } from "react";
import { categories } from "@/data/constants";
import { createRestaurant } from "@/utils/api";
import type { RestaurantCreate } from "@/types/api";
import RegisterMap from "./RegisterMap";

interface PlaceRegisterPageProps {
  onSuccess: () => void;
  onCancel: () => void;
}

declare global {
  interface Window {
    daum: any;
  }
}

export default function PlaceRegisterPage({ onSuccess, onCancel }: PlaceRegisterPageProps) {
  const [formData, setFormData] = useState<RestaurantCreate>({
    name: "",
    category: categories[1], // 기본값: 한식
    address: "",
    road_address: "",
    phone: "",
    latitude: 37.5665, // 서울 시청 기준 기본값
    longitude: 126.9780,
    description: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // 컴포넌트 마운트 시 애니메이션 효과를 위해 약간의 지연 후 표시
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onCancel, 300); // 애니메이션 시간 대기
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
      
      const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // 주소 검색 핸들러
  const handleAddressSearch = () => {
    if (typeof window === "undefined" || !window.daum) return;

    new window.daum.Postcode({
      oncomplete: (data: any) => {
        const fullAddress = data.address;
        const roadAddress = data.roadAddress;

        // 주소를 좌표로 변환
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(fullAddress, (result: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const lat = parseFloat(result[0].y);
            const lng = parseFloat(result[0].x);
            setFormData(prev => ({
              ...prev,
              address: fullAddress,
              road_address: roadAddress,
              latitude: lat,
              longitude: lng,
            }));
          } else {
            setFormData(prev => ({
              ...prev,
              address: fullAddress,
              road_address: roadAddress,
            }));
          }
        });
      },
    }).open();
  };

  // 지도에서 위치 선택 핸들러
  const handleLocationSelect = useCallback((lat: number, lng: number, address: string) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      address: address || prev.address, // 주소가 추출된 경우에만 업데이트
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await createRestaurant(formData, files);
      alert("맛집이 등록되었습니다!");
      onSuccess();
    } catch (err: any) {
      setError(err.message || "등록 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] transition-all duration-300 ease-out ${isVisible ? "visible" : "invisible"}`}>
      {/* 백드롭 */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`} 
        onClick={handleClose}
      />
      
      {/* 바텀 시트 */}
      <div 
        className={`absolute bottom-0 left-0 right-0 max-w-[500px] mx-auto bg-white rounded-t-[24px] shadow-2xl transition-transform duration-300 ease-out flex flex-col overflow-hidden ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "90dvh" }}
      >
        {/* 상단 핸들 */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1.5 bg-gray-200 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <button onClick={handleClose} className="p-2 -ml-2 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-lg font-bold text-gray-800">새 맛집 등록</h2>
          <div className="w-10" />
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700">식당 이름 *</label>
          <input
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="식당 이름을 입력하세요"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E8513D] focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700">카테고리 *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E8513D] focus:border-transparent transition-all appearance-none bg-white"
          >
            {categories.filter(c => c !== "전체").map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700">주소 및 위치 *</label>
          <div className="flex gap-2 mb-2">
            <input
              required
              readOnly
              name="address"
              value={formData.address}
              placeholder="주소 검색을 클릭하세요"
              onClick={handleAddressSearch}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none bg-gray-50 cursor-pointer text-sm"
            />
            <button
              type="button"
              onClick={handleAddressSearch}
              className="shrink-0 px-4 py-3 bg-gray-800 text-white rounded-xl text-sm font-bold hover:bg-gray-700 active:scale-95 transition-all"
            >
              주소 검색
            </button>
          </div>
          
          <RegisterMap 
            latitude={formData.latitude} 
            longitude={formData.longitude} 
            onLocationSelect={handleLocationSelect} 
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700">전화번호</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="02-1234-5678"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E8513D] focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700">설명</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="식당에 대한 간단한 설명을 적어주세요"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E8513D] focus:border-transparent transition-all resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700">사진 등록</label>
          <div className="grid grid-cols-3 gap-2">
            {previews.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-100">
                <img src={url} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center text-white"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <label className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-[10px] text-gray-400 mt-1">사진 추가</span>
              <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-500 text-xs rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <div className="pt-4 pb-8">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-[#E8513D] to-[#F97316] text-white font-bold rounded-xl shadow-lg shadow-[#E8513D]/20 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isLoading ? "등록 중..." : "등록하기"}
          </button>
        </div>
      </form>
    </div>
  </div>
  );
}
