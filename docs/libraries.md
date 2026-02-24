# Libraries

프로젝트에서 사용하는 모든 라이브러리와 설치 사유를 정리합니다.

## Dependencies (런타임)

| 패키지                           | 설치 사유                                                                                  |
| -------------------------------- | ------------------------------------------------------------------------------------------ |
| `react`                          | UI 프레임워크. 컴포넌트 기반으로 사용자 인터페이스를 구성하기 위해 사용                    |
| `react-dom`                      | React 컴포넌트를 브라우저 DOM에 렌더링하기 위해 사용                                       |
| `@tanstack/react-router`         | 타입 안전한 파일 기반 라우팅을 위해 사용. URL 파라미터, 검색 파라미터 등을 타입으로 관리   |
| `@tanstack/react-query`          | 서버 상태 관리 및 데이터 페칭을 위해 사용. 캐싱, 리페칭, 로딩/에러 상태 자동 관리          |
| `@tanstack/react-query-devtools` | React Query의 캐시 상태를 시각적으로 디버깅하기 위한 개발 도구                             |
| `zustand`                        | 클라이언트 전역 상태 관리를 위해 사용. 보일러플레이트가 적고 간결한 API 제공               |
| `axios`                          | HTTP API 통신을 위해 사용. 인터셉터, 타임아웃, 요청/응답 변환 기능 활용                    |
| `clsx`                           | 조건부 className 문자열 조합을 위해 사용. shadcn/ui의 cn() 유틸리티 내부에서 활용          |
| `tailwind-merge`                 | TailwindCSS 클래스 충돌 시 후순위 클래스로 병합하기 위해 사용. cn() 유틸리티 내부에서 활용 |
| `class-variance-authority`       | shadcn/ui 컴포넌트의 변형(variant) 스타일을 타입 안전하게 정의하기 위해 사용               |
| `lucide-react`                   | shadcn/ui 기본 아이콘 라이브러리. 일관된 아이콘 시스템 제공                                |
| `radix-ui`                       | shadcn/ui의 기반 헤드리스 UI 프리미티브. 접근성이 보장된 컴포넌트 동작 로직 제공           |

## DevDependencies (개발)

### 빌드 및 개발 서버

| 패키지                 | 설치 사유                                                                                 |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| `vite`                 | 빠른 개발 서버와 최적화된 프로덕션 빌드를 위한 빌드 도구                                  |
| `@vitejs/plugin-react` | Vite에서 React JSX 변환 및 Fast Refresh를 지원하기 위해 사용                              |
| `typescript`           | 정적 타입 검사를 통한 코드 안정성 확보를 위해 사용                                        |
| `@types/node`          | Node.js API(path 등)의 TypeScript 타입 정의. vite.config.ts에서 path.resolve 사용 시 필요 |
| `@types/react`         | React의 TypeScript 타입 정의                                                              |
| `@types/react-dom`     | ReactDOM의 TypeScript 타입 정의                                                           |

### 라우팅

| 패키지                      | 설치 사유                                                                                |
| --------------------------- | ---------------------------------------------------------------------------------------- |
| `@tanstack/router-plugin`   | Vite 플러그인으로 파일 기반 라우트를 자동 감지하고 routeTree.gen.ts를 생성하기 위해 사용 |
| `@tanstack/router-devtools` | 라우터 상태, 매칭된 경로, 파라미터를 시각적으로 디버깅하기 위한 개발 도구                |

### 스타일링

| 패키지              | 설치 사유                                                                           |
| ------------------- | ----------------------------------------------------------------------------------- |
| `tailwindcss`       | 유틸리티 기반 CSS 프레임워크. 빠른 UI 개발과 일관된 디자인 시스템 구축을 위해 사용  |
| `@tailwindcss/vite` | TailwindCSS v4의 Vite 전용 플러그인. PostCSS 설정 없이 빌드 파이프라인에 통합       |
| `tw-animate-css`    | shadcn/ui 컴포넌트의 진입/퇴장 애니메이션을 위해 사용                               |
| `shadcn`            | shadcn/ui CLI. 컴포넌트를 프로젝트에 복사하여 추가하기 위해 사용 (`npx shadcn add`) |

