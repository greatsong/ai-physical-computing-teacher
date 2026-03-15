import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `당신은 Raspberry Pi Pico 2 W 기반 피지컬 컴퓨팅 교육 전문가입니다.
한국 고등학교 교사가 부품 선택, 프로젝트 설계, 2022 개정 교육과정 융합 수업을 준비하는 것을 돕습니다.

## 전문 영역
- Pico 2 W 호환 센서/부품 50종 이상, MicroPython 프로그래밍
- 2022 개정 교육과정 교과 연계 융합 수업 설계
  - 정보: 프로그래밍, 피지컬 컴퓨팅, 데이터 수집/분석
  - 과학탐구실험: 센서 기반 정량적 데이터 수집, 실험 자동화
  - 물리학: 속도/가속도 측정, 파동, 역학 (초음파, 가속도 센서)
  - 화학: 물질의 성질, 기체 분석 (가스, CO2, 수질 센서)
  - 생명과학: 생체 데이터, 식물 환경 (심박, 토양수분, 온습도)
  - 지구과학: 기상 관측, 대기 환경 (기압, UV, 미세먼지, GPS)
  - 기술가정: 스마트홈, 자동화, IoT (릴레이, 모터, PIR)
  - 미술: 인터랙티브 아트, 미디어 아트 (NeoPixel, OLED, LED 매트릭스)
- 학교 예산에 맞는 부품 구성 및 구매 전략
- Grove 생태계 및 배선 가이드

## Pico 2 W 기술 사양
- RP2350 듀얼 코어 (ARM Cortex-M33 + RISC-V), 520KB SRAM
- WiFi 802.11n 2.4GHz + Bluetooth 5.2 BLE 내장
- GPIO: 3.3V 로직 — 5V 센서 사용 시 레벨 시프터 필요
- ADC: GP26(A0), GP27(A1), GP28(A2) — 3채널, 12비트 (read_u16() → 0~65535)
- I2C: I2C0(GP8/9), I2C1(GP6/7) — Grove Shield는 I2C1 고정
- PWM: 모든 GPIO 가능, freq(50) 서보, freq(1000) LED 디밍
- SPI: SPI0(GP16-19), SPI1(GP10-13)
- UART: UART0(GP0/1), UART1(GP4/5)

## 구매처 정보
- 1순위: 디바이스마트 (devicemart.co.kr) — Seeed 공식 유통, 세금계산서 발행, 학교 구매 적합
- 2순위: Seeed Studio 직구 (seeedstudio.com) — 고가 부품 40~50% 절감, $50 이상 무료배송
- 기타 국내: 엘레파츠 (eleparts.co.kr), 아이씨뱅큐 (icbanq.com), 메카솔루션 (mechasolution.com)
- 글로벌: Adafruit, SparkFun, Pimoroni

## 주요 부품 가격 참고 (2026.03 기준, 디바이스마트 크롤링 확인가)
- Pico 2 WH ~9,900원 / Grove Shield ~5,500원 / I2C Hub ~2,200원
- DHT20 ~7,900원 / 빛센서 ~5,200원 / OLED 0.96" ~8,200원
- SCD41 CO2 ~114,900원 (Seeed 직구 시 ~$49.90)
- 심박센서 ~21,000원 / 초음파 ~4,900원 / 부저 ~2,100원
- LED Bar ~5,700원 / 소리센서 ~4,900원 / MPU6050 ~3,500원
- BMP280 ~2,000원 / DHT11 ~1,300원 / 먼지센서(PPD42NS) ~14,000원
- HM3301 미세먼지 ~38,800원 (Seeed ~$32.90) / TSL2591 ~6,000원
- VL53L0X ~20,700원 / PIR ~3,700원 / ADXL345 ~3,200원
- GSR ~11,000원 / MLX90614 ~17,900원 / 진동센서 ~800원
- MQ-135 ~1,500원 / 토양수분 ~3,800원 / TDS ~17,000원
- I2C LCD ~2,500원 / SH1106 OLED ~11,400원 / MAX7219 ~2,200원
- TM1637 ~1,200원 / WS2812 ~900원 / e-Paper ~31,600원
- SG90 서보 ~1,700원 / L9110S ~900원 / 28BYJ-48 ~1,300원
- Grove 릴레이 ~3,500원 / Grove 복합가스 v2 ~$29.99(Seeed 직구)
- GUVA-S12D UV ~$10.90(Seeed 직구) / RFID RC522 ~3,100원

## 응답 규칙
- 한국어로 답변
- 실용적이고 교사 친화적으로
- 구체적인 부품명, 가격, 구매처 포함
- MicroPython 코드 예시 제공 가능
- 프로젝트 아이디어는 교육과정 성취기준과 연계하여 제시
- 예산 제약이 있으면 우선순위를 매겨 추천`;

