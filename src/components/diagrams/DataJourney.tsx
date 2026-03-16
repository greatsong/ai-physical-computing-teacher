export default function DataJourney() {
  return (
    <svg viewBox="0 0 800 300" style={{width:'100%',maxWidth:'800px',margin:'1.5rem auto',display:'block'}} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dj-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fdf2f8" />
          <stop offset="50%" stopColor="#f5f3ff" />
          <stop offset="100%" stopColor="#ecfdf5" />
        </linearGradient>
        <filter id="dj-glow"><feGaussianBlur stdDeviation="5" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <marker id="dj-arr" viewBox="0 0 12 8" refX="10" refY="4" markerWidth="10" markerHeight="7" orient="auto">
          <path d="M0,0 L12,4 L0,8 z" fill="#7C3AED" opacity="0.4" />
        </marker>
      </defs>

      {/* Background */}
      <rect width="800" height="300" rx="16" fill="url(#dj-bg)" />

      {/* Title */}
      <text x="400" y="30" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#7C3AED">🔵 온도 26.5°C의 여행 — 빛나는 점을 따라가 보세요!</text>

      {/* === CONNECTION PATHS (thick arrows) === */}
      {/* Sensor → Pico */}
      <line x1="155" y1="140" x2="285" y2="140" stroke="#F43F5E" strokeWidth="3" strokeDasharray="10,5" opacity="0.25" markerEnd="url(#dj-arr)">
        <animate attributeName="stroke-dashoffset" from="0" to="-30" dur="1.5s" repeatCount="indefinite" />
      </line>
      <text x="220" y="128" textAnchor="middle" fontSize="8" fill="#F43F5E" fontWeight="bold" opacity="0.7">I2C 전선</text>

      {/* Pico → Wi-Fi */}
      <line x1="375" y1="140" x2="505" y2="140" stroke="#F59E0B" strokeWidth="3" strokeDasharray="10,5" opacity="0.25" markerEnd="url(#dj-arr)">
        <animate attributeName="stroke-dashoffset" from="0" to="-30" dur="1.5s" repeatCount="indefinite" />
      </line>
      <text x="440" y="128" textAnchor="middle" fontSize="8" fill="#b45309" fontWeight="bold" opacity="0.7">HTTP 서빙</text>

      {/* Wi-Fi → Browser */}
      <line x1="595" y1="140" x2="695" y2="140" stroke="#10b981" strokeWidth="3" strokeDasharray="10,5" opacity="0.25" markerEnd="url(#dj-arr)">
        <animate attributeName="stroke-dashoffset" from="0" to="-30" dur="1.5s" repeatCount="indefinite" />
      </line>
      <text x="645" y="128" textAnchor="middle" fontSize="8" fill="#10b981" fontWeight="bold" opacity="0.7">fetch()</text>

      {/* === ANIMATED DATA PACKET (main star!) === */}
      {/* Full journey: Sensor → Pico → Wi-Fi → Browser */}
      <circle r="8" fill="#7C3AED" filter="url(#dj-glow)">
        <animateMotion dur="5s" repeatCount="indefinite" path="M110,140 L330,140 L550,140 L740,140" calcMode="spline" keyTimes="0;0.3;0.65;1" keySplines="0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1" />
        <animate attributeName="r" values="5;10;5;10;5;10;5" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.3;1;0.3;1;0.3;1" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="fill" values="#F43F5E;#F43F5E;#F59E0B;#F59E0B;#10b981;#10b981;#7C3AED" dur="5s" repeatCount="indefinite" />
      </circle>
      {/* Second dot (delayed) */}
      <circle r="6" fill="#7C3AED" filter="url(#dj-glow)" opacity="0.6">
        <animateMotion dur="5s" repeatCount="indefinite" path="M110,140 L330,140 L550,140 L740,140" begin="2.5s" calcMode="spline" keyTimes="0;0.3;0.65;1" keySplines="0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1" />
        <animate attributeName="r" values="4;8;4;8;4;8;4" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0.2;0.7;0.2;0.7;0.2;0.7" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="fill" values="#F43F5E;#F43F5E;#F59E0B;#F59E0B;#10b981;#10b981;#7C3AED" dur="5s" repeatCount="indefinite" />
      </circle>

      {/* === STAGE NODES === */}
      {/* Stage 1: Sensor */}
      <circle cx="110" cy="140" r="45" fill="white" stroke="#F43F5E" strokeWidth="2.5" />
      <text x="110" y="132" textAnchor="middle" fontSize="30">🌡️</text>
      <text x="110" y="165" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#F43F5E">센서</text>
      <rect x="72" y="195" width="76" height="20" rx="10" fill="#F43F5E" fillOpacity="0.1" />
      <text x="110" y="209" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#F43F5E" fontFamily="monospace">0.82V</text>
      <text x="110" y="230" textAnchor="middle" fontSize="8" fill="#64748b">전기 신호</text>

      {/* Stage 2: Pico */}
      <circle cx="330" cy="140" r="45" fill="white" stroke="#F59E0B" strokeWidth="2.5" />
      <text x="330" y="132" textAnchor="middle" fontSize="30">📡</text>
      <text x="330" y="165" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#b45309">Pico</text>
      <rect x="287" y="195" width="86" height="20" rx="10" fill="#F59E0B" fillOpacity="0.1" />
      <text x="330" y="209" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#b45309" fontFamily="monospace">26.5</text>
      <text x="330" y="230" textAnchor="middle" fontSize="8" fill="#64748b">Python 변환</text>

      {/* Stage 3: Wi-Fi */}
      <circle cx="550" cy="140" r="45" fill="white" stroke="#3b82f6" strokeWidth="2.5" />
      <text x="550" y="132" textAnchor="middle" fontSize="30">📶</text>
      <text x="550" y="165" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#3b82f6">Wi-Fi</text>
      <rect x="486" y="195" width="128" height="20" rx="10" fill="#3b82f6" fillOpacity="0.1" />
      <text x="550" y="209" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#3b82f6" fontFamily="monospace">{`{"temp":26.5}`}</text>
      <text x="550" y="230" textAnchor="middle" fontSize="8" fill="#64748b">JSON 전송</text>

      {/* Stage 4: Screen */}
      <circle cx="740" cy="140" r="45" fill="white" stroke="#10b981" strokeWidth="2.5" />
      <text x="740" y="132" textAnchor="middle" fontSize="30">📱</text>
      <text x="740" y="165" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#10b981">화면</text>
      <rect x="700" y="195" width="80" height="20" rx="10" fill="#10b981" fillOpacity="0.1" />
      <text x="740" y="209" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#10b981">📊 26.5°C</text>
      <text x="740" y="230" textAnchor="middle" fontSize="8" fill="#64748b">그래프 표시</text>

      {/* Bottom: timing info */}
      <text x="400" y="270" textAnchor="middle" fontSize="10" fill="#64748b">⏱️ 이 여행이 5초마다 반복 → "실시간" 대시보드!</text>
      <text x="400" y="288" textAnchor="middle" fontSize="9" fill="#7C3AED" fontWeight="bold">💡 매번 전체 페이지가 아니라 JSON 데이터만 반복 전송</text>
    </svg>
  );
}
