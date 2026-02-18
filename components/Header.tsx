"use client";

import { tabs, HEADER_HEIGHT } from "@/data/constants";
import type { Tab } from "@/data/constants";
import type { UserResponse } from "@/types/api";

interface HeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  user?: UserResponse | null;
  isLoggedIn?: boolean;
}

export default function Header({ activeTab, onTabChange, user, isLoggedIn }: HeaderProps) {
  return (
    <header
      className="bg-white/80 backdrop-blur-xl border-b border-gray-100 shrink-0 relative z-50 safe-area-top"
      style={{ minHeight: HEADER_HEIGHT }}
    >
      <div className="max-w-[900px] mx-auto h-14 flex items-center px-4 md:px-6">
        <h1
          className="text-lg md:text-xl font-black bg-gradient-to-r from-[#E8513D] to-[#F97316] bg-clip-text text-transparent tracking-tight cursor-pointer shrink-0 select-none min-w-[44px] min-h-[44px] flex items-center"
          onClick={() => onTabChange("홈")}
        >
          배부룩
        </h1>

        {/* 모바일: 현재 탭 이름 표시 */}
        {activeTab !== "홈" && (
          <span className="md:hidden text-sm font-bold text-gray-800 ml-3 truncate">
            {activeTab}
          </span>
        )}

        {/* 데스크탑 탭 네비 */}
        <nav className="hidden md:flex items-center h-full gap-1 ml-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`relative h-full px-3 text-[14px] font-semibold transition-colors whitespace-nowrap ${
                tab === activeTab
                  ? "text-[#E8513D]"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              {tab}
              {tab === activeTab && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[3px] bg-[#E8513D] rounded-full" />
              )}
            </button>
          ))}
        </nav>
        <div className="flex-1" />

        {/* 모바일 로그인 상태 아이콘 */}
        {isLoggedIn && user ? (
          <button
            onClick={() => onTabChange("마이")}
            className="md:hidden w-8 h-8 rounded-full bg-gradient-to-br from-[#E8513D] to-[#F97316] flex items-center justify-center shrink-0"
          >
            <span className="text-[11px] text-white font-bold">{user.nickname.charAt(0)}</span>
          </button>
        ) : null}

        {/* 데스크탑 로그인 */}
        {isLoggedIn && user ? (
          <button
            onClick={() => onTabChange("마이")}
            className="hidden md:flex items-center gap-1.5 text-xs text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3.5 py-1.5 rounded-full transition-colors font-medium"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#E8513D] to-[#F97316] flex items-center justify-center shrink-0">
              <span className="text-[9px] text-white font-bold">{user.nickname.charAt(0)}</span>
            </div>
            {user.nickname}
          </button>
        ) : (
          <button
            onClick={() => onTabChange("마이")}
            className="hidden md:flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3.5 py-1.5 rounded-full transition-colors font-medium"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            로그인
          </button>
        )}
      </div>
    </header>
  );
}
