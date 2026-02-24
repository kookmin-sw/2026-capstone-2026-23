# Lemong 프로젝트 가이드

## 프로젝트 소개

Lemong은 React 기반 웹 애플리케이션입니다.
협업을 위한 자동화 도구들이 세팅되어 있어서, 코드를 작성하고 합치는 과정이 체계적으로 관리됩니다.

---

## 사용 기술 요약

| 분류            | 기술                    | 역할                          |
| --------------- | ----------------------- | ----------------------------- |
| 프레임워크      | React + TypeScript      | 화면을 만드는 핵심 도구       |
| 빌드 도구       | Vite                    | 개발 서버 실행, 배포용 빌드   |
| 스타일링        | TailwindCSS + shadcn/ui | 디자인, UI 컴포넌트           |
| 라우팅          | TanStack Router         | 페이지 이동 (URL 관리)        |
| 서버 데이터     | TanStack Query          | API 호출, 데이터 캐싱         |
| 클라이언트 상태 | Zustand                 | 앱 내부 상태 관리             |
| HTTP 통신       | Axios                   | 백엔드 API 호출               |
| 테스트          | Vitest + Playwright     | 단위 테스트 + 화면 테스트     |
| 컴포넌트 문서   | Storybook               | UI 컴포넌트를 독립적으로 확인 |
| 코드 품질       | ESLint + Prettier       | 코드 스타일 자동 검사/정리    |
| CI/CD           | GitHub Actions + Vercel | 자동 검사 + 자동 배포         |

---

## 아키텍처: Feature-Sliced Design (FSD)

이 프로젝트는 **FSD(Feature-Sliced Design)** 아키텍처를 사용합니다.
코드를 "역할별 레이어"로 나눠서 관리하는 방식입니다.

### 레이어 구조 (위에서 아래로 의존)

```
app      → 앱 초기화, 프로바이더, 글로벌 스타일
pages    → 페이지 단위 화면 (홈, 로그인, 마이페이지 등)
widgets  → 독립적인 큰 UI 블록 (헤더, 사이드바 등)
features → 사용자 행동 단위 기능 (로그인 폼, 좋아요 버튼 등)
entities → 비즈니스 데이터 단위 (유저, 상품, 주문 등)
shared   → 프로젝트 전체에서 재사용하는 코드 (UI 컴포넌트, API, 유틸리티)
```

**핵심 규칙**: 위 레이어는 아래 레이어만 import 가능 (예: `pages`는 `features`, `entities`, `shared`를 쓸 수 있지만, `shared`는 `pages`를 쓸 수 없음)

### 폴더 구조

```
src/
├── app/                         # 앱 설정
│   ├── providers/               # React 프로바이더 (QueryClient 등)
│   └── styles/                  # 글로벌 스타일 (TailwindCSS, 테마)
├── pages/                       # 페이지 컴포넌트
│   └── home/
│       ├── ui/HomePage.tsx      # 실제 화면 컴포넌트
│       └── index.ts             # public API (외부에 공개할 것만 export)
├── widgets/                     # 큰 UI 블록 (아직 비어있음)
├── features/                    # 기능 단위 (아직 비어있음)
├── entities/                    # 비즈니스 엔티티 (아직 비어있음)
├── shared/                      # 공용 코드
│   ├── api/                     # HTTP 클라이언트 (Axios 설정)
│   ├── ui/                      # 공용 UI 컴포넌트 (shadcn/ui)
│   ├── lib/                     # 유틸리티 함수 (cn 등)
│   ├── config/                  # 설정값, 상수
│   ├── types/                   # 공용 타입 정의
│   └── test/                    # 테스트 설정
├── routes/                      # TanStack Router 라우트 정의 (얇은 wrapper)
│   ├── __root.tsx               # 루트 레이아웃
│   └── index.tsx                # / → HomePage 연결
e2e/                             # E2E 테스트
.github/                         # CI/CD, PR 템플릿
.storybook/                      # Storybook 설정
.husky/                          # Git 커밋 시 자동 검사
```

