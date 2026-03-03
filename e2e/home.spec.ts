import { test, expect } from '@playwright/test'

test('대시보드가 정상적으로 표시된다', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /대시보드/ })).toBeVisible()
})
