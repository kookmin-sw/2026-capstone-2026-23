# 기술 선택 근거 (Tech Decisions)

주요 라이브러리를 선택한 이유와 고려했던 대안, trade-off를 정리한다.

---

## UI 프레임워크

### React 19 (선택) vs Vue 3 vs Svelte 5

| 기준            | React         | Vue          | Svelte       |
| --------------- | ------------- | ------------ | ------------ |
| 생태계 규모     | 가장 큼       | 큼           | 작음         |
| TypeScript 지원 | 네이티브 수준 | 좋음         | 좋음         |
| 번들 크기       | 큼 (~140KB)   | 중간 (~80KB) | 작음 (~15KB) |
| 학습 곡선       | 중간          | 낮음         | 낮음         |

**선택 근거:** 팀원 대부분이 React 경험이 있고, TanStack/shadcn 등 사용하려는 라이브러리 생태계가 React에 가장 풍부하다. 번들 크기는 크지만 TanStack Router의 코드 스플리팅으로 상쇄 가능.

**우리 프로젝트에서 React를 쓰는 실제 모습:**

```tsx
// src/features/file-upload/ui/FileUploader.tsx
// React의 컴포넌트 모델로 파일 업로드 UI를 캡슐화
function FileUploader() {
  const { uploadFile, progress } = useFileUploadStore()  // Zustand (React 전용)
  const { mutate } = useMutation(...)                     // TanStack Query (React 전용)
  return <Button onClick={() => mutate(file)}>업로드</Button>  // shadcn/ui (React 전용)
}
```

위 코드에서 Zustand, TanStack Query, shadcn/ui 모두 React 전용이다. Vue나 Svelte를 선택했다면 이 라이브러리들을 전부 대체해야 한다.

**Vue를 선택했다면:**

- TanStack Query → Vue Query (공식 지원은 있지만 React 대비 커뮤니티가 1/10 수준)
- shadcn/ui → shadcn-vue (비공식 포크, 업데이트 지연)
- Zustand → Pinia (Vue 공식, 이건 오히려 장점)
- TanStack Router → Vue Router (성숙하지만 타입 안전성이 TanStack Router에 미치지 못함)

**Svelte를 선택했다면:**

- TanStack Query, shadcn/ui, Zustand 모두 사용 불가
- 커뮤니티 규모가 작아 문제 발생 시 해결 자료를 찾기 어려움
- 다만 번들 크기(~15KB)와 런타임 성능은 가장 좋았을 것

**Trade-off:** Vue의 더 낮은 학습 곡선과 작은 번들을 포기했다. React 19의 경우 비교적 최신이라 일부 서드파티 호환성 이슈가 있을 수 있다.

---

## 라우팅

### TanStack Router (선택) vs React Router v7

| 기준              | TanStack Router                                 | React Router v7           |
| ----------------- | ----------------------------------------------- | ------------------------- |
| 타입 안전성       | URL 파라미터/검색 파라미터까지 완전한 타입 추론 | 기본적인 수준             |
| 파일 기반 라우팅  | Vite 플러그인으로 자동 생성                     | 수동 설정 또는 Remix 통합 |
| 코드 스플리팅     | `autoCodeSplitting: true` 한 줄로 완료          | 수동 `React.lazy` 필요    |
| 커뮤니티/레퍼런스 | 상대적으로 적음                                 | 매우 풍부                 |
| 번들 크기         | ~45KB                                           | ~30KB                     |

**선택 근거:** URL 파라미터와 검색 파라미터에 대한 완전한 TypeScript 타입 추론이 가장 큰 이유.

**타입 안전성이 왜 중요한지 — 실제 예시:**

```tsx
// TanStack Router — 타입이 자동 추론됨
// src/routes/_layout/files/$fileId.tsx
export const Route = createFileRoute('/_layout/files/$fileId')({
  component: FileDetailPage,
})

function FileDetailPage() {
  const { fileId } = Route.useParams() // ← fileId: string 자동 추론
  // fileID라고 오타 치면 컴파일 에러 발생
}
```

```tsx
// React Router — 타입을 직접 지정해야 함
function FileDetailPage() {
  const { fileId } = useParams() // ← fileId: string | undefined
  // 타입이 항상 string | undefined라서 매번 null 체크 필요
  // fileID라고 오타를 쳐도 컴파일 에러가 안 남
  if (!fileId) return null
}
```

**파일 기반 라우팅이 실제로 어떻게 동작하는지:**

```
src/routes/
├── __root.tsx              → 모든 페이지의 공통 레이아웃
├── _layout.tsx             → 사이드바가 있는 레이아웃
├── _layout/
│   ├── dashboard.tsx       → /dashboard
│   ├── convert.tsx         → /convert
│   ├── files/
│   │   ├── index.tsx       → /files
│   │   └── $fileId.tsx     → /files/123 (동적 파라미터)
│   ├── errors.tsx          → /errors
│   └── settings.tsx        → /settings
```

파일을 만들기만 하면 `routeTree.gen.ts`가 자동 생성된다. React Router였다면 이런 라우트 설정을 수동으로 작성해야 한다:

