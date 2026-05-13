import { test, expect } from '@playwright/test'

test('비인증 상태에서 로그인 페이지로 리다이렉트된다', async ({ page }) => {
  await page.goto('/')
  await page.waitForURL('**/login')
  await expect(page.getByRole('button', { name: /로그인/ })).toBeVisible()
})