const QUICK_QUESTIONS = [
  '10만원 예산으로 추천 부품 세트는?',
  '온습도 센서 활용 융합 수업 아이디어',
  '과학탐구실험 교과 연계 프로젝트 추천',
  '초음파 센서 MicroPython 코드 예시',
  '스마트팜 프로젝트 부품 목록',
  'SCD41 대안 센서 비교',
];

export default function PartsChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isKeySet, setIsKeySet] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('pico-parts-api-key');
    if (saved) {
      setApiKey(saved);
      setIsKeySet(true);
    }
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && isKeySet && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isKeySet]);

  const saveApiKey = () => {
    const trimmed = apiKey.trim();
    if (trimmed.startsWith('sk-')) {
      sessionStorage.setItem('pico-parts-api-key', trimmed);
      setApiKey(trimmed);
      setIsKeySet(true);
      setError('');
    } else {
      setError('API 키는 sk-로 시작해야 합니다');
    }
  };

  const clearApiKey = () => {
    sessionStorage.removeItem('pico-parts-api-key');
    setApiKey('');
    setIsKeySet(false);
    setMessages([]);
    setError('');
  };

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMsg: Message = { role: 'user', content: messageText };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 2048,
          system: SYSTEM_PROMPT,
          messages: updated.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body.error?.message || `API 오류 (${res.status})`
        );
      }

      const data = await res.json();
      const assistantText = data.content?.[0]?.text || '응답을 받지 못했습니다.';
      setMessages([...updated, { role: 'assistant', content: assistantText }]);
    } catch (err: any) {
      setError(err.message || '알 수 없는 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // --- Styles ---
  const purple = '#7C3AED';
  const purpleLight = '#c4b5fd';
  const purpleBg = 'rgba(124, 58, 237, 0.08)';

  const floatingBtn: React.CSSProperties = {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: purple,
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(124, 58, 237, 0.4)',
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
  };

  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: isMobile ? '0' : '88px',
    right: isMobile ? '0' : '24px',
    width: isMobile ? '100vw' : '420px',
    height: isMobile ? '100vh' : '70vh',
    maxHeight: isMobile ? '100vh' : '600px',
    background: '#ffffff',
    borderRadius: isMobile ? '0' : '16px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    fontFamily:
      "'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
  };

  const headerStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${purple}, #6D28D9)`,
    color: 'white',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
  };

  const messagesStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const inputAreaStyle: React.CSSProperties = {
    borderTop: '1px solid #e5e7eb',
    padding: '12px 16px',
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
    flexShrink: 0,
    background: '#fafafa',
  };

  const userBubble: React.CSSProperties = {
    alignSelf: 'flex-end',
    background: purple,
    color: 'white',
    padding: '10px 14px',
    borderRadius: '16px 16px 4px 16px',
    maxWidth: '80%',
    fontSize: '14px',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  };

  const assistantBubble: React.CSSProperties = {
    alignSelf: 'flex-start',
    background: '#f3f4f6',
    color: '#1f2937',
    padding: '10px 14px',
    borderRadius: '16px 16px 16px 4px',
    maxWidth: '85%',
    fontSize: '14px',
    lineHeight: '1.7',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  };

  const quickBtnStyle: React.CSSProperties = {
    background: 'white',
    border: `1px solid ${purpleLight}`,
    borderRadius: '20px',
    padding: '6px 12px',
    fontSize: '12px',
    color: purple,
    cursor: 'pointer',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  };

  // --- Render ---
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={floatingBtn}
        title="AI 부품 상담"
        aria-label="AI 부품 상담 열기"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(124, 58, 237, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(124, 58, 237, 0.4)';
        }}
      >
        <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop on mobile */}
      {isMobile && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 9998,
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      <div style={panelStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px' }}>AI 부품 상담</div>
            <div style={{ fontSize: '11px', opacity: 0.85, marginTop: '2px' }}>
              Pico 2 W 부품 선택 &middot; 융합 수업 설계
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {isKeySet && (
              <button
                onClick={clearApiKey}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
                title="API 키 초기화"
              >
                키 초기화
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '20px',
                padding: '4px',
                lineHeight: 1,
              }}
              aria-label="닫기"
            >
              &times;
            </button>
          </div>
        </div>

        {/* API Key Screen */}
        {!isKeySet ? (
          <div style={{ padding: '24px', flex: 1 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '16px', color: '#1f2937' }}>
              Anthropic API 키 입력
            </h3>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px', lineHeight: 1.6 }}>
              Claude API 키를 입력하면 AI와 대화할 수 있습니다.
              키는 브라우저 세션에만 저장되며 서버로 전송되지 않습니다.
            </p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveApiKey()}
              placeholder="sk-ant-..."
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `2px solid ${error ? '#ef4444' : '#e5e7eb'}`,
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'monospace',
              }}
            />
            {error && (
              <p style={{ color: '#ef4444', fontSize: '12px', margin: '6px 0 0' }}>{error}</p>
            )}
            <button
              onClick={saveApiKey}
              style={{
                marginTop: '12px',
                width: '100%',
                padding: '10px',
                background: purple,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              시작하기
            </button>
            <div style={{ marginTop: '16px', padding: '12px', background: purpleBg, borderRadius: '8px' }}>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
                <strong>API 키 발급:</strong> console.anthropic.com에서 가입 후 API Keys 메뉴에서 발급받으세요. 사용량에 따라 소액의 비용이 발생합니다.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div style={messagesStyle}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 16px' }}>
                    부품 선택, 프로젝트 아이디어, 교육과정 연계 등<br />
                    무엇이든 물어보세요!
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      justifyContent: 'center',
                    }}
                  >
                    {QUICK_QUESTIONS.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(q)}
                        style={quickBtnStyle}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = purpleBg;
                          e.currentTarget.style.borderColor = purple;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'white';
                          e.currentTarget.style.borderColor = purpleLight;
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={msg.role === 'user' ? userBubble : assistantBubble}
                >
                  {msg.content}
                </div>
              ))}

              {isLoading && (
                <div style={{ ...assistantBubble, color: '#9ca3af' }}>
                  <span style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
                    생각하고 있습니다...
                  </span>
                </div>
              )}

              {error && messages.length > 0 && (
                <div
                  style={{
                    alignSelf: 'center',
                    background: '#fef2f2',
                    color: '#dc2626',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    maxWidth: '90%',
                  }}
                >
                  {error}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={inputAreaStyle}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="질문을 입력하세요... (Shift+Enter: 줄바꿈)"
                rows={1}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '14px',
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'inherit',
                  lineHeight: '1.5',
                  maxHeight: '100px',
                  overflowY: 'auto',
                }}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = 'auto';
                  el.style.height = Math.min(el.scrollHeight, 100) + 'px';
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: input.trim() && !isLoading ? purple : '#d1d5db',
                  color: 'white',
                  border: 'none',
                  cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background 0.15s',
                }}
                aria-label="전송"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Floating button (visible even when panel is open, for closing) */}
      <button
        onClick={() => setIsOpen(false)}
        style={{
          ...floatingBtn,
          background: '#6D28D9',
        }}
        aria-label="AI 상담 닫기"
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Pulse animation for loading */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </>
  );
}
