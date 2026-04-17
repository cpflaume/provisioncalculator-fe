import { test as setup, expect } from '@playwright/test'

const authFile = 'e2e/.auth.json'

const ADMIN_EMAIL = 'admin@e2e.test'
const ADMIN_PASSWORD = 'Admin1234!'

setup('authenticate as admin', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'Provisionsrechner' })).toBeVisible()

  await page.getByLabel('E-Mail').fill(ADMIN_EMAIL)
  await page.getByLabel('Passwort').fill(ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Anmelden' }).click()

  await page.waitForURL('/')
  await expect(page.getByRole('heading', { name: 'Abrechnungen' })).toBeVisible()

  await page.context().storageState({ path: authFile })
})
