/**
 * SVG Data URIs for Transformasi Geometri Questions
 * Visual Cartesian diagrams illustrating translation, reflection, rotation, and dilation.
 */

function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

export const svgTransformasi1 = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 280" width="100%" height="100%">
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#4f46e5" />
    </marker>
    <marker id="axisArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
    </marker>
  </defs>
  <rect width="420" height="280" fill="#f8fafc" rx="12" stroke="#e2e8f0" stroke-width="2"/>
  
  <!-- Grid -->
  <g stroke="#e2e8f0" stroke-width="1">
    <line x1="30" y1="40" x2="390" y2="40"/>
    <line x1="30" y1="80" x2="390" y2="80"/>
    <line x1="30" y1="120" x2="390" y2="120"/>
    <line x1="30" y1="160" x2="390" y2="160"/>
    <line x1="30" y1="200" x2="390" y2="200"/>
    <line x1="30" y1="240" x2="390" y2="240"/>
    
    <line x1="70" y1="20" x2="70" y2="260"/>
    <line x1="120" y1="20" x2="120" y2="260"/>
    <line x1="170" y1="20" x2="170" y2="260"/>
    <line x1="220" y1="20" x2="220" y2="260"/>
    <line x1="270" y1="20" x2="270" y2="260"/>
    <line x1="320" y1="20" x2="320" y2="260"/>
    <line x1="370" y1="20" x2="370" y2="260"/>
  </g>

  <!-- Axes (Origin at 120, 200) -->
  <line x1="40" y1="200" x2="395" y2="200" stroke="#475569" stroke-width="2" marker-end="url(#axisArrow)"/>
  <line x1="120" y1="260" x2="120" y2="25" stroke="#475569" stroke-width="2" marker-end="url(#axisArrow)"/>
  <text x="390" y="218" font-family="sans-serif" font-size="12" font-weight="bold" fill="#475569">X</text>
  <text x="105" y="32" font-family="sans-serif" font-size="12" font-weight="bold" fill="#475569">Y</text>
  <text x="108" y="215" font-family="sans-serif" font-size="11" fill="#64748b">O</text>

  <!-- Ticks -->
  <text x="170" y="215" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#64748b">2</text>
  <text x="220" y="215" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#64748b">4</text>
  <text x="270" y="215" font-family="sans-serif" font-size="10" text-anchor="middle" fill="#64748b">6</text>
  <text x="105" y="164" font-family="sans-serif" font-size="10" text-anchor="end" fill="#64748b">1</text>
  <text x="105" y="124" font-family="sans-serif" font-size="10" text-anchor="end" fill="#64748b">2</text>
  <text x="105" y="84" font-family="sans-serif" font-size="10" text-anchor="end" fill="#64748b">3</text>

  <!-- Point A(2, 3) -> at x=170, y=80 -->
  <circle cx="170" cy="80" r="5" fill="#4f46e5"/>
  <text x="170" y="68" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#312e81">A (2, 3)</text>

  <!-- Translation Vector T(4, -1) -> dx = +4 ticks (100px), dy = -1 tick (+40px downward) to (270, 120) -->
  <line x1="170" y1="80" x2="265" y2="118" stroke="#4f46e5" stroke-width="2.5" stroke-dasharray="4,3" marker-end="url(#arrow)"/>
  <rect x="185" y="88" width="80" height="20" rx="4" fill="#e0e7ff" opacity="0.9"/>
  <text x="225" y="102" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle" fill="#3730a3">T(4, -1)</text>

  <!-- Target indicator question mark at (270, 120) -->
  <circle cx="270" cy="120" r="4" fill="#9333ea" stroke="#ffffff" stroke-width="2"/>
  <text x="282" y="124" font-family="sans-serif" font-size="12" font-weight="bold" fill="#7e22ce">A' (?, ?)</text>
