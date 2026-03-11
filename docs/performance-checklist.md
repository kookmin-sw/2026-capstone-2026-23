# Web Performance Optimization Checklist

Luminir 프론트엔드 성능 최적화를 위한 점검 항목.

---

## 현재 상태 요약

| 영역          | 상태      | 비고                                       |
| ------------- | --------- | ------------------------------------------ |
| 코드 스플리팅 | 양호      | TanStack Router `autoCodeSplitting` 활성화 |
| Tailwind CSS  | 양호      | v4 Vite 플러그인, 자동 퍼지                |
| 아이콘        | 양호      | Lucide (tree-shaking 자동 적용)            |
| 외부 스크립트 | 양호      | 불필요한 외부 의존 없음                    |
| DevTools 번들 | 수정 필요 | 프로덕션 빌드에 포함됨                     |
| 폰트 로딩     | 개선 가능 | Pretendard preload 미설정                  |
| 쿼리 캐시     | 개선 가능 | gcTime 미설정 (메모리 누수 가능)           |
| 폴링 주기     | 개선 가능 | 시스템 통계 5초 간격                       |

---

## 우선순위 HIGH

### 1. 프로덕션 빌드에서 DevTools 제거

**파일:** `src/routes/__root.tsx`, `src/app/providers/QueryProvider.tsx`

TanStack Router DevTools(~17KB gzip)와 React Query DevTools가 프로덕션 번들에 포함되어 있음.

```tsx
// Before
<TanStackRouterDevtools initialIsOpen={false} />
<ReactQueryDevtools initialIsOpen={false} />

// After
{import.meta.env.DEV && <TanStackRouterDevtools initialIsOpen={false} />}
{import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
```

### 2. ResultsPanel XSS 위험 제거

**파일:** `src/widgets/results-panel/ui/ResultsPanel.tsx`

`dangerouslySetInnerHTML`로 백엔드 HTML을 무검증 렌더링 중. 백엔드가 침해되면 XSS 공격 가능.

```tsx
// Before
;<div dangerouslySetInnerHTML={{ __html: table.html }} />

// After — dompurify로 sanitize
import DOMPurify from 'dompurify'
;<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(table.html) }} />
```

### 3. TanStack Query 캐시 GC 설정

**파일:** `src/app/providers/QueryProvider.tsx`

`gcTime` 미설정으로 stale 데이터가 메모리에 무기한 잔류.

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1분
      gcTime: 1000 * 60 * 10, // 10분 후 GC
      retry: 1,
    },
  },
})
```

---

## 우선순위 MEDIUM

### 4. 시스템 통계 폴링 주기 완화

**파일:** `src/entities/system/api/queries.ts`

5초 간격 폴링은 네트워크/배터리 소모가 큼. 실시간이 불필요하면 30~60초로 완화.

```tsx
// Before
refetchInterval: 5000

// After
refetchInterval: 30000
refetchIntervalInBackground: false // 탭 비활성 시 중지
```

### 5. Pretendard 폰트 preload

**파일:** `index.html`

2MB WOFF2 파일이 preload 없이 로딩되어 렌더링 지연 발생 가능.

```html
<!-- Vite가 빌드 시 생성하는 폰트 경로를 확인 후 적용 -->
<link
  rel="preload"
  as="font"
  href="/assets/PretendardVariable-[hash].woff2"
  type="font/woff2"
  crossorigin
/>
```

> **참고:** Vite 빌드가 해시를 붙이므로, `vite-plugin-preload` 등을 사용하거나 빌드 후 경로를 확인해야 함.

### 6. React key 개선

**파일:** `src/widgets/results-panel/ui/ResultsPanel.tsx`

배열 index를 React key로 사용 중. 리스트 변경 시 불필요한 리렌더링 발생.

```tsx
// Before
{content.htmlTables.map((table, idx) => (
  <div key={idx}>

// After — 콘텐츠 기반 고유 key 사용
{content.htmlTables.map((table, idx) => (
  <div key={`table-${table.html.slice(0, 50)}-${idx}`}>
```

---

## 우선순위 LOW

### 7. 대용량 결과 리스트 가상화

ResultsPanel에서 큰 문서의 테이블/이미지 목록을 전부 DOM에 렌더링함. `@tanstack/react-virtual` 등으로 가상화하면 DOM 노드 수를 줄일 수 있음.

### 8. IBM Plex Mono 지연 로딩

코드 블록(`<code>`, `<pre>`)에서만 사용하는 폰트를 초기 로딩에서 제외. Google Fonts URL에 `&display=swap`은 적용됨(현재 양호).

### 9. Dashboard 청크 크기 모니터링

`dashboard` 청크가 439KB(118KB gzip)로 가장 큼. recharts 의존성 때문. 대시보드를 자주 안 쓰는 경우 문제 없지만, 메인 진입점이면 차트 라이브러리 lazy import 고려.

---

## 빌드 산출물 현황 (참고)

```
dist/assets/index.js              369 KB (117 KB gzip)  ← 공통 번들
dist/assets/dashboard.js          439 KB (118 KB gzip)  ← recharts 포함
dist/assets/index.css              79 KB ( 14 KB gzip)  ← 전체 CSS
dist/assets/RouterDevtools.js      57 KB ( 17 KB gzip)  ← 제거 대상
dist/assets/convert.js             26 KB (  8 KB gzip)
dist/assets/settings.js            21 KB (  7 KB gzip)
dist/assets/files.js               11 KB (  3 KB gzip)
dist/assets/errors.js               9 KB (  3 KB gzip)
```

---

## 측정 도구

- **Lighthouse**: `npm run build && npx serve dist` 후 Chrome DevTools > Lighthouse
- **Bundle Analyzer**: `npx vite-bundle-visualizer` (빌드 후 청크 구성 시각화)
- **Web Vitals**: LCP, FID, CLS 측정 — `web-vitals` 라이브러리 추가 고려