```tsx
// React Router — 수동 라우트 설정 (TanStack Router에서는 불필요)
<Routes>
  <Route element={<Layout />}>
    <Route path="/dashboard" element={<React.lazy(() => import('./pages/Dashboard'))} />
    <Route path="/convert" element={<React.lazy(() => import('./pages/Convert'))} />
    <Route path="/files" element={<React.lazy(() => import('./pages/Files'))} />
    <Route path="/files/:fileId" element={<React.lazy(() => import('./pages/FileDetail'))} />
    {/* ... 페이지가 추가될 때마다 여기도 수정해야 함 */}
  </Route>
</Routes>
```

**코드 스플리팅 효과 (실제 빌드 결과):**

```
# 각 라우트가 별도 청크로 분리됨 — 사용자가 해당 페이지에 접근할 때만 로딩
dist/assets/dashboard.js    439 KB (118 KB gzip)  ← /dashboard 접근 시
dist/assets/convert.js       26 KB (  8 KB gzip)  ← /convert 접근 시
dist/assets/settings.js      21 KB (  7 KB gzip)  ← /settings 접근 시
dist/assets/files.js         11 KB (  3 KB gzip)  ← /files 접근 시
dist/assets/errors.js         9 KB (  3 KB gzip)  ← /errors 접근 시
```

만약 코드 스플리팅이 없었다면 이 모든 것(506KB)이 하나의 파일로 합쳐져서 첫 페이지 접근 시 전부 다운로드해야 한다.

**Trade-off:** React Router 대비 커뮤니티가 작아 문제 해결 시 레퍼런스를 찾기 어려울 수 있다. 학습 곡선이 약간 높다.

---

## 서버 상태 관리

### TanStack Query (선택) vs SWR vs 직접 구현 (useEffect + useState)

| 기준          | TanStack Query                          | SWR                         | 직접 구현      |
| ------------- | --------------------------------------- | --------------------------- | -------------- |
| 캐싱 전략     | staleTime/gcTime 세밀 제어              | stale-while-revalidate 고정 | 직접 구현 필요 |
| Mutation 지원 | `useMutation` + 캐시 무효화 내장        | 별도 처리 필요              | 직접 구현      |
| DevTools      | 공식 DevTools 제공                      | 없음                        | 없음           |
| 번들 크기     | ~40KB                                   | ~12KB                       | 0KB            |
| 기능 범위     | 광범위 (pagination, infinite, prefetch) | 기본적                      | 필요한 만큼만  |

**선택 근거:** 문서 처리 앱 특성상 파일 업로드 → 처리 → 결과 조회 흐름에서 mutation과 캐시 무효화가 빈번하다.

**"서버 상태"란 무엇인가:**

서버 상태는 백엔드 API에서 가져오는 데이터를 말한다. 예를 들어 문서 목록, 시스템 통계, 처리 결과 등이다. 이 데이터는 다른 사용자가 언제든 바꿀 수 있으므로 "내 화면에 보이는 데이터가 최신인가?"를 관리해야 한다. 이것이 `staleTime`(데이터를 얼마나 오래 신뢰할지)과 `gcTime`(메모리에 얼마나 보관할지)이다.

**Luminir에서 TanStack Query가 실제로 해결하는 문제:**

```tsx
// src/entities/documents/api/queries.ts
// 문서 목록 조회 — 1분간 캐시, 그 후 자동 재요청
export function useDocumentsQuery() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: () => documentsApi.getDocuments(),
    // staleTime: 60초 (기본값) — 60초 동안은 같은 데이터를 재사용
  })
}

// src/features/file-upload/api/mutations.ts
// 파일 업로드 후 → 문서 목록 캐시 자동 무효화
export function useUploadMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => documentsApi.uploadFile(file),
    onSuccess: () => {
      // 업로드 성공 → 문서 목록을 다시 가져옴
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })
}
```

이 흐름이 왜 중요한지: 사용자가 파일을 업로드하면 → 문서 목록이 자동으로 갱신된다. 수동으로 "목록을 다시 불러와" 같은 코드를 쓸 필요가 없다.

**직접 구현했다면 어떻게 됐을까:**

```tsx
// 직접 구현 — 같은 기능을 위해 필요한 코드량이 훨씬 많다
function useDocuments() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/documents')
      setData(res.data)
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, loading, error, refetch }
}

// 업로드 후 목록 갱신? refetch를 prop으로 전달하거나 이벤트 시스템을 만들어야 함
// 캐싱? 직접 Map에 저장하고 만료 타이머를 관리해야 함
// 로딩 중 중복 요청 방지? AbortController로 직접 처리해야 함
// 윈도우 포커스 시 자동 갱신? 직접 이벤트 리스너를 달아야 함
```

**SWR을 선택했다면:**

```tsx
// SWR — GET 요청은 간결하지만 mutation 처리가 불편
const { data, mutate } = useSWR('/api/documents', fetcher)

// 업로드 후 캐시 무효화 — mutate()를 직접 호출해야 함
async function handleUpload(file: File) {
  await axios.post('/api/process/file', formData)
  mutate() // 이 키만 갱신됨 — 관련된 다른 쿼리는?
  // SWR에는 invalidateQueries 같은 패턴 매칭 무효화가 없음
  // ['documents'], ['documents', fileId], ['dashboard/stats'] 등을
  // 각각 수동으로 mutate 호출해야 함
}
```

