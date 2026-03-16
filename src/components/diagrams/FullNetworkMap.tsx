export default function FullNetworkMap() {
  return (
    <svg viewBox="0 0 800 680" style={{width:'100%',maxWidth:'800px',margin:'1.5rem auto',display:'block'}} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fm-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eff6ff" />
          <stop offset="50%" stopColor="#f5f3ff" />
          <stop offset="100%" stopColor="#fff1f2" />
        </linearGradient>
        <filter id="fm-glow-b"><feGaussianBlur stdDeviation="4" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <filter id="fm-glow-p"><feGaussianBlur stdDeviation="4" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <filter id="fm-glow-r"><feGaussianBlur stdDeviation="4" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <marker id="fm-arr-b" viewBox="0 0 10 8" refX="9" refY="4" markerWidth="8" markerHeight="6" orient="auto">
          <path d="M0,0 L10,4 L0,8 z" fill="#3b82f6" opacity="0.5" />
        </marker>
        <marker id="fm-arr-p" viewBox="0 0 10 8" refX="9" refY="4" markerWidth="8" markerHeight="6" orient="auto">
          <path d="M0,0 L10,4 L0,8 z" fill="#7C3AED" opacity="0.5" />
        </marker>
      </defs>

      {/* Background */}
      <rect width="800" height="680" rx="16" fill="url(#fm-bg)" />
      <text x="400" y="28" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#7C3AED">🗺️ 바이브 코딩 프로젝트 — 전체 네트워크 지도</text>

      {/* ============ TIER 1: INTERNET (blue zone) ============ */}
      <rect x="30" y="45" width="740" height="95" rx="12" fill="#3b82f6" fillOpacity="0.05" stroke="#3b82f6" strokeWidth="2" strokeDasharray="10,5" opacity="0.3" />
      <rect x="38" y="37" width="220" height="18" rx="4" fill="#eff6ff" />
      <text x="48" y="50" fontSize="10" fontWeight="bold" fill="#3b82f6" opacity="0.7">☁️ 인터넷 — 공공데이터 전광판만 사용</text>

      {/* API nodes */}
      <circle cx="140" cy="92" r="28" fill="white" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="140" y="88" textAnchor="middle" fontSize="18">🍱</text>
      <text x="140" y="108" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#3b82f6">나이스</text>

      <circle cx="300" cy="92" r="28" fill="white" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="300" y="88" textAnchor="middle" fontSize="18">🌤️</text>
      <text x="300" y="108" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#3b82f6">기상청</text>

      <circle cx="460" cy="92" r="28" fill="white" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="460" y="88" textAnchor="middle" fontSize="18">😷</text>
      <text x="460" y="108" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#3b82f6">에어코리아</text>

      <circle cx="620" cy="92" r="28" fill="white" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="620" y="88" textAnchor="middle" fontSize="18">🚌</text>
      <text x="620" y="108" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#3b82f6">버스 API</text>

      {/* Internet → Router connection lines */}
      <line x1="300" y1="120" x2="400" y2="190" stroke="#3b82f6" strokeWidth="2" strokeDasharray="8,4" opacity="0.2" markerEnd="url(#fm-arr-b)">
        <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1.5s" repeatCount="indefinite" />
      </line>
      <line x1="460" y1="120" x2="400" y2="190" stroke="#3b82f6" strokeWidth="2" strokeDasharray="8,4" opacity="0.2" markerEnd="url(#fm-arr-b)">
        <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1.5s" repeatCount="indefinite" />
      </line>
      {/* Animated dots from Internet → Router */}
      <circle r="4" fill="#3b82f6" filter="url(#fm-glow-b)">
        <animateMotion dur="2s" repeatCount="indefinite" path="M300,120 L400,190" />
        <animate attributeName="r" values="3;6;3" dur="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.2;1" dur="0.8s" repeatCount="indefinite" />
      </circle>
      <circle r="4" fill="#3b82f6" filter="url(#fm-glow-b)">
        <animateMotion dur="2.3s" repeatCount="indefinite" path="M460,120 L400,190" begin="0.5s" />
        <animate attributeName="r" values="3;6;3" dur="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.2;1" dur="0.8s" repeatCount="indefinite" />
      </circle>

      {/* ============ TIER 2: SCHOOL LAN (purple zone) ============ */}
      <rect x="30" y="160" width="740" height="280" rx="12" fill="#7C3AED" fillOpacity="0.03" stroke="#7C3AED" strokeWidth="2.5" strokeDasharray="12,6" opacity="0.2" />
      <rect x="38" y="152" width="370" height="18" rx="4" fill="#f5f3ff" />
      <text x="48" y="165" fontSize="10" fontWeight="bold" fill="#7C3AED" opacity="0.7">🏫 학교 LAN — Wi-Fi 모니터 / 공공데이터 / 센서 실험실</text>

      {/* Router */}
      <circle cx="400" cy="210" r="38" fill="white" stroke="#7C3AED" strokeWidth="2.5" />
      <text x="400" y="205" textAnchor="middle" fontSize="24">📡</text>
      <text x="400" y="230" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#7C3AED">학교 공유기</text>
      <rect x="380" y="238" width="40" height="14" rx="7" fill="#7C3AED" />
      <text x="400" y="248" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white">AP</text>

      {/* Router → Pico connection */}
      <line x1="400" y1="248" x2="400" y2="310" stroke="#F43F5E" strokeWidth="2.5" strokeDasharray="8,4" opacity="0.3">
        <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1s" repeatCount="indefinite" />
      </line>

      {/* Pico (center of school LAN) */}
      <circle cx="400" cy="340" r="38" fill="#FFF1F2" stroke="#F43F5E" strokeWidth="2.5" />
      <text x="400" y="332" textAnchor="middle" fontSize="22">🔧</text>
      <text x="400" y="355" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#F43F5E">Pico (STA)</text>
      <rect x="360" y="362" width="80" height="14" rx="7" fill="#F43F5E" />
      <text x="400" y="372" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">STA + 웹서버</text>

      {/* Animated dot Router ↔ Pico */}
      <circle r="5" fill="#F43F5E" filter="url(#fm-glow-r)">
        <animateMotion dur="1.2s" repeatCount="indefinite" path="M400,248 L400,310" />
        <animate attributeName="r" values="3;7;3" dur="0.7s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.2;1" dur="0.7s" repeatCount="indefinite" />
      </circle>

      {/* Sensor → Pico (wired, left) */}
      <line x1="220" y1="380" x2="365" y2="345" stroke="#F59E0B" strokeWidth="2" opacity="0.4" />
      <circle cx="190" cy="388" r="28" fill="white" stroke="#F59E0B" strokeWidth="1.5" />
      <text x="190" y="385" textAnchor="middle" fontSize="18">🌡️</text>
      <text x="190" y="405" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#b45309">물리 센서</text>
      <text x="190" y="418" textAnchor="middle" fontSize="7" fill="#64748b">전선 연결</text>
      <circle r="4" fill="#F59E0B">
        <animateMotion dur="1.5s" repeatCount="indefinite" path="M220,380 L365,345" />
        <animate attributeName="r" values="2;5;2" dur="0.7s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.2;1" dur="0.7s" repeatCount="indefinite" />
      </circle>

      {/* Pico → Browser devices (right) */}
      <line x1="438" y1="340" x2="570" y2="290" stroke="#7C3AED" strokeWidth="2" strokeDasharray="8,4" opacity="0.2" markerEnd="url(#fm-arr-p)">
        <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1.5s" repeatCount="indefinite" />
      </line>
      <line x1="438" y1="350" x2="590" y2="360" stroke="#7C3AED" strokeWidth="2" strokeDasharray="8,4" opacity="0.2" markerEnd="url(#fm-arr-p)">
        <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1.5s" repeatCount="indefinite" />
      </line>
      <line x1="438" y1="360" x2="570" y2="410" stroke="#7C3AED" strokeWidth="2" strokeDasharray="8,4" opacity="0.2" markerEnd="url(#fm-arr-p)">
        <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1.5s" repeatCount="indefinite" />
      </line>

      {/* Browser devices */}
      <circle cx="600" cy="280" r="28" fill="white" stroke="#10b981" strokeWidth="1.5" />
      <text x="600" y="276" textAnchor="middle" fontSize="18">💻</text>
      <text x="600" y="296" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1e293b">노트북</text>

      <circle cx="625" cy="355" r="28" fill="white" stroke="#10b981" strokeWidth="1.5" />
      <text x="625" y="351" textAnchor="middle" fontSize="18">📱</text>
      <text x="625" y="371" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1e293b">스마트폰</text>

      <circle cx="600" cy="420" r="28" fill="white" stroke="#10b981" strokeWidth="1.5" />
      <text x="600" y="416" textAnchor="middle" fontSize="18">📺</text>
      <text x="600" y="436" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1e293b">전자칠판</text>

      {/* Animated dots to browsers */}
      <circle r="4" fill="#7C3AED" filter="url(#fm-glow-p)">
        <animateMotion dur="1.8s" repeatCount="indefinite" path="M438,340 L570,290" />
        <animate attributeName="r" values="3;6;3" dur="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.2;1" dur="0.8s" repeatCount="indefinite" />
      </circle>
      <circle r="4" fill="#7C3AED" filter="url(#fm-glow-p)">
        <animateMotion dur="2s" repeatCount="indefinite" path="M438,350 L590,360" begin="0.3s" />
        <animate attributeName="r" values="3;6;3" dur="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.2;1" dur="0.8s" repeatCount="indefinite" />
      </circle>
      <circle r="4" fill="#7C3AED" filter="url(#fm-glow-p)">
        <animateMotion dur="2.2s" repeatCount="indefinite" path="M438,360 L570,410" begin="0.6s" />
        <animate attributeName="r" values="3;6;3" dur="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.2;1" dur="0.8s" repeatCount="indefinite" />
      </circle>

      {/* ============ TIER 3: DRAGONBALL INDEPENDENT (rose zone) ============ */}
      <rect x="30" y="470" width="740" height="190" rx="12" fill="#F43F5E" fillOpacity="0.03" stroke="#F43F5E" strokeWidth="2.5" strokeDasharray="12,6" opacity="0.2" />
      <rect x="38" y="462" width="350" height="18" rx="4" fill="#fff1f2" />
      <text x="48" y="475" fontSize="10" fontWeight="bold" fill="#F43F5E" opacity="0.7">🐉 독립 네트워크 — 드래곤볼 레이더 (학교 Wi-Fi 불필요!)</text>

      {/* Dragonball beacons (AP mode) */}
      <circle cx="100" cy="560" r="25" fill="white" stroke="#F43F5E" strokeWidth="1.5" />
      <text x="100" y="557" textAnchor="middle" fontSize="16">🟠</text>
      <text x="100" y="577" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#F43F5E">DB1</text>
      <rect x="80" y="584" width="40" height="12" rx="6" fill="#F43F5E" />
      <text x="100" y="593" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">AP</text>

      <circle cx="220" cy="530" r="25" fill="white" stroke="#F43F5E" strokeWidth="1.5" />
      <text x="220" y="527" textAnchor="middle" fontSize="16">🟠</text>
      <text x="220" y="547" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#F43F5E">DB2</text>
      <rect x="200" y="554" width="40" height="12" rx="6" fill="#F43F5E" />
      <text x="220" y="563" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">AP</text>

      <circle cx="160" cy="620" r="25" fill="white" stroke="#F43F5E" strokeWidth="1.5" />
      <text x="160" y="617" textAnchor="middle" fontSize="16">🟠</text>
      <text x="160" y="637" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#F43F5E">DB3</text>
      <rect x="140" y="644" width="40" height="12" rx="6" fill="#F43F5E" />
      <text x="160" y="653" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">AP</text>

      {/* RSSI signal lines from beacons → radar */}
      <line x1="125" y1="555" x2="380" y2="565" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.15">
        <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2s" repeatCount="indefinite" />
      </line>
      <line x1="245" y1="530" x2="380" y2="555" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.15">
        <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2s" repeatCount="indefinite" />
      </line>
      <line x1="185" y1="618" x2="380" y2="575" stroke="#F43F5E" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.15">
        <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2s" repeatCount="indefinite" />
      </line>

      {/* RSSI animated dots */}
      <circle r="3" fill="#F43F5E" filter="url(#fm-glow-r)">
        <animateMotion dur="3s" repeatCount="indefinite" path="M125,555 L380,565" />
        <animate attributeName="r" values="2;5;2" dur="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.2;0.9" dur="0.8s" repeatCount="indefinite" />
      </circle>
      <circle r="3" fill="#F43F5E" filter="url(#fm-glow-r)">
        <animateMotion dur="2.5s" repeatCount="indefinite" path="M245,530 L380,555" begin="0.8s" />
        <animate attributeName="r" values="2;5;2" dur="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.2;0.9" dur="0.8s" repeatCount="indefinite" />
      </circle>
      <circle r="3" fill="#F43F5E" filter="url(#fm-glow-r)">
        <animateMotion dur="3.2s" repeatCount="indefinite" path="M185,618 L380,575" begin="1.4s" />
        <animate attributeName="r" values="2;5;2" dur="0.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.2;0.9" dur="0.8s" repeatCount="indefinite" />
      </circle>

      {/* Radar Pico (dual mode STA+AP) */}
      <circle cx="420" cy="565" r="38" fill="#FFF1F2" stroke="#F43F5E" strokeWidth="2.5" />
      <text x="420" y="555" textAnchor="middle" fontSize="22">🔍</text>
      <text x="420" y="575" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#F43F5E">레이더 Pico</text>
      <rect x="380" y="585" width="80" height="14" rx="7" fill="linear-gradient(90deg,#7C3AED,#F43F5E)" />
      <rect x="380" y="585" width="80" height="14" rx="7" fill="#F43F5E" />
      <text x="420" y="595" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">STA + AP</text>

      {/* Radar → Phone */}
      <line x1="458" y1="565" x2="570" y2="565" stroke="#F43F5E" strokeWidth="2" strokeDasharray="8,4" opacity="0.2">
        <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1.2s" repeatCount="indefinite" />
      </line>
      <circle r="4" fill="#F43F5E" filter="url(#fm-glow-r)">
        <animateMotion dur="1.5s" repeatCount="indefinite" path="M458,565 L570,565" begin="0.3s" />
        <animate attributeName="r" values="3;6;3" dur="0.7s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.2;1" dur="0.7s" repeatCount="indefinite" />
      </circle>

      {/* Phone connected to radar */}
      <circle cx="600" cy="565" r="28" fill="white" stroke="#F43F5E" strokeWidth="1.5" />
      <text x="600" y="561" textAnchor="middle" fontSize="18">📱</text>
      <text x="600" y="581" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1e293b">스마트폰</text>
      <text x="600" y="605" textAnchor="middle" fontSize="7" fill="#F43F5E">"DragonRadar" Wi-Fi</text>

      {/* RSSI label */}
      <text x="280" y="540" fontSize="8" fill="#F43F5E" fontWeight="bold" opacity="0.5">📻 RSSI 신호</text>

      {/* === LEGEND === */}
      <rect x="620" y="480" width="140" height="75" rx="8" fill="white" fillOpacity="0.9" stroke="#e2e8f0" strokeWidth="1" />
      <text x="635" y="498" fontSize="9" fontWeight="bold" fill="#64748b">범례</text>
      <line x1="635" y1="512" x2="660" y2="512" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,3" opacity="0.5" />
      <text x="665" y="515" fontSize="8" fill="#64748b">인터넷</text>
      <line x1="635" y1="528" x2="660" y2="528" stroke="#7C3AED" strokeWidth="2" strokeDasharray="6,3" opacity="0.5" />
      <text x="665" y="531" fontSize="8" fill="#64748b">학교 Wi-Fi</text>
      <line x1="635" y1="544" x2="660" y2="544" stroke="#F43F5E" strokeWidth="2" strokeDasharray="6,3" opacity="0.5" />
      <text x="665" y="547" fontSize="8" fill="#64748b">독립 네트워크</text>
    </svg>
  );
}
