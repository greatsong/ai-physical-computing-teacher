// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://greatsong.github.io',
  base: '/ai-physical-computing-teacher',
  server: { port: 4009 },
  integrations: [
    starlight({
      title: 'AI 피지컬 컴퓨팅 지도서',
      description: '센서+바이브코딩+대시보드+머신러닝 — 교사용 수업 지도서',
      defaultLocale: 'root',
      locales: {
        root: { label: '한국어', lang: 'ko' },
      },
      sidebar: [
        {
          label: '시작 가이드',
          items: [
            { label: '지도서 사용법', slug: 'guide/how-to-use' },
            { label: '수업 전 준비', slug: 'guide/preparation' },
          ],
        },
        {
          label: '코스 A: 15차시 수업',
          items: [
            {
              label: '1막: 센서와 친해지기',
              items: [
                { label: '1차시: 센서로 세상 읽기', slug: 'course-a/act1/lesson-01' },
                { label: '2차시: 빛을 숫자로', slug: 'course-a/act1/lesson-02' },
                { label: '3차시: 자동 기록 시스템', slug: 'course-a/act1/lesson-03' },
                { label: '4차시: 첫 번째 대시보드', slug: 'course-a/act1/lesson-04' },
              ],
            },
            {
              label: '2막: 바이브 코딩으로 확장',
              items: [
                { label: '5차시: AI에게 코드 시키기', slug: 'course-a/act2/lesson-05' },
                { label: '6차시: 환경 모니터링 대시보드', slug: 'course-a/act2/lesson-06' },
                { label: '7차시: 내 몸의 데이터', slug: 'course-a/act2/lesson-07' },
                { label: '8차시: 스마트 알림 시스템', slug: 'course-a/act2/lesson-08' },
                { label: '9차시: 데이터 정리와 시각화', slug: 'course-a/act2/lesson-09' },
                { label: '10차시: AI 데이터 분석', slug: 'course-a/act2/lesson-10' },
              ],
            },
            {
              label: '3막: 대시보드와 머신러닝',
              items: [
                { label: '11차시: 팀 프로젝트 설계', slug: 'course-a/act3/lesson-11' },
                { label: '12차시: 실시간 대시보드 제작', slug: 'course-a/act3/lesson-12' },
                { label: '13차시: 센서 데이터로 ML 입문', slug: 'course-a/act3/lesson-13' },
                { label: '14차시: 발표와 피드백', slug: 'course-a/act3/lesson-14' },
                { label: '15차시: 되돌아보기와 다음 단계', slug: 'course-a/act3/lesson-15' },
              ],
            },
          ],
        },
        {
          label: '코스 B: 프로젝트 레벨업',
          items: [
            { label: '코스 B 지도 가이드', slug: 'course-b/guide' },
            { label: 'Lv.1 탐험가: 대시보드', slug: 'course-b/lv1' },
            { label: 'Lv.2 발명가: 클라우드', slug: 'course-b/lv2' },
            { label: 'Lv.3 연구자: 서버+AI', slug: 'course-b/lv3' },
            { label: 'Lv.4 마스터: ML+DB', slug: 'course-b/lv4' },
          ],
        },
        {
          label: '바이브 코딩 프로젝트',
          items: [
            { label: '프로젝트 소개', slug: 'projects' },
            {
              label: 'Wi-Fi 품질 모니터 (6차시)',
              items: [
                { label: '1차시: 첫 웹서버', slug: 'projects/wifi-monitor/w01' },
                { label: '2차시: 실시간 대시보드', slug: 'projects/wifi-monitor/w02' },
                { label: '3차시: 차트와 시각화', slug: 'projects/wifi-monitor/w03' },
                { label: '4차시: 신호 지도', slug: 'projects/wifi-monitor/w04' },
                { label: '5차시: 나만의 기능', slug: 'projects/wifi-monitor/w05' },
                { label: '6차시: 완성과 발표', slug: 'projects/wifi-monitor/w06' },
              ],
            },
            {
              label: '공공데이터 전광판 (6차시)',
              items: [
                { label: '1차시: 급식 전광판', slug: 'projects/public-data/p01' },
                { label: '2차시: 날씨와 미세먼지', slug: 'projects/public-data/p02' },
                { label: '3차시: 버스 도착정보', slug: 'projects/public-data/p03' },
                { label: '4차시: 디자인 완성', slug: 'projects/public-data/p04' },
                { label: '5차시: 나만의 API', slug: 'projects/public-data/p05' },
                { label: '6차시: 완성과 발표', slug: 'projects/public-data/p06' },
              ],
            },
            {
              label: '센서 실험실 (6차시)',
              items: [
                { label: '1차시: 온습도 센서', slug: 'projects/sensor-lab/s01' },
                { label: '2차시: 조도 센서', slug: 'projects/sensor-lab/s02' },
                { label: '3차시: 소리 센서', slug: 'projects/sensor-lab/s03' },
                { label: '4차시: 동작 감지', slug: 'projects/sensor-lab/s04' },
                { label: '5차시: CO₂ 센서', slug: 'projects/sensor-lab/s05' },
                { label: '6차시: 기압 센서', slug: 'projects/sensor-lab/s06' },
              ],
            },
          ],
        },
        {
          label: '부록',
          items: [
            { label: '평가 루브릭', slug: 'appendix/rubric' },
            { label: '학생 관찰 기록 예시', slug: 'appendix/observation' },
            { label: '트러블슈팅 대응', slug: 'appendix/troubleshooting' },
            { label: '키트 구매 가이드', slug: 'appendix/shopping' },
            { label: '부품 종합 카탈로그', slug: 'appendix/parts-catalog' },
          ],
        },
      ],
      customCss: ['./src/styles/custom.css'],
    }),
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