**Trade-off:** SWR 대비 번들 크기가 3배 이상 크고, API가 복잡하다. 간단한 GET 요청만 있는 프로젝트였다면 SWR이나 직접 구현이 더 적합했을 것.

---

## 클라이언트 상태 관리

### Zustand (선택) vs Redux Toolkit vs Jotai vs Context API

| 기준            | Zustand                   | Redux Toolkit         | Jotai                 | Context API               |
| --------------- | ------------------------- | --------------------- | --------------------- | ------------------------- |
| 보일러플레이트  | 최소                      | 많음 (slice, reducer) | 최소                  | 최소                      |
| 번들 크기       | ~2KB                      | ~30KB                 | ~8KB                  | 0KB                       |
| DevTools        | Redux DevTools 호환       | 공식 지원             | 별도 설치             | 없음                      |
| 리렌더링 최적화 | selector로 구독 범위 제한 | selector 지원         | atom 단위 자동 최적화 | Provider 하위 전체 리렌더 |
| 러닝 커브       | 낮음                      | 높음                  | 낮음                  | 없음                      |

**선택 근거:** 파일 업로드 진행 상태처럼 서버 상태가 아닌 클라이언트 로컬 상태가 필요한 곳에 사용.

**"클라이언트 상태"와 "서버 상태"의 차이:**

```
서버 상태 (TanStack Query가 관리):
- 문서 목록 — 백엔드 DB에 있는 데이터
- 시스템 통계 — 백엔드가 계산하는 수치
- 처리 결과 — API를 호출해야 얻을 수 있는 데이터

클라이언트 상태 (Zustand가 관리):
- 파일 업로드 진행률 (30%... 60%... 100%) — 브라우저에서만 존재
- 사이드바 열림/닫힘 — 서버와 무관한 UI 상태
- 선택된 파일 목록 — 사용자 인터랙션 상태
```

**Zustand가 실제로 어떻게 쓰이는지:**

```tsx
// src/features/file-upload/model/store.ts — 전체 코드가 이게 끝
import { create } from 'zustand'

interface FileUploadState {
  files: File[]
  progress: number
  addFiles: (files: File[]) => void
  setProgress: (progress: number) => void
  reset: () => void
}

export const useFileUploadStore = create<FileUploadState>((set) => ({
  files: [],
  progress: 0,
  addFiles: (files) => set((state) => ({ files: [...state.files, ...files] })),
  setProgress: (progress) => set({ progress }),
  reset: () => set({ files: [], progress: 0 }),
}))
```

```tsx
// 컴포넌트에서 사용 — 필요한 값만 구독하여 리렌더링 최소화
function UploadProgress() {
  const progress = useFileUploadStore((state) => state.progress)
  // progress가 바뀔 때만 이 컴포넌트가 리렌더링됨
  // files가 바뀌어도 이 컴포넌트는 리렌더링되지 않음
  return <Progress value={progress} />
}
```

**Redux Toolkit으로 같은 것을 구현했다면:**

```tsx
// 1. slice 파일 생성
const fileUploadSlice = createSlice({
  name: 'fileUpload',
  initialState: { files: [], progress: 0 },
  reducers: {
    addFiles: (state, action) => { state.files.push(...action.payload) },
    setProgress: (state, action) => { state.progress = action.payload },
    reset: () => ({ files: [], progress: 0 }),
  },
})

// 2. store에 등록
const store = configureStore({
  reducer: { fileUpload: fileUploadSlice.reducer },
})

// 3. Provider로 앱 전체 감싸기
<Provider store={store}><App /></Provider>

// 4. 컴포넌트에서 사용
const progress = useSelector((state) => state.fileUpload.progress)
const dispatch = useDispatch()
dispatch(fileUploadSlice.actions.setProgress(50))
```

Zustand와 비교하면: 파일 4개 대신 1개, action dispatch 대신 직접 호출, Provider 불필요. 작은 프로젝트에서 Redux의 구조화 이점보다 보일러플레이트 비용이 더 크다.

**Context API를 선택했다면:**

```tsx
// Context API의 치명적 문제 — Provider 하위 전체가 리렌더링됨
const FileUploadContext = createContext(...)

function FileUploadProvider({ children }) {
  const [state, setState] = useState({ files: [], progress: 0 })
  // setState가 호출되면 → children 전체가 리렌더링됨
  // progress만 바뀌어도 파일 목록 UI까지 리렌더링
  return <FileUploadContext.Provider value={state}>{children}</FileUploadContext.Provider>
}
```

Zustand는 selector(`state => state.progress`)로 구독 범위를 제한하므로 이 문제가 없다.

**Trade-off:** Redux Toolkit의 미들웨어 생태계(saga, thunk)를 포기했다. 다만 서버 상태는 TanStack Query가 담당하므로 클라이언트 상태용으로는 Zustand의 단순함이 더 적합하다. Jotai와도 고민했지만 atom 기반 모델보다 단일 store 모델이 파일 업로드 상태 같은 응집도 높은 상태에 더 직관적.

---

## HTTP 클라이언트

### Axios (선택) vs fetch API (네이티브) vs ky

