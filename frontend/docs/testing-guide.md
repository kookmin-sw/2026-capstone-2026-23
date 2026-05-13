# 테스트 코드 작성 가이드

## 언제 작성하나?

### 작성해야 하는 것

- 조건 분기가 있는 함수 (if/else, switch)
- 데이터를 가공/변환하는 함수
- 상태 관리 로직 (Zustand store)
- API 호출 후 데이터 처리 로직

### 안 써도 되는 것

- 단순 렌더링만 하는 컴포넌트
- 스타일만 다른 컴포넌트
- 외부 라이브러리를 그대로 감싼 wrapper

---

## 작성 방법

테스트는 3단계로 구성한다: **준비 → 실행 → 확인**

```ts
test('할인율 10%가 적용된다', () => {
  // 준비
  const price = 10000

  // 실행
  const result = applyDiscount(price, 10)

  // 확인
  expect(result).toBe(9000)
})
```

---

## 테스트 이름 짓는 법

**"~하면 ~한다"** 패턴으로 작성한다.

```ts
// 좋은 예
test('가격이 0원이면 할인을 적용하지 않는다', () => { ... })
test('로그인 실패 시 에러 메시지를 반환한다', () => { ... })

// 나쁜 예
test('테스트1', () => { ... })
test('applyDiscount', () => { ... })
```

---

## 뭘 확인해야 하나?

1. **정상 케이스** — 기대한 대로 동작하는지
2. **엣지 케이스** — 빈 값, 0, null 등 경계값
3. **에러 케이스** — 잘못된 입력 시 어떻게 되는지

```ts
// 정상
test('상품 2개의 합계를 계산한다', () => {
  expect(calcTotal([5000, 3000])).toBe(8000)
})

// 엣지
test('빈 장바구니면 0원이다', () => {
  expect(calcTotal([])).toBe(0)
})

// 에러
test('음수 가격이 있으면 에러를 던진다', () => {
  expect(() => calcTotal([-1000])).toThrow()
})
```

---

## 테스트 파일 위치

테스트 대상 파일 바로 옆에 작성한다.

```
src/shared/lib/
├── cn.ts              # 원본
├── cn.test.ts         # 테스트

src/features/auth/
├── api/
│   ├── login.ts
│   └── login.test.ts
├── model/
│   ├── useAuth.ts
│   └── useAuth.test.ts
└── ui/
    ├── LoginForm.tsx
    └── LoginForm.test.tsx
```

---

## 실행 방법

| 명령어               | 설명                                     |
| -------------------- | ---------------------------------------- |
| `npm test`           | 전체 테스트 실행                         |
| `npm run test:watch` | 파일 수정하면 자동 재실행 (개발 중 편함) |
| `npm run test:e2e`   | E2E 테스트 실행 (Playwright)             |

---

## E2E 테스트

E2E 테스트는 실제 브라우저에서 사용자처럼 클릭/입력하며 화면을 확인하는 테스트다.
`e2e/` 폴더에 작성하며, 핵심 흐름(로그인, 결제 등)에만 작성한다.

```ts
// e2e/auth/login.spec.ts
test('로그인 성공 시 홈으로 이동한다', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('이메일').fill('test@test.com')
  await page.getByLabel('비밀번호').fill('password123')
  await page.getByRole('button', { name: '로그인' }).click()
  await expect(page).toHaveURL('/')
})
```

### codegen으로 테스트 코드 자동 생성

```bash
npx playwright codegen http://localhost:5173
```

브라우저가 열리고, 클릭/입력하는 대로 코드가 자동 생성된다.
단, 검증 로직(`expect`)은 직접 추가해야 한다.