### 새 기능 추가 예시

"로그인" 기능을 만든다면:

```
src/
├── pages/login/                 # 로그인 페이지
│   ├── ui/LoginPage.tsx
│   └── index.ts
├── features/auth/               # 인증 기능 (로그인 폼, 로그아웃 버튼)
│   ├── ui/LoginForm.tsx
│   ├── model/useAuth.ts         # 인증 상태 관리
│   ├── api/login.ts             # 로그인 API 호출
│   └── index.ts
├── entities/user/               # 유저 데이터
│   ├── model/types.ts
│   └── index.ts
```

---

## 개발부터 배포까지 전체 흐름

```
개발 → 저장 → 코드 스타일 검사(Husky) → 커밋 → push → PR 생성 → CI 자동 검사 → merge → 자동 배포
        ↑       ↑ 통과해야 커밋 가능                              ↑                    ↑
   Hot Reload  ESLint + Prettier                           GitHub Actions가        Vercel이
   로 바로확인    자동 검사/수정                                   4가지 검사 실행            자동 배포
```

### 1단계: 브랜치 만들기

```bash
git checkout develop             # develop 브랜치로 이동
git pull origin develop          # 최신 코드 받기
git checkout -b feature/기능이름  # 작업 브랜치 생성
```

### 2단계: 개발

```bash
npm run dev                      # 개발 서버 실행 (localhost:5173)
```

- `src/pages/` 에 새 페이지 추가 → `src/routes/`에 라우트 연결
- `src/features/` 에 새 기능 추가
- `src/shared/ui/` 에 재사용 가능한 UI 컴포넌트 추가
- 저장하면 브라우저에서 바로 확인 가능 (Hot Reload)

### 3단계: 커밋

```bash
git add .
git commit -m "feat: 로그인 페이지 추가"
```

커밋하는 순간 **Husky + lint-staged**가 자동 실행됩니다:

- **Prettier** — 코드 포맷이 안 맞으면 자동으로 고쳐서 커밋
- **ESLint** — 코드 에러가 있으면 커밋 차단 → 직접 수정 후 다시 커밋

```
커밋 시도
  → Husky 감지
  → lint-staged 실행
    → Prettier: 포맷 자동 수정 ✅
    → ESLint: 에러 없음 ✅ → 커밋 완료
    → ESLint: 에러 있음 ❌ → 커밋 차단 → 에러 수정 후 재시도
```

### 4단계: Push

```bash
git push origin feature/기능이름
```

### 5단계: PR(Pull Request) 생성

GitHub에서 **"New pull request"** 클릭합니다.

- base: `develop` ← compare: `feature/기능이름`
- PR 템플릿이 자동으로 채워지니 내용만 작성하면 됩니다

### 6단계: CI 자동 검사 (GitHub Actions)

PR을 만들면 로봇이 자동으로 4가지를 **동시에** 검사합니다:

| 검사 항목   | 사용 도구                      | 내용                           | 소요 시간 |
| ----------- | ------------------------------ | ------------------------------ | --------- |
| 코드 품질   | ESLint + Prettier + TypeScript | 코드 스타일, 포맷팅, 타입 검사 | ~30초     |
| 단위 테스트 | Vitest + React Testing Library | 함수/컴포넌트 동작 확인        | ~30초     |
| 빌드        | TypeScript Compiler + Vite     | 배포용 빌드가 성공하는지       | ~30초     |
| E2E 테스트  | Playwright (Chromium)          | 실제 브라우저에서 화면 테스트  | ~1분 30초 |

```
PR 생성
  → 4개 검사 동시 실행
  → 전부 통과 → CI 게이트 pass ✅ → merge 버튼 활성화

  → 하나라도 실패 → CI 게이트 fail ❌ → merge 차단
               → GitHub Actions 로그에서 원인 확인
               → 수정 후 다시 push하면 CI 자동 재실행
```

