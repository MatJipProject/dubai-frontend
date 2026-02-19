// SVG 유틸리티 함수 및 마커 상수

export function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) {
  const startRad = ((startAngle - 90) * Math.PI) / 180;
  const endRad = ((endAngle - 90) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

// 맛집 핀 마커 (코랄)
export const PLACE_PIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="42" viewBox="0 0 30 42">
  <path d="M15 40C15 40 28.5 25 28.5 15C28.5 7.54 22.46 1.5 15 1.5C7.54 1.5 1.5 7.54 1.5 15C1.5 25 15 40 15 40Z" fill="%23F87171" stroke="white" stroke-width="1.5"/>
  <circle cx="15" cy="15" r="5.5" fill="white"/>
  <circle cx="15" cy="15" r="2.5" fill="%23F87171"/>
</svg>`;

// 현재 위치 핀 마커 (블루 + 사람 아이콘)
export const CURRENT_PIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="42" viewBox="0 0 30 42">
  <path d="M15 40C15 40 28.5 25 28.5 15C28.5 7.54 22.46 1.5 15 1.5C7.54 1.5 1.5 7.54 1.5 15C1.5 25 15 40 15 40Z" fill="%237DD3FC" stroke="white" stroke-width="1.5"/>
  <defs><clipPath id="cp"><circle cx="15" cy="15" r="5.5"/></clipPath></defs>
  <circle cx="15" cy="15" r="5.5" fill="white"/>
  <circle cx="15" cy="12.8" r="2" fill="%230EA5E9" clip-path="url(%23cp)"/>
  <ellipse cx="15" cy="19.5" rx="3.8" ry="2.8" fill="%230EA5E9" clip-path="url(%23cp)"/>
</svg>`;

export function createMarkerImage(svg: string, w: number, h: number) {
  const uri = `data:image/svg+xml;charset=utf-8,${svg}`;
  return (kakao: any) =>
    new kakao.maps.MarkerImage(
      uri,
      new kakao.maps.Size(w, h),
      { offset: new kakao.maps.Point(w / 2, h) },
    );
}