| 기준                 | Axios                   | fetch                     | ky             |
| -------------------- | ----------------------- | ------------------------- | -------------- |
| 인터셉터             | 요청/응답 인터셉터 내장 | 없음 (직접 래핑)          | 훅(hooks) 제공 |
| 에러 처리            | 4xx/5xx 자동 reject     | 수동 `response.ok` 체크   | 자동 reject    |
| 타임아웃             | 내장                    | AbortController 직접 사용 | 내장           |
| 번들 크기            | ~13KB                   | 0KB                       | ~3KB           |
| FormData/파일 업로드 | 자동 Content-Type 설정  | 수동 설정                 | 지원           |

**선택 근거:** 문서 파일 업로드가 핵심 기능이므로 multipart/form-data 처리와 업로드 진행률 콜백(`onUploadProgress`)이 중요했다.

**Axios가 실제로 해주는 일:**

```tsx
// src/shared/api/client.ts — Axios 인스턴스 설정
const apiClient = axios.create({
  baseURL: '/api', // 모든 요청에 /api prefix 자동 추가
  timeout: 30000, // 30초 타임아웃 자동 적용
})

// 파일 업로드 시 진행률 표시 — Axios만의 기능
async function uploadFile(file: File, onProgress: (percent: number) => void) {
  const formData = new FormData()
  formData.append('file', file)

  await apiClient.post('/process/file', formData, {
    onUploadProgress: (event) => {
      // 100MB 파일 업로드 중 진행률을 실시간으로 받을 수 있음
      const percent = Math.round((event.loaded * 100) / event.total!)
      onProgress(percent) // 30%... 60%... 100%
    },
  })
}
```

**fetch로 같은 것을 구현했다면:**

```tsx
// fetch — 업로드 진행률을 알 수 없음!
// fetch API는 request body의 업로드 진행률을 지원하지 않음
// ReadableStream으로 우회하는 방법이 있지만, 모든 브라우저에서 동작하지 않음

// 기본적인 에러 처리도 수동
const response = await fetch('/api/process/file', {
  method: 'POST',
  body: formData,
  signal: AbortSignal.timeout(30000), // 타임아웃도 수동
})
if (!response.ok) {
  // fetch는 4xx/5xx를 에러로 취급하지 않음!
  // 수동으로 체크해야 함
  throw new Error(`HTTP ${response.status}`)
}
```

**인터셉터가 왜 유용한지:**

```tsx
// 요청 인터셉터 — 모든 요청에 자동 적용
apiClient.interceptors.request.use((config) => {
  // 향후 인증 토큰이 추가되면 여기 한 줄만 추가
  config.headers.Authorization = `Bearer ${getToken()}`
  return config
})

// 응답 인터셉터 — 에러를 한 곳에서 통일 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 인증 만료 → 로그인 페이지로 리다이렉트
    }
    return Promise.reject(error)
  },
)
// fetch를 쓰면 이 로직을 래퍼 함수로 직접 만들어야 함
```

**Trade-off:** 네이티브 fetch 대비 13KB 번들 오버헤드가 있다. fetch + 얇은 래퍼로도 충분했을 수 있지만, 업로드 진행률 지원이 결정적이었다. ky는 가볍지만 `onUploadProgress` 같은 기능이 없다.

---

## UI 컴포넌트

### shadcn/ui + Radix (선택) vs MUI vs Ant Design vs Headless UI

| 기준          | shadcn/ui + Radix           | MUI                      | Ant Design      | Headless UI |
| ------------- | --------------------------- | ------------------------ | --------------- | ----------- |
| 커스터마이징  | 소스 복사 방식, 완전한 제어 | 테마 오버라이드 (제한적) | 테마 오버라이드 | 완전한 제어 |
| 번들 크기     | 사용한 컴포넌트만 포함      | 큼 (~300KB+)             | 큼 (~200KB+)    | 작음        |
| 디자인 독립성 | Tailwind로 자유롭게         | Material 스타일 고정     | Ant 스타일 고정 | 스타일 없음 |
| 접근성 (a11y) | Radix 기반 WAI-ARIA 준수    | 준수                     | 준수            | 준수        |
| 컴포넌트 수   | 50+                         | 60+                      | 70+             | 10+         |

**선택 근거:** Luminir 자체 디자인 시스템을 구축해야 하므로, 기존 디자인 언어(Material, Ant)에 종속되지 않는 것이 중요했다.

**"소스 복사 방식"이란:**

```bash
# shadcn/ui 컴포넌트 추가 시
npx shadcn add button

# → src/shared/ui/button.tsx에 소스코드가 복사됨
# → 이 파일은 우리 소유. 자유롭게 수정 가능
```

```tsx
// src/shared/ui/button.tsx — 실제로 프로젝트에 복사된 코드
// Luminir 디자인 시스템에 맞게 variant를 자유롭게 추가/수정 가능
const buttonVariants = cva('inline-flex items-center justify-center ...', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground ...',
      destructive: 'bg-destructive text-white ...',
      // ↓ Luminir 브랜드 variant를 자유롭게 추가 가능
      pink: 'bg-luminir-pink-80 text-white ...',
      blue: 'bg-luminir-blue-50 text-white ...',
    },
    size: {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 px-3 text-xs',
    },
  },
})
```

**MUI를 선택했다면:**

