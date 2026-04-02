import { test, expect, request as apiRequest } from '@playwright/test'

const API_BASE = 'http://localhost:8080/api/v1/tenants/acme'

const configFixture = {
  rates: [
    { depth: 1, ratePercent: 5 },
    { depth: 2, ratePercent: 3 },
    { depth: 3, ratePercent: 1 },
  ],
  tree: [
    { customerId: 'A', parentCustomerId: null },
    { customerId: 'B', parentCustomerId: 'A' },
    { customerId: 'C', parentCustomerId: 'B' },
    { customerId: 'D', parentCustomerId: 'B' },
    { customerId: 'E', parentCustomerId: 'C' },
  ],
}

const purchasesFixture = {
  purchases: [
    { buyerCustomerId: 'E', amount: 100, purchasedAt: '2026-03-15T10:00:00' },
    { buyerCustomerId: 'D', amount: 200, purchasedAt: '2026-03-15T11:00:00' },
    { buyerCustomerId: 'C', amount: 50, purchasedAt: '2026-03-15T12:00:00' },
    { buyerCustomerId: 'B', amount: 300, purchasedAt: '2026-03-15T13:00:00' },
  ],
}

test.describe('Settlement Rejection Flow', () => {
  let settlementId: number

  test.beforeAll(async () => {
    const api = await apiRequest.newContext()

    const createRes = await api.post(`${API_BASE}/settlements`, {
      data: { name: 'Reject Test E2E' },
    })
    const settlement = await createRes.json()
    settlementId = settlement.id

    await api.put(`${API_BASE}/settlements/${settlementId}/config`, {
      data: configFixture,
    })

    await api.post(`${API_BASE}/settlements/${settlementId}/purchases`, {
      data: purchasesFixture,
    })

    await api.dispose()
  })

  test('Berechnen und dann ablehnen setzt Status auf Offen zurück', async ({ page }) => {
    await page.goto(`/settlements/${settlementId}`)
    await expect(page.getByRole('button', { name: 'Berechnen' })).toBeVisible({ timeout: 10_000 })

    // Calculate
    await page.getByRole('button', { name: 'Berechnen' }).click()
    await expect(page.getByText('Berechnung abgeschlossen')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('Berechnet')).toBeVisible()

    // Reject
    await page.getByRole('button', { name: 'Ablehnen' }).click()
    await expect(page.getByText('Abrechnung abgelehnt')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('Offen')).toBeVisible()

    // Berechnen should be available again
    await expect(page.getByRole('button', { name: 'Berechnen' })).toBeVisible()
  })
})
