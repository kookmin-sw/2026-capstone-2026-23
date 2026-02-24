# Project Rules

## FSD (Feature-Sliced Design) 아키텍처

이 프로젝트는 FSD 아키텍처를 따른다. 코드 작성 시 반드시 아래 레이어 구조를 준수한다.

### 레이어 (위→아래로만 의존 가능)

1. `app` — 앱 초기화, 프로바이더, 글로벌 스타일
2. `pages` — 페이지 단위 컴포넌트
3. `widgets` — 독립적인 큰 UI 블록
4. `features` — 사용자 행동 단위 기능
5. `entities` — 비즈니스 데이터 단위
6. `shared` — 프로젝트 전체 공용 코드 (ui, api, lib, config, types)

### 규칙

- 각 slice(폴더)는 반드시 `index.ts` (public API)를 통해서만 외부에 export한다
- 같은 레이어 내 slice 간 직접 import 금지 (예: `features/auth`에서 `features/cart` 직접 import 불가)
- `src/routes/`는 TanStack Router 라우트 정의 전용. 실제 페이지 컴포넌트는 `src/pages/`에 작성
- 공용 UI 컴포넌트(shadcn/ui 등)는 `src/shared/ui/`에 배치
- API 클라이언트 설정은 `src/shared/api/`에 배치

### Segment 분류 기준

- `ui` — UI 컴포넌트, 스타일
- `api` — API 호출 함수
- `model` — 상태 관리, 비즈니스 로직, 타입
- `lib` — 해당 slice 내부에서 쓰는 유틸리티
- `config` — 설정, 상수

## 라이브러리 설치 시 문서화 필수

새로운 npm 패키지를 설치(`npm install`)할 때마다 반드시 `docs/libraries.md` 파일을 업데이트한다.

- 해당 패키지가 속하는 카테고리 섹션의 테이블에 행을 추가
- 패키지명과 함께 **어떤 상황에서 사용하기 위해 설치했는지** 사유를 한 줄로 기재
- 기존 카테고리에 맞지 않으면 새 카테고리 섹션을 만들어 추가
- dependencies는 "Dependencies (런타임)" 섹션, devDependencies는 "DevDependencies (개발)" 하위 섹션에 기재