```tsx
// MUI — Material Design 스타일이 기본. 변경하려면 theme override 필요
import Button from '@mui/material/Button'

// Luminir 색상을 쓰려면 theme을 전역으로 오버라이드해야 함
const theme = createTheme({
  palette: {
    primary: { main: '#C41AFF' }, // 전역 변경 — 모든 primary가 바뀜
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0, // Carbon 스타일(직각) 적용
          textTransform: 'none', // MUI 기본 대문자 변환 해제
          // Material Design의 ripple 효과, elevation 등을 일일이 끄거나 바꿔야 함
        },
      },
    },
  },
})
// → Material Design을 쓰지 않으면서 MUI를 쓰는 건 "소방차를 사서 빨간색을 지우는 것"에 가까움
```

**Radix가 접근성에서 하는 역할:**

```tsx
// shadcn/ui Dialog 내부 — Radix가 자동으로 처리하는 것들
<Dialog>
  <DialogTrigger>열기</DialogTrigger>
  <DialogContent>
    {/* Radix가 자동으로:
        1. 열릴 때 focus를 Dialog 안으로 이동
        2. Tab 키로 Dialog 밖으로 나가지 못하게 trap
        3. ESC 키로 닫기
        4. 바깥 영역 클릭 시 닫기
        5. aria-modal, role="dialog" 자동 설정
        6. 닫힐 때 focus를 원래 위치로 복원
        → 이걸 직접 구현하면 100줄+ 코드 */}
  </DialogContent>
</Dialog>
```

**Trade-off:** MUI/Ant Design처럼 즉시 쓸 수 있는 고수준 컴포넌트(DatePicker, Transfer, TreeSelect 등)가 없다. 복잡한 컴포넌트는 직접 조합하거나 별도 라이브러리를 찾아야 한다. 또한 소스 복사 방식이라 shadcn 업데이트를 자동으로 받지 못한다.

---

## 스타일링

### Tailwind CSS 4 (선택) vs CSS Modules vs styled-components vs vanilla-extract

| 기준             | Tailwind CSS 4               | CSS Modules      | styled-components | vanilla-extract |
| ---------------- | ---------------------------- | ---------------- | ----------------- | --------------- |
| 런타임 오버헤드  | 0 (빌드 타임)                | 0                | 있음 (CSS-in-JS)  | 0               |
| DX (자동완성)    | 매우 좋음                    | 보통             | 좋음              | 좋음            |
| 디자인 토큰 통합 | CSS 변수 + `@theme` 네이티브 | CSS 변수 수동    | ThemeProvider     | 타입 안전 토큰  |
| 유틸리티 퍼지    | 자동 (v4)                    | 해당 없음        | 해당 없음         | 해당 없음       |
| 팀 일관성        | 높음 (유틸리티 규칙)         | 낮음 (자유 작성) | 중간              | 높음            |

**선택 근거:** shadcn/ui가 Tailwind 기반이므로 자연스러운 선택이다.

**"런타임 오버헤드 0"이 의미하는 것:**

```tsx
// Tailwind — 빌드 시 CSS 파일로 변환됨. 브라우저에서 추가 연산 없음
;<button className="bg-primary px-4 py-2 text-white">클릭</button>
// → 빌드 결과: .bg-primary { background: var(--primary) } (정적 CSS)

// styled-components — 런타임에 CSS를 생성함
const Button = styled.button`
  background: ${(props) => props.theme.primary}; // 렌더링 시마다 JS가 실행됨
  color: white;
  padding: 0.5rem 1rem;
`
// → 컴포넌트가 마운트될 때 <style> 태그를 동적으로 삽입
// → 대규모 페이지에서 수백 개 컴포넌트가 각각 스타일을 생성하면 성능 저하
```

**Tailwind v4의 `@theme`이 디자인 토큰 관리에 좋은 이유:**

```css
/* src/app/styles/index.css — 디자인 토큰을 CSS 변수로 정의 */
@theme inline {
  --color-luminir-pink-80: #c41aff;
  --color-luminir-blue-50: #149de6;
}

/* 이렇게 정의하면 바로 Tailwind 클래스로 사용 가능 */
```

```tsx
// CSS 변수를 정의하는 순간 바로 유틸리티 클래스가 생김
<div className="bg-luminir-pink-80">  {/* 별도 설정 없이 바로 사용 */}
<div className="text-luminir-blue-50">

// CSS Modules였다면? 매번 .module.css 파일에서 변수를 import해야 함
// styled-components였다면? ThemeProvider에 등록하고 props.theme으로 접근해야 함
```

**`cn()` 유틸리티가 해결하는 문제:**

```tsx
// cn() = clsx + tailwind-merge
// 조건부 클래스 + Tailwind 충돌 해결을 한 번에

// 문제: Tailwind에서 같은 속성의 클래스가 겹치면 어떤 게 이길까?
<div className="bg-red-500 bg-blue-500" />
// → CSS 작성 순서에 따라 결과가 달라짐 (예측 불가)

// cn()을 쓰면 후순위가 항상 이김
<div className={cn("bg-red-500", isActive && "bg-blue-500")} />
// → isActive=true면 bg-blue-500만 남음 (tailwind-merge가 충돌 해결)
```