같은 PR에 새로 push하면 이전 CI 실행은 **자동 취소**되고 새로 돌아갑니다.

### 7단계: Merge & 자동 배포

```
feature → develop merge
  → Vercel 프리뷰 배포 (테스트용 URL 자동 생성)

develop → main PR 생성 → merge
  → Vercel 프로덕션 배포 (실제 서비스에 자동 반영)
```

**별도로 배포 명령어를 실행할 필요 없음 — merge하면 전부 자동으로 실행**

### 요약: 개발자가 실제로 하는 것

| 단계  | 하는 일            | 자동화                        |
| ----- | ------------------ | ----------------------------- |
| 개발  | 코드 작성          | Hot Reload로 즉시 확인        |
| 커밋  | `git commit`       | Husky가 코드 스타일 자동 검사 |
| Push  | `git push`         | —                             |
| PR    | GitHub에서 PR 생성 | CI가 4가지 검사 자동 실행     |
| Merge | merge 버튼 클릭    | Vercel이 자동 배포            |

---

## 브랜치 구조

```
main (프로덕션 - 실제 서비스에 배포되는 코드)
 └── develop (개발 통합 - 기능들이 모이는 곳)
      ├── feature/로그인
      ├── fix/로그인-에러
      └── chore/패키지-업데이트
```

### 브랜치 이름 규칙

커밋 메시지 타입과 동일한 접두사를 사용한다.

| 접두사      | 용도           | 예시                  |
| ----------- | -------------- | --------------------- |
| `feature/`  | 새 기능        | `feature/login`       |
| `fix/`      | 버그 수정      | `fix/login-error`     |
| `refactor/` | 코드 개선      | `refactor/api-client` |
| `chore/`    | 설정/도구 변경 | `chore/update-deps`   |
| `docs/`     | 문서 작업      | `docs/readme-update`  |

### 규칙

- `main`, `develop`에 직접 push 불가 → 반드시 PR을 통해서만 합칠 수 있음
- PR에서 CI 검사를 통과해야 merge 가능
- 협업자가 합류하면 리뷰 승인 1명 필수로 변경 고민중

---

## 자주 쓰는 명령어

| 명령어              | 설명                            |
| ------------------- | ------------------------------- |
| `npm run dev`       | 개발 서버 실행 (localhost:5173) |
| `npm run build`     | 프로덕션 빌드                   |
| `npm run lint`      | 코드 스타일 검사                |
| `npm run format`    | 코드 자동 정리                  |
| `npm test`          | 단위 테스트 실행                |
| `npm run test:e2e`  | E2E 테스트 실행                 |
| `npm run storybook` | Storybook 실행 (localhost:6006) |

---

## 커밋 메시지 규칙 (Conventional Commits)

형식: `타입(범위): 설명`
범위는 생략 가능하다.

| 타입       | 용도           | 예시                                         |
| ---------- | -------------- | -------------------------------------------- |
| `feat`     | 새 기능        | `feat(auth): add login form`                 |
| `fix`      | 버그 수정      | `fix(login): resolve credential validation`  |
| `docs`     | 문서 변경      | `docs(readme): update installation guide`    |
| `style`    | 포맷팅/UI 변경 | `style(button): improve spacing consistency` |
| `refactor` | 코드 리팩토링  | `refactor(user): extract service layer`      |
| `test`     | 테스트 추가    | `test(api): add query integration tests`     |
| `chore`    | 빌드/도구 변경 | `chore(deps): update react to v19`           |

범위 없이 간단하게 써도 된다: `feat: 로그인 페이지 추가`

---

## Vercel 자동 배포

- PR을 만들면 → **프리뷰 링크** 자동 생성 (합치기 전에 미리 확인 가능)
- `main`에 merge하면 → **실제 서비스에 자동 배포**
- 별도 작업 필요 없음, 전부 자동

---

## 추가 참고 파일

- /docs 폴더에 있음
