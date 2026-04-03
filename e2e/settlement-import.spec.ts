import { test, expect, request as apiRequest } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const API_BASE = 'http://localhost:8080/api/v1/tenants/acme'

test.describe('Settlement JSON Import Flow', () => {
  let settlementId: number

  test.beforeAll(async () => {
    const api = await apiRequest.newContext()
    const createRes = await api.post(`${API_BASE}/settlements`, {
      data: { name: 'Import Test E2E' },
    })
    const settlement = await createRes.json()
    settlementId = settlement.id
    await api.dispose()
  })

  test('Config und Einkäufe per JSON importieren', async ({ page }) => {
    await page.goto(`/settlements/${settlementId}`)
    await expect(page.getByRole('tab', { name: 'Konfiguration' })).toBeVisible({ timeout: 10_000 })

    // Import config via JSON file
    await page.getByRole('tab', { name: 'Import' }).click()
    const configInput = page.locator('input[type="file"]')
    await configInput.setInputFiles(path.resolve(__dirname, 'fixtures/config.json'))

    // Verify imported data is visible
    await page.getByRole('tab', { name: 'Bearbeiten' }).click()
    await expect(page.getByText('5 Knoten')).toBeVisible()

    // Save config
    await page.getByRole('button', { name: 'Konfiguration speichern' }).click()
    await expect(page.getByText('Konfiguration gespeichert')).toBeVisible({ timeout: 10_000 })

    // Switch to purchases tab and import
    await page.getByRole('tab', { name: 'Einkäufe' }).click()
    await page.getByRole('tab', { name: 'Import' }).click()
    const purchasesInput = page.locator('input[type="file"]')
    await purchasesInput.setInputFiles(path.resolve(__dirname, 'fixtures/purchases.json'))

    // Submit imported purchases
    await expect(page.getByText('4 Einkauf/Einkäufe bereit zum Senden')).toBeVisible()
    await page.getByRole('button', { name: 'Einkäufe senden' }).click()
    await expect(page.getByText(/4 Einkäufe gesendet/)).toBeVisible({ timeout: 10_000 })

    // Calculate and verify results
    await page.getByRole('button', { name: 'Berechnen' }).click()
    await expect(page.getByText('Berechnung abgeschlossen')).toBeVisible({ timeout: 10_000 })

    await page.getByRole('tab', { name: 'Ergebnisse' }).click()
    await expect(page.getByText('23,50')).toBeVisible()
    await expect(page.getByText('15,50')).toBeVisible()
    await expect(page.getByText('5,00')).toBeVisible()
  })
})