**Trade-off:** HTML에 긴 클래스 문자열이 붙어 가독성이 떨어질 수 있다. `cn()` 유틸리티(clsx + tailwind-merge)로 완화하지만, CSS Modules처럼 스타일이 분리된 구조를 선호하는 팀에게는 단점. styled-components의 동적 스타일링 편의성도 포기했다.

---

## 차트

### Recharts (선택) vs Chart.js (react-chartjs-2) vs Nivo vs D3 직접 사용

| 기준         | Recharts                   | Chart.js      | Nivo    | D3          |
| ------------ | -------------------------- | ------------- | ------- | ----------- |
| React 통합   | 선언적 컴포넌트            | 래퍼 필요     | 선언적  | 명령형      |
| 번들 크기    | ~400KB                     | ~200KB        | ~500KB+ | ~250KB      |
| 커스터마이징 | 중간                       | 중간          | 높음    | 완전한 자유 |
| 학습 곡선    | 낮음                       | 낮음          | 중간    | 높음        |
| 반응형 지원  | `ResponsiveContainer` 내장 | 플러그인 필요 | 내장    | 직접 구현   |

**선택 근거:** 대시보드에 LineChart, PieChart 정도만 필요한 수준이다.

**"선언적 컴포넌트"가 왜 편한지:**

```tsx
// Recharts — JSX 그대로 차트를 구성 (React 개발자에게 자연스러움)
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={stats}>
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="processed" stroke="#0f62fe" />
    <Line type="monotone" dataKey="failed" stroke="#da1e28" />
  </LineChart>
</ResponsiveContainer>

// Chart.js — 설정 객체로 차트를 구성 (JSX와 별개의 패러다임)
<Line
  data={{
    labels: stats.map(s => s.date),
    datasets: [
      { label: 'processed', data: stats.map(s => s.processed), borderColor: '#0f62fe' },
      { label: 'failed', data: stats.map(s => s.failed), borderColor: '#da1e28' },
    ],
  }}
  options={{
    responsive: true,
    plugins: { tooltip: { enabled: true } },
    scales: { y: { beginAtZero: true } },
  }}
/>

// D3 — DOM을 직접 조작 (React의 가상 DOM과 충돌할 수 있음)
useEffect(() => {
  const svg = d3.select(ref.current)
  svg.selectAll('path')
    .data(stats)
    .join('path')
    .attr('d', line().x(d => xScale(d.date)).y(d => yScale(d.processed)))
  // React가 DOM을 관리하는데 D3도 DOM을 관리 → 충돌 가능
}, [stats])
```

**번들 크기 문제의 실체:**

```
현재 빌드 결과:
dashboard.js  439 KB (118 KB gzip)  ← 이 중 ~400KB가 recharts

하지만:
- dashboard는 코드 스플리팅으로 별도 청크
- /dashboard에 접근하지 않으면 로딩되지 않음
- 즉, 다른 페이지의 성능에는 영향 없음
- 대시보드를 자주 사용하는 유저만 한 번 다운로드하면 브라우저가 캐싱
```

**Trade-off:** 번들 크기가 ~400KB로 가장 큰 단점. 현재 대시보드 청크가 439KB인 주요 원인이다. 차트가 단순한 만큼 Chart.js로 전환하면 번들을 절반으로 줄일 수 있지만, React 통합의 자연스러움을 포기해야 한다. 향후 차트 요구사항이 늘지 않으면 재검토 대상.

---

## 폰트

### Pretendard (선택) vs Noto Sans KR vs Spoqa Han Sans

| 기준               | Pretendard                  | Noto Sans KR               | Spoqa Han Sans |
| ------------------ | --------------------------- | -------------------------- | -------------- |
| 한글 품질          | 매우 좋음                   | 좋음                       | 좋음           |
| Variable Font      | 지원 (파일 1개로 전 weight) | 지원                       | 미지원         |
| 라이센스           | SIL OFL (자유)              | SIL OFL                    | SIL OFL        |
| 시스템 폰트 유사도 | Apple SD Gothic/Inter 기반  | Google 자체 디자인         | 독자 디자인    |
| npm 패키지         | `pretendard` (공식)         | `@fontsource/noto-sans-kr` | 비공식         |

**선택 근거:** npm 패키지로 설치하여 **폐쇄망 환경에서도 동작**한다는 점이 결정적이었다.

**"폐쇄망"이 폰트 선택에 미치는 영향:**

```
일반 환경:
  브라우저 → fonts.googleapis.com → 폰트 다운로드

폐쇄망 환경 (보안이 중요한 기관/기업 내부):
  브라우저 → fonts.googleapis.com → ❌ 외부 접근 차단
  브라우저 → cdn.jsdelivr.net → ❌ 외부 접근 차단

  따라서 폰트 파일이 서버 자체에 포함되어 있어야 함
```

```tsx
// CDN 방식 (폐쇄망에서 작동 안 함)
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR" rel="stylesheet" />

// npm 패키지 방식 (폐쇄망에서도 작동)
// src/app/styles/index.css
@import 'pretendard/dist/web/variable/pretendardvariable.css';
// → node_modules에 포함된 WOFF2 파일이 빌드 시 번들에 포함됨
// → 외부 네트워크 요청 없이 폰트가 로딩됨
```

**Variable Font가 왜 좋은지:**

