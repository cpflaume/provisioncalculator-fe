import { test, expect, request as apiRequest } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'
import { ADMIN_EMAIL, ADMIN_PASSWORD } from './helpers/auth'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BACKEND_URL = 'http://localhost:8080'
const ADMIN_TENANT = 'e2e-admin'

test.describe('Settlement JSON Import Flow', () => {
  let settlementId: number

  test.beforeAll(async () => {
    const base = await apiRequest.newContext()
    const loginRes = await base.post(`${BACKEND_URL}/api/auth/login`, {
      data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    })
    const { token } = await loginRes.json()
    await base.dispose()

    const api = await apiRequest.newContext({
      extraHTTPHeaders: { Authorization: `Bearer ${token}` },
    })
    const createRes = await api.post(
      `${BACKEND_URL}/api/v1/tenants/${ADMIN_TENANT}/settlements`,
      { data: { name: 'Import Test E2E' } }
    )
    const settlement = await createRes.json()
    settlementId = settlement.id
    await api.dispose()
  })

  test('Config und Einkäufe per JSON importieren', async ({ page }) => {
    await page.goto(`/settlements/${settlementId}`)
    await expect(page.getByRole('tab', { name: 'Konfiguration' })).toBeVisible({ timeout: 10_000 })

    // Import config via JSON file — triggers an immediate auto-save
    await page.getByRole('tab', { name: 'Import' }).click()
    const configInput = page.locator('input[type="file"]')
    // Register the response listener before setting the file so we cannot miss it
    const [saveResp] = await Promise.all([
      page.waitForResponse(
        r => r.url().includes('/config') && r.request().method() === 'PUT',
        { timeout: 10_000 },
      ),
      configInput.setInputFiles(path.resolve(__dirname, 'fixtures/config.json')),
    ])
    expect(saveResp.status()).toBe(200)

    // Verify imported data is visible in the editor tab
    await page.getByRole('tab', { name: 'Bearbeiten' }).click()
    await expect(page.getByText('5 Knoten')).toBeVisible()

    // Switch to purchases tab and import
    await page.getByRole('tab', { name: 'Einkäufe' }).click()
    await page.getByRole('tab', { name: 'Import' }).click()
    const purchasesInput = page.locator('input[type="file"]')
    // File load triggers immediate API submit — register listener before setting file
    const [importResp] = await Promise.all([
      page.waitForResponse(
        r => r.url().includes('/purchases') && r.request().method() === 'POST',
        { timeout: 10_000 },
      ),
      purchasesInput.setInputFiles(path.resolve(__dirname, 'fixtures/purchases.json')),
    ])
    expect(importResp.status()).toBe(202)

    // Calculate and verify results
    await page.getByRole('button', { name: 'Berechnen' }).click()
    await expect(page.getByText('Berechnung abgeschlossen')).toBeVisible({ timeout: 10_000 })

    await page.getByRole('tab', { name: 'Ergebnisse' }).click()
    await expect(page.getByText('23,50')).toBeVisible()
    await expect(page.getByText('15,50')).toBeVisible()
    await expect(page.getByText('5,00')).toBeVisible()
  })
})
