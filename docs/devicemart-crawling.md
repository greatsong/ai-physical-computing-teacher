# 전자부품 가격 크롤링 방법론

> 최종 수행일: 2026-03-15
> 대상: devicemart.co.kr (Playwright), seeedstudio.com (GraphQL API)

---

# Part A: Seeed Studio 크롤링 (GraphQL API)

> 도구: HTTP 요청 (fetch/curl) — **Playwright 불필요**
> 대상: seeedstudio.com

---

## A-1. 핵심 정보

### GraphQL API 엔드포인트

```
https://www.seeedstudio.com/graphql
```

- **인증 불필요** (공개 API)
- Magento 2 기반 이커머스 플랫폼의 기본 GraphQL API
- GET 또는 POST 모두 지원
- 프론트엔드는 Vue.js + Tailwind CSS + Algolia InstantSearch

### 왜 API를 사용해야 하는가

- Seeed Studio는 **SPA(Single Page Application)** 구조
- HTML을 직접 가져오면 가격/제품 정보가 없음 (JavaScript로 동적 렌더링)
- REST API (`/rest/V1/products`)는 **401 인증 필요**로 사용 불가
- **GraphQL API만 공개 접근 가능**

---

## A-2. 크롤링 방법

### 방법 1: SKU 기반 배치 조회 (최고 효율)

한 번의 요청으로 다수 제품의 가격을 동시 조회:

```graphql
{
  products(
    filter: { sku: { in: ["101020820", "101020043", "101020613"] } }
    pageSize: 20
  ) {
    total_count
    items {
      name
      sku
      url_key
      stock_status
      price_range {
        minimum_price {
          regular_price { value, currency }
          final_price { value, currency }
          discount { amount_off, percent_off }
        }
      }
    }
  }
}
```

**curl 예시:**

```bash
curl -s 'https://www.seeedstudio.com/graphql' \
  -H 'Content-Type: application/json' \
  -d '{"query":"{products(filter:{sku:{in:[\"101020820\",\"101020043\"]}},pageSize:20){items{name,sku,price_range{minimum_price{final_price{value,currency}}},stock_status}}}"}'
```

**GET 방식 URL:**

```
https://www.seeedstudio.com/graphql?query={products(filter:{sku:{in:["101020820","101020043"]}},pageSize:20){items{name,sku,price_range{minimum_price{final_price{value,currency}}},stock_status}}}
```

### 방법 2: 제품명 검색

```graphql
{
  products(
    search: "Grove UV Sensor GUVA-S12D"
    pageSize: 5
  ) {
    items {
      name
      sku
      url_key
      price_range {
        minimum_price {
          final_price { value, currency }
        }
      }
      stock_status
    }
  }
}
```

### 방법 3: URL key로 정확 조회

```graphql
{
  products(
    filter: { url_key: { eq: "Grove-Multichannel-Gas-Sensor-v2-p-4569" } }
  ) {
    items { name, sku, price_range { minimum_price { final_price { value, currency } } } }
  }
}
```

---

## A-3. 주요 SKU 참조 테이블

| 제품명 | SKU | 확인 가격 (USD) | 재고 |
|--------|-----|----------------:|------|
| Grove Multichannel Gas Sensor v2 | 101020820 | $29.99 | IN_STOCK |
| Grove UV Sensor (GUVA-S12D) | 101020043 | $10.90 | IN_STOCK |
| Grove Laser PM2.5 Sensor (HM3301) | 101020613 | $32.90 | IN_STOCK |
| Grove DHT20 온습도 | 101020932 | $4.90 | IN_STOCK |
| Grove SCD41 CO2 | 101021025 | $49.90 | IN_STOCK |
| Grove 빛 센서 v1.2 | 101020132 | $2.90 | IN_STOCK |
| Grove 초음파 센서 | 101020010 | $3.90 | IN_STOCK |
| Grove OLED 0.96" | 104020208 | $5.50 | IN_STOCK |

---

## A-4. API 특성 요약