```
Static Font (Spoqa Han Sans 방식):
  Regular.woff2    → 300KB
  Medium.woff2     → 310KB
  Bold.woff2       → 320KB
  SemiBold.woff2   → 315KB
  합계: ~1.2MB + HTTP 요청 4번

Variable Font (Pretendard 방식):
  PretendardVariable.woff2 → ~2MB, HTTP 요청 1번
  하나의 파일 안에 모든 weight(100~900)가 포함
  font-weight: 350 같은 중간값도 사용 가능
```

파일 크기는 Variable이 더 크지만, HTTP 요청이 1번이라 실제 로딩 속도는 비슷하거나 더 빠를 수 있다.

**Trade-off:** Variable Font 파일이 ~2MB로 크다. Noto Sans KR의 dynamic subset(Google Fonts)을 사용하면 초기 로딩이 더 빠르지만, 폐쇄망 요구사항과 충돌한다. 필요 시 weight별 static 파일로 전환하여 초기 로딩을 줄일 수 있다.

---

## 빌드 도구

### Vite 7 (선택) vs Webpack 5 vs Turbopack vs Rspack

| 기준            | Vite 7             | Webpack 5 | Turbopack    | Rspack       |
| --------------- | ------------------ | --------- | ------------ | ------------ |
| 개발 서버 시작  | ~200ms             | ~3-10초   | ~200ms       | ~500ms       |
| HMR 속도        | 즉시               | 1-3초     | 즉시         | 빠름         |
| 설정 복잡도     | 최소               | 높음      | Next.js 전용 | Webpack 호환 |
| 플러그인 생태계 | Rollup 호환 + 자체 | 가장 풍부 | 제한적       | Webpack 호환 |
| 프로덕션 번들러 | Rolldown (Rust)    | 자체      | 미정         | 자체 (Rust)  |

**선택 근거:** React 19 + TanStack + Tailwind 4 조합에서 가장 매끄러운 통합을 제공한다.

**개발 속도 차이가 체감되는 이유:**

```
Webpack 개발 서버 시작:
  1. 모든 파일을 번들링 (3-10초)
  2. 코드 수정 → 변경된 모듈 + 의존 모듈 재번들링 (1-3초)
  3. 프로젝트가 커질수록 점점 느려짐

Vite 개발 서버 시작:
  1. 서버만 시작 (~200ms), 번들링하지 않음
  2. 브라우저가 필요한 파일만 요청하면 그때 변환 (ESM native)
  3. 코드 수정 → 해당 파일 하나만 교체 (즉시)
  4. 프로젝트가 커져도 속도 일정
```

**설정이 얼마나 간결한지:**

```tsx
// vite.config.ts — 이 프로젝트의 전체 Vite 설정
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
```

```js
// webpack.config.js — 같은 기능을 Webpack으로 구현하려면
// PostCSS 설정, CSS loader, style-loader, babel-loader,
// html-webpack-plugin, dev-server 설정, code splitting 설정,
// alias 설정, HMR 설정... 50-100줄 이상의 설정 파일이 필요
```

**Trade-off:** Webpack의 방대한 플러그인 생태계를 포기했다. Module Federation 같은 마이크로 프론트엔드 기능이 필요해지면 Webpack이나 Rspack을 재검토해야 한다. 다만 현재 모노리스 SPA 구조에서는 Vite가 최적.

---

## 테스트

### Vitest + Playwright (선택) vs Jest + Cypress vs Jest + Playwright

| 기준              | Vitest + Playwright       | Jest + Cypress    | Jest + Playwright         |
| ----------------- | ------------------------- | ----------------- | ------------------------- |
| 단위 테스트 속도  | 빠름 (Vite 설정 공유)     | 보통              | 보통                      |
| Vite 설정 공유    | 자동                      | 별도 설정         | 별도 설정                 |
| E2E 브라우저 지원 | Chromium, Firefox, WebKit | Chromium, Firefox | Chromium, Firefox, WebKit |
| E2E 안정성        | 높음 (auto-wait)          | 높음 (자체 retry) | 높음 (auto-wait)          |

**선택 근거:** Vitest는 Vite의 설정을 그대로 공유하므로 별도 테스트 설정이 필요 없다.

**"Vite 설정 공유"가 구체적으로 뭘 해주는지:**

```tsx
// src/shared/ui/button.tsx
import { cn } from '@/shared/lib/cn' // path alias: @ → src

// Vitest — vite.config.ts의 alias를 그대로 사용. 추가 설정 없음
// vitest가 import '@/...'를 자동으로 해석

// Jest — 별도로 moduleNameMapper를 설정해야 함
// jest.config.js
module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // 수동 중복 설정
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.app.json' }],
  },
  // Vite 플러그인이 처리하는 것들을 Jest에서 따로 설정해야 함
}
```

**Playwright의 auto-wait이 테스트를 안정적으로 만드는 방법:**

```tsx
// Playwright — 요소가 나타날 때까지 자동으로 기다림
test('파일 업로드 후 목록에 표시됨', async ({ page }) => {
  await page.goto('/convert')
  await page.setInputFiles('input[type="file"]', 'test.hwp')
  await page.click('button:has-text("변환")')
  // ↓ 변환이 완료되고 목록이 업데이트될 때까지 자동 대기 (최대 30초)
  await expect(page.locator('text=test.hwp')).toBeVisible()
})

// Cypress — 비슷하지만 WebKit(Safari) 테스트 불가
// 공공기관 사용자 중 Safari 사용자가 있을 수 있으므로 WebKit 테스트가 중요
```

