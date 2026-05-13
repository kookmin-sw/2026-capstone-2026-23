# CI Pipeline & Branch Protection 구성 보고서

## 구성 일자

2026-02-21

## 생성된 파일

| 파일                               | 설명                            |
| ---------------------------------- | ------------------------------- |
| `.github/workflows/ci.yml`         | GitHub Actions CI 파이프라인    |
| `.github/PULL_REQUEST_TEMPLATE.md` | PR 생성 시 자동 적용되는 템플릿 |

## 수정된 파일

| 파일             | 변경 내용                                               |
| ---------------- | ------------------------------------------------------- |
| `vite.config.ts` | vitest `exclude`에 `e2e/**` 추가 (Playwright 충돌 해결) |

---

## CI 파이프라인 (`ci.yml`)

### 트리거

- `pull_request` → `develop`, `main` 브랜치 대상 PR에서만 실행
- `concurrency` 설정으로 같은 PR에 새 push 시 이전 실행 자동 취소

### Job 구성

| Job         | 내용                                            | 실측 시간 |
| ----------- | ----------------------------------------------- | --------- |
| `quality`   | ESLint + Prettier check + TypeScript type check | 27s       |
| `unit-test` | `vitest run --passWithNoTests`                  | 23s       |
| `build`     | `tsc -b && vite build` (프로덕션 빌드)          | 24s       |
| `e2e`       | Playwright Chromium 설치 + E2E 테스트           | 42s       |
| `ci-pass`   | 게이트 job — 위 4개 결과를 종합 판단            | 2s        |

- 4개 job이 **병렬 실행**되어 전체 wall-clock ~42s (E2E 기준)
- `ci-pass` job이 Branch Protection에 등록할 단일 status check (`CI`)

### E2E 정책

- `develop` 대상 PR: E2E 실패해도 `CI` 게이트 pass (warning만 출력)
- `main` 대상 PR: E2E 실패 시 `CI` 게이트도 fail

### 실패 시 아티팩트

- E2E 실패 시 `playwright-report/` 아티팩트 자동 업로드 (7일 보관)

---

## Branch Protection 설정

### `develop` 브랜치

| 항목                 | 설정                                   |
| -------------------- | -------------------------------------- |
| PR 필수              | O                                      |
| 리뷰 승인            | 0명 (협업자 합류 시 1명으로 변경 예정) |
| `CI` status check    | 필수 통과                              |
| 최신 상태 필수       | X                                      |
| stale review dismiss | O                                      |
| 관리자 bypass        | 허용 (긴급 시)                         |

### `main` 브랜치

| 항목                 | 설정                                   |
| -------------------- | -------------------------------------- |
| PR 필수              | O                                      |
| 리뷰 승인            | 0명 (협업자 합류 시 1명으로 변경 예정) |
| `CI` status check    | 필수 통과                              |
| 최신 상태 필수       | O                                      |
| stale review dismiss | O                                      |
| 관리자 bypass        | 불허                                   |
| force push / 삭제    | 금지                                   |

---

## 검증 결과

### PR #1 (`feature/ci-pipeline` → `develop`)

**1차 실행 — 실패**

| Job       | 결과     | 원인                                                             |
| --------- | -------- | ---------------------------------------------------------------- |
| quality   | pass     | —                                                                |
| unit-test | **fail** | vitest가 `e2e/home.spec.ts`를 실행하면서 `@playwright/test` 충돌 |
| build     | pass     | —                                                                |
| e2e       | pass     | —                                                                |
| ci-pass   | **fail** | unit-test 실패로 인한 게이트 차단                                |

**원인 분석**: `vite.config.ts`의 vitest 설정에 `exclude`가 없어서 `e2e/` 디렉토리의 Playwright 테스트 파일까지 vitest가 로드함

**수정**: `vite.config.ts`에 `exclude: ['e2e/**', 'node_modules/**']` 추가

**2차 실행 — 성공**

| Job       | 결과 | 시간 |
| --------- | ---- | ---- |
| quality   | pass | 27s  |
| unit-test | pass | 23s  |
| build     | pass | 24s  |
| e2e       | pass | 42s  |
| ci-pass   | pass | 2s   |

### PR merge

- PR #1 → `develop`에 정상 merge 완료