</svg>
`);

export const svgTransformasi2 = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 280" width="100%" height="100%">
  <defs>
    <marker id="axisArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
    </marker>
  </defs>
  <rect width="420" height="280" fill="#f8fafc" rx="12" stroke="#e2e8f0" stroke-width="2"/>
  
  <!-- Grid -->
  <g stroke="#e2e8f0" stroke-width="1">
    <line x1="30" y1="50" x2="390" y2="50"/>
    <line x1="30" y1="90" x2="390" y2="90"/>
    <line x1="30" y1="140" x2="390" y2="140"/>
    <line x1="30" y1="190" x2="390" y2="190"/>
    <line x1="30" y1="230" x2="390" y2="230"/>
    <line x1="80" y1="20" x2="80" y2="260"/>
    <line x1="140" y1="20" x2="140" y2="260"/>
    <line x1="210" y1="20" x2="210" y2="260"/>
    <line x1="280" y1="20" x2="280" y2="260"/>
    <line x1="340" y1="20" x2="340" y2="260"/>
  </g>

  <!-- Axes (Origin at 210, 140) -->
  <line x1="30" y1="140" x2="395" y2="140" stroke="#dc2626" stroke-width="3" marker-end="url(#axisArrow)"/>
  <line x1="210" y1="260" x2="210" y2="25" stroke="#475569" stroke-width="2" marker-end="url(#axisArrow)"/>
  
  <text x="390" y="132" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626">Cermin: Sumbu X</text>
  <text x="195" y="32" font-family="sans-serif" font-size="12" font-weight="bold" fill="#475569">Y</text>
  <text x="198" y="155" font-family="sans-serif" font-size="11" fill="#64748b">O</text>

  <!-- Point B(-3, 5) -> x=-3 (left, at 140), y=5 (up, at 50) -->
  <circle cx="140" cy="50" r="5" fill="#2563eb"/>
  <text x="135" y="42" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#1e40af">B (-3, 5)</text>

  <!-- Projection across Sumbu X -->
  <line x1="140" y1="50" x2="140" y2="230" stroke="#9333ea" stroke-width="1.8" stroke-dasharray="4,4"/>
  
  <!-- Target B' -->
  <circle cx="140" cy="230" r="4.5" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>
  <text x="135" y="248" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="#991b1b">B' (?, ?)</text>
</svg>
`);

export const svgTransformasi3 = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 280" width="100%" height="100%">
  <defs>
    <marker id="axisArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
    </marker>
  </defs>
  <rect width="420" height="280" fill="#f8fafc" rx="12" stroke="#e2e8f0" stroke-width="2"/>
  
  <!-- Axes Origin at 140, 200 -->
  <line x1="40" y1="200" x2="390" y2="200" stroke="#64748b" stroke-width="2" marker-end="url(#axisArrow)"/>
  <line x1="140" y1="260" x2="140" y2="25" stroke="#64748b" stroke-width="2" marker-end="url(#axisArrow)"/>
  
  <!-- Mirror line y = x (passes through 140,200 and slopes 45 deg up to right) -->
  <line x1="60" y1="280" x2="340" y2="0" stroke="#ea580c" stroke-width="2.5" stroke-dasharray="6,4"/>
  <rect x="290" y="20" width="100" height="22" rx="4" fill="#ffedd5" stroke="#fed7aa"/>
  <text x="340" y="35" font-family="sans-serif" font-size="11" font-weight="bold" text-anchor="middle" fill="#c2410c">Garis Cermin: y = x</text>

  <!-- Point C(1, 4) -->
  <circle cx="165" cy="100" r="5" fill="#2563eb"/>
  <text x="150" y="94" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e40af">C (1, 4)</text>

  <!-- Reflection line perpendicular to y=x -->
  <line x1="165" y1="100" x2="240" y2="175" stroke="#9333ea" stroke-width="1.8" stroke-dasharray="3,3"/>
  
  <!-- Target C' -->
  <circle cx="240" cy="175" r="5" fill="#ea580c" stroke="#ffffff" stroke-width="1.5"/>
  <text x="250" y="180" font-family="sans-serif" font-size="12" font-weight="bold" fill="#9a3412">C' (?, ?)</text>
