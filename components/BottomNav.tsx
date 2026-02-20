"use client";

import { tabs, tabLabels } from "@/data/constants";
import type { Tab } from "@/data/constants";

function TabIcon({ tab, active }: { tab: Tab; active: boolean }) {
  const cls = `w-[22px] h-[22px] ${active ? "text-[#E8513D]" : "text-gray-400"}`;
  switch (tab) {
    case "홈":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 2.2 : 1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
        </svg>
      );
    case "맛집 지도":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 2.2 : 1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "메뉴 추천":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 2.2 : 1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    case "맛집 목록":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 2.2 : 1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      );
    case "맛집 등록":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 2.2 : 1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      );
    case "마이":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={active ? 2.2 : 1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
  }
}

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="md:hidden bg-white/90 backdrop-blur-lg border-t border-gray-100 shrink-0 safe-area-bottom"
    >
      <div className="flex items-center justify-around h-14 max-w-[500px] mx-auto px-1">
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className="flex flex-col items-center justify-center flex-1 min-w-[48px] min-h-[48px] relative active:opacity-70 transition-opacity"
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-[#E8513D] rounded-full" />
              )}
              <TabIcon tab={tab} active={isActive} />
              <span className={`text-[10px] font-semibold mt-0.5 transition-colors ${isActive ? "text-[#E8513D]" : "text-gray-400"}`}>
                {tabLabels[tab]}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
