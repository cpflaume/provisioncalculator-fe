import type { Page } from '@playwright/test'

export const ADMIN_EMAIL = 'admin@e2e.test'
export const ADMIN_PASSWORD = 'Admin1234!'

export async function loginAs(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/login')
  await page.getByLabel('E-Mail').fill(email)
  await page.getByLabel('Passwort').fill(password)
  await page.getByRole('button', { name: 'Anmelden' }).click()
}

export async function loginAsAdmin(page: Page): Promise<void> {
  await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD)
  await page.waitForURL('/')
}

export async function registerUser(
  page: Page,
  opts: { name: string; email: string; password: string }
): Promise<void> {
  await page.goto('/register')
  await page.getByLabel('Name').fill(opts.name)
  await page.getByLabel('E-Mail').fill(opts.email)
  await page.getByLabel(/Passwort/).fill(opts.password)
  await page.getByRole('button', { name: 'Registrieren' }).click()
}

export async function activateUser(page: Page, email: string): Promise<void> {
  // Assumes the page is already authenticated as admin
  await page.goto('/admin')
  const row = page.getByRole('row').filter({ hasText: email })
  await row.getByRole('button', { name: 'Aktivieren' }).click()
  await row.getByRole('button', { name: 'Deaktivieren' }).waitFor()
}

export async function logout(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Abmelden' }).click()
  await page.waitForURL('/login')
}
