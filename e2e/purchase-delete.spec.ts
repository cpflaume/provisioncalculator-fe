import { test, expect, request as apiRequest } from '@playwright/test'
import { ADMIN_EMAIL, ADMIN_PASSWORD } from './helpers/auth'

const BACKEND_URL = 'http://localhost:8080'
const ADMIN_TENANT = 'e2e-admin'

test.describe.serial('Purchase Delete', () => {
  let settlementId: number
  let api: Awaited<ReturnType<typeof apiRequest.newContext>>

  test.beforeAll(async () => {
    const base = await apiRequest.newContext()
    const loginRes = await base.post(`${BACKEND_URL}/api/auth/login`, {
      data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    })
    const { token } = await loginRes.json()
    await base.dispose()

    api = await apiRequest.newContext({
      extraHTTPHeaders: { Authorization: `Bearer ${token}` },
    })

    const createRes = await api.post(
      `${BACKEND_URL}/api/v1/tenants/${ADMIN_TENANT}/settlements`,
      { data: { name: 'Purchase Delete E2E' } },
    )
    settlementId = (await createRes.json()).id

    await api.put(
      `${BACKEND_URL}/api/v1/tenants/${ADMIN_TENANT}/settlements/${settlementId}/config`,
      {
        data: {
          rates: [{ depth: 1, ratePercent: 5 }],
          tree: [
            { customerId: 'A', parentCustomerId: null },
            { customerId: 'B', parentCustomerId: 'A' },
          ],
        },
      },
    )

    await api.post(
      `${BACKEND_URL}/api/v1/tenants/${ADMIN_TENANT}/settlements/${settlementId}/purchases`,
      {
        data: {
          purchases: [
            { buyerCustomerId: 'B', amount: 100, purchasedAt: '2026-03-01T10:00:00' },
            { buyerCustomerId: 'B', amount: 200, purchasedAt: '2026-03-02T10:00:00' },
          ],
        },
      },
    )
  })

  test.afterAll(async () => {
    await api.dispose()
  })

  test('Übersicht – Löschen-Button entfernt Zeile aus Tabelle', async ({ page }) => {
    await page.goto(`/settlements/${settlementId}`)
    await page.getByRole('tab', { name: 'Einkäufe' }).click()

    const rows = page.getByRole('tabpanel').locator('table tbody tr')
    await expect(rows).toHaveCount(2)

    // Each row has a delete button (Trash icon) in the last cell
    const [deleteResp] = await Promise.all([
      page.waitForResponse(
        r => r.url().includes('/purchases/') && r.request().method() === 'DELETE',
        { timeout: 10_000 },
      ),
      rows.first().getByRole('button').click(),
    ])
    expect(deleteResp.status()).toBe(204)

    await expect(rows).toHaveCount(1)
  })

  test('Hinzufügen – Löschen-Button entfernt Eintrag aus zuletzt-hinzugefügt-Liste', async ({ page }) => {
    await page.goto(`/settlements/${settlementId}`)
    await page.getByRole('tab', { name: 'Einkäufe' }).click()
    await page.getByRole('tab', { name: 'Hinzufügen' }).click()

    // Add a purchase via form
    await page.getByPlaceholder('z.B. Customer-A').fill('B')
    await page.getByPlaceholder('0,00').fill('50')
    await page.locator('input[type="datetime-local"]').fill('2026-03-03T10:00')

    const [submitResp] = await Promise.all([
      page.waitForResponse(
        r => r.url().includes('/purchases') && r.request().method() === 'POST',
        { timeout: 10_000 },
      ),
      page.getByRole('tabpanel').getByRole('button', { name: 'Hinzufügen' }).click(),
    ])
    expect(submitResp.status()).toBe(202)

    // Recently-added table appears with 1 row
    const tabpanel = page.getByRole('tabpanel')
    const recentRows = tabpanel.locator('table tbody tr')
    await expect(recentRows).toHaveCount(1)

    // Delete the recently added purchase
    const [deleteResp] = await Promise.all([
      page.waitForResponse(
        r => r.url().includes('/purchases/') && r.request().method() === 'DELETE',
        { timeout: 10_000 },
      ),
      recentRows.first().getByRole('button').click(),
    ])
    expect(deleteResp.status()).toBe(204)

    // Table unmounts when the recent list is empty
    await expect(tabpanel.locator('table')).toHaveCount(0)
  })

  test('Freigegeben – kein Löschen-Button sichtbar', async ({ page }) => {
    // Calculate then approve via API so the settlement becomes read-only
    await api.post(
      `${BACKEND_URL}/api/v1/tenants/${ADMIN_TENANT}/settlements/${settlementId}/calculate`,
      { data: {} },
    )
    await api.post(
      `${BACKEND_URL}/api/v1/tenants/${ADMIN_TENANT}/settlements/${settlementId}/approve`,
      { data: {} },
    )

    await page.goto(`/settlements/${settlementId}`)
    await page.getByRole('tab', { name: 'Einkäufe' }).click()

    // Hinzufügen and Import tabs are hidden in readOnly mode
    await expect(page.getByRole('tab', { name: 'Hinzufügen' })).toBeHidden()

    // Table has 3 columns (Käufer, Betrag, Kaufdatum) – no 4th delete column
    await expect(page.locator('table thead th')).toHaveCount(3)
  })
})