</svg>
`);

export const svgTransformasi4 = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 280" width="100%" height="100%">
  <defs>
    <marker id="rotArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
    </marker>
    <marker id="axisArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
    </marker>
  </defs>
  <rect width="420" height="280" fill="#f8fafc" rx="12" stroke="#e2e8f0" stroke-width="2"/>
  
  <!-- Axes Origin at 210, 180 -->
  <line x1="40" y1="180" x2="390" y2="180" stroke="#64748b" stroke-width="2" marker-end="url(#axisArrow)"/>
  <line x1="210" y1="260" x2="210" y2="25" stroke="#64748b" stroke-width="2" marker-end="url(#axisArrow)"/>
  <circle cx="210" cy="180" r="4" fill="#0f172a"/>
  <text x="218" y="195" font-family="sans-serif" font-size="11" font-weight="bold" fill="#334155">Pusat O (0,0)</text>

  <!-- Point D(2, 5) -> x=240, y=70 -->
  <circle cx="240" cy="70" r="5" fill="#4f46e5"/>
  <text x="248" y="68" font-family="sans-serif" font-size="12" font-weight="bold" fill="#3730a3">D (2, 5)</text>
  <line x1="210" y1="180" x2="240" y2="70" stroke="#94a3b8" stroke-width="1.5"/>

  <!-- Arc 90 degrees CCW to D'(-5, 2) -> at x=100, y=150 -->
  <path d="M 240 70 A 114 114 0 0 0 105 145" fill="none" stroke="#059669" stroke-width="2.5" stroke-dasharray="5,3" marker-end="url(#rotArrow)"/>
  <text x="185" y="85" font-family="sans-serif" font-size="12" font-weight="bold" fill="#047857">Rotasi +90°</text>

  <circle cx="100" cy="150" r="5" fill="#059669" stroke="#ffffff" stroke-width="1.5"/>
  <line x1="210" y1="180" x2="100" y2="150" stroke="#94a3b8" stroke-width="1.5"/>
  <text x="75" y="140" font-family="sans-serif" font-size="12" font-weight="bold" fill="#065f46">D' (?, ?)</text>
</svg>
`);

export const svgTransformasi5 = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 280" width="100%" height="100%">
  <defs>
    <marker id="axisArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
    </marker>
  </defs>
  <rect width="420" height="280" fill="#f8fafc" rx="12" stroke="#e2e8f0" stroke-width="2"/>
  
  <!-- Axes Origin at 260, 220 -->
  <line x1="30" y1="220" x2="390" y2="220" stroke="#64748b" stroke-width="2" marker-end="url(#axisArrow)"/>
  <line x1="260" y1="260" x2="260" y2="25" stroke="#64748b" stroke-width="2" marker-end="url(#axisArrow)"/>
  <circle cx="260" cy="220" r="4" fill="#0f172a"/>
  <text x="268" y="235" font-family="sans-serif" font-size="11" font-weight="bold" fill="#334155">O (0,0)</text>

  <!-- Dilatation ray from O through E(-2, 4) to E'(-6, 12) -->
  <line x1="260" y1="220" x2="70" y2="30" stroke="#d97706" stroke-width="2" stroke-dasharray="4,4"/>

  <!-- Point E(-2, 4) -> x=200, y=160 -->
  <circle cx="200" cy="160" r="5" fill="#2563eb"/>
  <text x="185" y="180" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e40af">E (-2, 4)</text>

  <!-- Target Point E' (k = 3) -> at x=80, y=40 -->
  <circle cx="80" cy="40" r="6" fill="#d97706" stroke="#ffffff" stroke-width="2"/>
  <text x="80" y="25" font-family="sans-serif" font-size="12" font-weight="bold" fill="#b45309">E' [k = 3] (?, ?)</text>
</svg>
`);
