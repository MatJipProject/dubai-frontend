// 공통 상수 (regions, categoryEmojis 등 여러 컴포넌트에서 공유)

export const regions = [
  "전체", "구로", "강남", "합정", "한남", "이태원", "성수", "을지로", "서초", "신사", "청담", "용산",
];

export const categories = ["전체", "한식", "양식", "일식", "오마카세", "카페"];

export const categoryEmojis: Record<string, string> = {
  "오마카세": "🍣",
  "한식": "🍖",
  "양식": "🍝",
  "일식": "🍱",
  "카페": "☕",
};

export function getCategoryEmoji(category: string): string {
  return categoryEmojis[category] || "🍽️";
}