**Trade-off:** Jest의 더 큰 커뮤니티와 레퍼런스를 포기했다. Cypress의 시각적 테스트 러너 UI가 디버깅에 더 편하다는 의견도 있지만, Playwright의 `--ui` 모드로 유사한 경험을 제공한다.

---

## 코드 품질

### ESLint + Prettier (선택) vs Biome

| 기준            | ESLint + Prettier                  | Biome               |
| --------------- | ---------------------------------- | ------------------- |
| 속도            | 보통                               | 매우 빠름 (Rust)    |
| 규칙 수         | 매우 풍부                          | 증가 중 (아직 적음) |
| 플러그인 생태계 | react-hooks, react-refresh 등 다양 | 제한적              |
| 설정 파일       | 2개 (eslint.config + .prettierrc)  | 1개 (biome.json)    |

**선택 근거:** React 전용 규칙이 필수적이다.

**`eslint-plugin-react-hooks`가 잡아내는 실수:**

```tsx
// ❌ 이 코드는 무한 루프를 발생시킴 — ESLint가 경고해줌
function DocumentList() {
  const [docs, setDocs] = useState([])

  useEffect(() => {
    fetchDocs().then(setDocs)
  })  // ← 의존성 배열 누락! 매 렌더마다 실행 → setDocs → 리렌더 → 무한루프
  // eslint-plugin-react-hooks: "React Hook useEffect has a missing dependency array"
}

// ❌ 이 코드는 조건부 Hook 호출 — React 규칙 위반
function FileDetail({ fileId }) {
  if (!fileId) return null
  const { data } = useQuery(...)  // ← 조건문 뒤에 Hook 호출!
  // eslint-plugin-react-hooks: "React Hook is called conditionally"
  // Biome은 아직 이 규칙을 지원하지 않음
}
```

**`eslint-plugin-react-refresh`가 잡아내는 문제:**

```tsx
// ❌ 컴포넌트와 상수를 같은 파일에서 export — Fast Refresh가 깨짐
export const API_URL = '/api'
export function Dashboard() { ... }
// eslint-plugin-react-refresh: "Fast Refresh only works with component exports"
// 코드 수정 시 전체 페이지가 리로드되어 상태가 날아감

//  분리해야 함
// config.ts → export const API_URL = '/api'
// Dashboard.tsx → export function Dashboard() { ... }
```

**Husky + lint-staged가 하는 역할:**

```bash
# git commit 시 자동 실행되는 흐름
git commit -m "feat: add upload button"

# 1. Husky가 pre-commit hook 실행
# 2. lint-staged가 staged된 파일에 대해서만 검사
#    - *.ts, *.tsx → ESLint 자동 수정 + Prettier 포맷팅
#    - *.css, *.json, *.md → Prettier 포맷팅
# 3. 검사 통과하면 커밋 완료, 실패하면 커밋 차단

# 전체 파일이 아닌 변경된 파일만 검사하므로 빠름 (1-3초)
```

**Trade-off:** Biome 대비 실행 속도가 느리고 설정 파일이 2개로 나뉜다. `eslint-config-prettier`로 충돌을 방지해야 하는 번거로움도 있다. Biome의 React 플러그인이 성숙해지면 마이그레이션을 고려할 수 있다.

---

## 요약

| 영역            | 선택              | 핵심 이유                      | 가장 큰 Trade-off          |
| --------------- | ----------------- | ------------------------------ | -------------------------- |
| 프레임워크      | React 19          | 생태계 + 팀 경험               | 번들 크기 큼               |
| 라우팅          | TanStack Router   | 타입 안전 + 자동 코드 스플리팅 | 적은 커뮤니티              |
| 서버 상태       | TanStack Query    | mutation + 캐시 무효화         | 번들 크기 (vs SWR)         |
| 클라이언트 상태 | Zustand           | 2KB, 최소 보일러플레이트       | 미들웨어 생태계 부재       |
| HTTP            | Axios             | 업로드 진행률, 인터셉터        | 13KB (vs fetch 0KB)        |
| UI 컴포넌트     | shadcn/ui + Radix | 완전한 커스터마이징 + 접근성   | 고수준 컴포넌트 부재       |
| 스타일링        | Tailwind CSS 4    | 런타임 0, 디자인 토큰 네이티브 | HTML 클래스 가독성         |
| 차트            | Recharts          | React 선언적 API               | ~400KB 번들                |
| 폰트            | Pretendard        | 폐쇄망 지원, Variable Font     | 2MB 파일 크기              |
| 빌드            | Vite 7            | 즉시 시작, 플러그인 통합       | Module Federation 미지원   |
| 단위 테스트     | Vitest            | Vite 설정 공유                 | Jest 대비 적은 레퍼런스    |
| E2E             | Playwright        | WebKit 포함 크로스 브라우저    | Cypress 대비 시각적 디버깅 |
| 린트/포맷       | ESLint + Prettier | React 전용 규칙 풍부           | Biome 대비 느림            |