| 항목 | 내용 |
|------|------|
| 엔드포인트 | `https://www.seeedstudio.com/graphql` |
| 인증 | **불필요** (공개 API) |
| 프로토콜 | GraphQL (GET 또는 POST) |
| 배치 조회 | SKU 배열로 한 번에 10+ 제품 조회 가능 |
| 페이지네이션 | `pageSize`, `currentPage` 지원 |
| 가격 필드 | `final_price` = 실제 판매가 (할인 반영), `regular_price` = 정가 |
| 반환 가능 필드 | name, sku, url_key, price_range, stock_status, media_gallery, categories, short_description |

## A-5. 주의사항

1. **`final_price`를 사용** — 할인 시 실제 판매가가 여기에 반영됨
2. **Rate limit 주의** — 과도한 요청은 차단될 수 있으므로 적절한 딜레이 권장
3. **SKU 기반이 가장 정확** — 검색은 관련성 기반이라 의도치 않은 결과 포함 가능
4. **REST API 사용 불가** — `/rest/V1/products`는 401 인증 필요

---
---

# Part B: 디바이스마트 크롤링 (Playwright)

> 도구: Playwright (headless Chromium)
> 대상: devicemart.co.kr

---

## 1. 핵심 정보

### 검색 URL 패턴

```
https://www.devicemart.co.kr/goods/search?search_text=검색어
```

- **주의:** 예전 URL인 `/goods/list?keyword=검색어`는 **404 반환**됨
- 현재 URL은 `topSearchForm` 폼의 `search_text` input 기반
- 한글 검색어도 URL 인코딩 없이 그대로 사용 가능

### 개별 상품 URL 패턴

```
https://www.devicemart.co.kr/goods/view?no=상품번호
```

---

## 2. 크롤링 시 주의사항

### 2-1. JavaScript SPA 구조

디바이스마트는 **JavaScript SPA**로 구현되어 있어:
- 가격 정보가 HTML에 직접 포함되지 않음
- 검색 결과가 동적으로 렌더링됨
- `fetch`/`WebFetch` 같은 서버사이드 도구로는 가격 추출 불가
- **반드시 Playwright(headless Chromium)** 등 브라우저 자동화 필요

### 2-2. 검색 결과 로딩

```javascript
// 잘못된 방법 - 결과가 아직 렌더링되지 않음
await page.goto(url, { waitUntil: 'domcontentloaded' });

// 올바른 방법 - 충분한 대기 시간 확보
await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(3000); // JS 렌더링 대기
```

### 2-3. 쿠키/세션 초기화

메인 페이지를 먼저 방문하여 쿠키를 초기화해야 검색이 정상 작동:

```javascript
// 쿠키 초기화
await page.goto('https://www.devicemart.co.kr', { waitUntil: 'load' });
await page.waitForTimeout(2000);

// 이후 검색 페이지 접근
await page.goto(`https://www.devicemart.co.kr/goods/search?search_text=${keyword}`, {
  waitUntil: 'load'
});
await page.waitForTimeout(3000);
```

### 2-4. DOM 선택자 문제

```
// 주의: `a[href*="goods/view"]` 선택자는 헤더 네비게이션 링크도 매칭됨
// 검색 결과와 무관한 링크가 먼저 잡힐 수 있음
```

---

## 3. 검증된 크롤링 코드 (Playwright)

### 3-1. 기본 구조

```javascript
import { chromium } from 'playwright';

const items = [
  { name: 'BMP280', keyword: 'BMP280' },
  { name: 'DHT11', keyword: 'DHT11' },
  // ...
];