### 단위 테스트

| 패키지                      | 설치 사유                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------ |
| `vitest`                    | Vite 기반 단위 테스트 러너. Vite 설정을 그대로 공유하여 별도 설정 없이 테스트 실행   |
| `@testing-library/react`    | React 컴포넌트를 사용자 관점에서 테스트하기 위해 사용. DOM 쿼리 및 이벤트 시뮬레이션 |
| `@testing-library/jest-dom` | DOM 요소에 대한 커스텀 매처(toBeVisible, toHaveTextContent 등) 제공                  |
| `jsdom`                     | Node.js 환경에서 브라우저 DOM을 시뮬레이션하기 위해 사용. vitest의 test environment  |

### E2E 테스트

| 패키지             | 설치 사유                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------- |
| `@playwright/test` | 실제 브라우저에서 사용자 시나리오를 재현하는 E2E 테스트를 위해 사용. 크로스 브라우저 지원 |

### 컴포넌트 문서화

| 패키지                          | 설치 사유                                                                       |
| ------------------------------- | ------------------------------------------------------------------------------- |
| `storybook`                     | 컴포넌트를 독립적으로 개발하고 문서화하기 위한 도구. UI 컴포넌트 카탈로그 역할  |
| `@storybook/react`              | Storybook에서 React 컴포넌트를 렌더링하기 위한 프레임워크 어댑터                |
| `@storybook/react-vite`         | Storybook 빌드에 Vite를 사용하기 위한 빌더. 프로젝트 Vite 설정 공유             |
| `@storybook/addon-essentials`   | Storybook 필수 애드온 번들 (Controls, Actions, Viewport, Backgrounds 등)        |
| `@storybook/blocks`             | Storybook 문서 페이지(MDX)에서 사용하는 UI 블록 컴포넌트                        |
| `@storybook/test`               | Storybook 내에서 컴포넌트 인터랙션 테스트를 작성하기 위해 사용                  |
| `@storybook/addon-onboarding`   | Storybook 첫 사용자를 위한 온보딩 가이드 애드온                                 |
| `@storybook/addon-interactions` | Storybook에서 play 함수 기반 인터랙션 테스트 결과를 패널에서 확인하기 위해 사용 |

### 코드 품질

| 패키지                        | 설치 사유                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------ |
| `eslint`                      | 코드 정적 분석 도구. 잠재적 버그와 안티패턴을 감지하기 위해 사용               |
| `@eslint/js`                  | ESLint 기본 JavaScript 규칙 세트 제공                                          |
| `typescript-eslint`           | ESLint에서 TypeScript 코드를 파싱하고 타입 기반 린트 규칙을 적용하기 위해 사용 |
| `eslint-plugin-react-hooks`   | React Hooks 사용 규칙(의존성 배열, 호출 순서 등)을 검사하기 위해 사용          |
| `eslint-plugin-react-refresh` | React Fast Refresh와 호환되지 않는 컴포넌트 내보내기 패턴을 감지하기 위해 사용 |
| `eslint-config-prettier`      | ESLint와 Prettier 간 충돌하는 포맷팅 규칙을 비활성화하기 위해 사용             |
| `globals`                     | ESLint에 브라우저/Node.js 글로벌 변수 목록을 제공하기 위해 사용                |
| `prettier`                    | 일관된 코드 포맷팅을 위한 자동 정렬 도구                                       |
| `prettier-plugin-tailwindcss` | TailwindCSS 클래스를 권장 순서에 따라 자동 정렬하기 위해 사용                  |

### Git 훅

| 패키지        | 설치 사유                                                                            |
| ------------- | ------------------------------------------------------------------------------------ |
| `husky`       | Git 훅을 쉽게 관리하기 위해 사용. pre-commit 시 자동 검사 실행                       |
| `lint-staged` | Git에 staged된 파일에 대해서만 린트/포맷을 실행하여 커밋 속도를 최적화하기 위해 사용 |