async function crawlPrices() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });
  const page = await context.newPage();

  // 1. 쿠키 초기화
  await page.goto('https://www.devicemart.co.kr', { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  const results = [];

  for (const item of items) {
    try {
      const url = `https://www.devicemart.co.kr/goods/search?search_text=${encodeURIComponent(item.keyword)}`;
      await page.goto(url, { waitUntil: 'load' });
      await page.waitForTimeout(3000);

      // innerText 파싱 방식 (가장 안정적)
      const price = await extractPrice(page, item.keyword);
      results.push({ ...item, price });
      console.log(`${item.name}: ${price}`);
    } catch (e) {
      console.error(`${item.name}: 실패 - ${e.message}`);
      results.push({ ...item, price: null, error: e.message });
    }

    // 요청 간 딜레이 (서버 부하 방지)
    await page.waitForTimeout(1000);
  }

  await browser.close();
  return results;
}
```

### 3-2. 가격 추출 함수 (innerText 파싱 방식)

CSS 선택자 방식은 헤더 링크와 충돌하므로, **innerText를 줄 단위로 파싱**하는 것이 가장 안정적:

```javascript
async function extractPrice(page, keyword) {
  const bodyText = await page.evaluate(() => document.body.innerText);
  const lines = bodyText.split('\n').map(l => l.trim()).filter(l => l);

  // "X,XXX 원" 또는 "XX,XXX원" 패턴 탐색
  const pricePattern = /^[\d,]+\s*원$/;

  for (let i = 0; i < lines.length; i++) {
    if (pricePattern.test(lines[i])) {
      // 가격 행 위쪽에서 상품명 확인
      for (let j = i - 1; j >= Math.max(0, i - 5); j--) {
        if (lines[j].toLowerCase().includes(keyword.toLowerCase())) {
          return lines[i]; // 매칭된 가격 반환
        }
      }
    }
  }

  return null; // 가격 미발견
}
```

### 3-3. CSS 선택자 방식 (대안, 주의 필요)

```javascript
// 검색 결과 영역 내에서만 선택하도록 범위 제한
async function extractPriceBySelector(page) {
  // 검색 결과 컨테이너 내부에서만 탐색
  const prices = await page.$$eval(
    '.goods_list .price, .search_result .price',
    els => els.map(el => el.textContent.trim())
  );
  return prices[0] || null;
}

// 주의: 사이트 구조 변경 시 선택자 업데이트 필요
```

---

## 4. 크롤링 결과 (2026-03-15 기준, 38/41 성공)

### 환경 센서

| 부품 | 검색 키워드 | 크롤링 가격 | 비고 |
|------|-----------|----------:|------|
| BMP280 | BMP280 | 2,000원 | |
| DHT11 | DHT11 | 1,300원 | |
| HM3301 | HM3301 | 38,800원 | Seeed 직구 시 ~$15.90 |

### 빛/색상 센서

| 부품 | 검색 키워드 | 크롤링 가격 | 비고 |
|------|-----------|----------:|------|
| TSL2591 | TSL2591 | 6,000원 | Seeed 버전 |
| TCS34725 | TCS34725 | 8,500원 | |
| CdS | CdS | 950원 | 부품단품, 모듈 1,400원 |

### 거리/동작 센서

| 부품 | 검색 키워드 | 크롤링 가격 | 비고 |
|------|-----------|----------:|------|
| VL53L0X | VL53L0X | 20,700원 | |
| PIR | Grove PIR | 3,700원 | |
| ADXL345 | ADXL345 | 3,200원 | |

### 생체 센서

| 부품 | 검색 키워드 | 크롤링 가격 | 비고 |
|------|-----------|----------:|------|
| GSR | Grove GSR | 11,000원 | |
| MLX90614 | MLX90614 | 17,900원 | |

### 소리/진동

| 부품 | 검색 키워드 | 크롤링 가격 | 비고 |
|------|-----------|----------:|------|
| 진동센서 SW-420 | 진동 센서 SW-420 | 800원 | |

### 가스/공기질

| 부품 | 검색 키워드 | 크롤링 가격 | 비고 |
|------|-----------|----------:|------|
| MQ-135 | MQ-135 | 1,500원 | |

### 토양/수질

| 부품 | 검색 키워드 | 크롤링 가격 | 비고 |
|------|-----------|----------:|------|
| 토양수분 | Grove Moisture | 3,800원 | |
| TDS | Grove TDS | 17,000원 | |

### 디스플레이

| 부품 | 검색 키워드 | 크롤링 가격 | 비고 |
|------|-----------|----------:|------|
| I2C LCD 1602 | I2C LCD 1602 | 2,500원 | |
| SH1106 OLED 1.3 | OLED 1.3 SH1106 | 11,400원 | |
| MAX7219 | MAX7219 LED | 2,200원 | |
| TM1637 | TM1637 | 1,200원 | |
| e-Paper | e-paper pico | 31,600원 | Waveshare |

### LED

| 부품 | 검색 키워드 | 크롤링 가격 | 비고 |
|------|-----------|----------:|------|
| WS2812 | WS2812 네오픽셀 | 900원 | 8 LED 스트립 |

### 모터/액추에이터

| 부품 | 검색 키워드 | 크롤링 가격 | 비고 |
|------|-----------|----------:|------|
| SG90 | 서보모터 SG90 | 1,700원 | |
| L9110S | L9110S | 900원 | |
| 28BYJ-48 | 28BYJ-48 | 1,300원 | |
| Grove 릴레이 | Grove Relay | 3,500원 | |
| Grove 진동모터 | Grove Vibration Motor | 2,800원 | |

### 입력 장치

| 부품 | 검색 키워드 | 크롤링 가격 | 비고 |
|------|-----------|----------:|------|
| Grove 버튼 | Grove Button | 1,500원 | LED 내장 버전 |
| Grove 터치 | Grove Touch | 3,900원 | |
| Grove 로터리 | Grove Rotary | 3,400원 | |
| Grove 조이스틱 | Grove Thumb Joystick | 5,900원 | |

### 통신 모듈

| 부품 | 검색 키워드 | 크롤링 가격 | 비고 |
|------|-----------|----------:|------|
| Grove GPS | Grove GPS | 13,200원 | Air530 |
| RFID RC522 | RC522 RFID | 3,100원 | |
| Grove IR 수신 | Grove IR Receiver | 4,000원 | |

### 오디오

| 부품 | 검색 키워드 | 크롤링 가격 | 비고 |
|------|-----------|----------:|------|
| MAX98357 | MAX98357 | 8,800원 | TheHAT 버전 |
| DFPlayer | DFPlayer Mini | 7,900원 | |
| INMP441 | INMP441 | 6,500원 | |

### 기타

| 부품 | 검색 키워드 | 크롤링 가격 | 비고 |
|------|-----------|----------:|------|
| USB Micro B 케이블 | Micro USB 데이터 케이블 | 1,800원 | |

### 미발견 (3건)

| 부품 | 검색 키워드 | 사유 | 대안 |
|------|-----------|------|------|
| GUVA-S12D | GUVA-S12D | 디바이스마트 미판매 | Seeed 직구 |
| Multichannel Gas v2 | Multichannel Gas | 디바이스마트 미판매 | Seeed 직구 |
| Waveshare e-Paper | e-paper 2.13 | 검색 결과 매칭 실패 | `e-paper pico`로 검색 시 성공 |

---

## 5. 트러블슈팅

### 문제 1: 검색 URL 404

```
원인: /goods/list?keyword=X (구 URL) 사용
해결: /goods/search?search_text=X (신 URL) 로 변경
발견: 메인 페이지 topSearchForm 폼 분석
```

### 문제 2: CSS 선택자로 엉뚱한 링크 매칭

```
원인: a[href*="goods/view"] 가 헤더 네비게이션 링크(#로봇손 등)도 매칭
해결: innerText 파싱 방식으로 전환 — body 텍스트를 줄 단위 분리 후 가격 패턴 매칭
```

### 문제 3: 검색 결과 미로딩

```
원인: waitUntil: 'domcontentloaded'만으로 부족 (JS SPA)
해결: waitUntil: 'load' + waitForTimeout(3000) + 메인 페이지 선방문(쿠키 초기화)
```

### 문제 4: Playwright 설치

```bash
# 프로젝트에 설치
npm install --save-dev playwright

# Chromium 브라우저 다운로드
npx playwright install chromium

# 사용 후 정리 (devDependency 제거)
npm uninstall playwright
```

---

## 6. 재사용 팁

1. **일괄 크롤링** 시 각 요청 사이에 1~2초 딜레이 권장 (서버 과부하 방지)
2. **UserAgent** 설정 권장 (봇 차단 우회)
3. 검색어는 **영문 모델명** 우선, 미발견 시 **한글 + 브랜드명** 조합
4. 가격이 `0원`이나 비정상인 경우 해당 상품이 품절/단종일 수 있음
5. 크롤링 스크립트는 작업 완료 후 삭제하여 프로젝트를 깔끔하게 유지
