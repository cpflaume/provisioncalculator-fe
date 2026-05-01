import { test, expect } from '@playwright/test'

// Demo login creates its own session — no pre-stored admin auth needed
test.use({ storageState: { cookies: [], origins: [] } })

test.describe('TC-08: Demo-Konto', () => {
  test('Demo-Login, Settlement erstellen, genau ein Mandant', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Provisionsrechner' })).toBeVisible()

    // Click the demo button and wait for dashboard navigation
    await page.getByRole('button', { name: 'Demo ausprobieren' }).click()
    await page.waitForURL('/')
    await expect(page.getByRole('heading', { name: 'Abrechnungen' })).toBeVisible()

    // Demo banner must be visible
    await expect(page.getByText('Demo-Konto')).toBeVisible()

    // Verify exactly one tenant is assigned via the API
    const meResponse = await page.request.get('/api/auth/me')
    expect(meResponse.status()).toBe(200)
    const me = await meResponse.json()
    expect(me.tenantIds).toHaveLength(1)
    expect(me.authProvider).toBe('DEMO')

    // Create a settlement
    await page.getByRole('button', { name: 'Neue Abrechnung' }).click()
    await expect(page.getByRole('heading', { name: 'Neue Abrechnung erstellen' })).toBeVisible()
    await page.getByLabel('Name').fill('Demo Settlement E2E')
    await page.getByRole('button', { name: 'Erstellen', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Neue Abrechnung erstellen' })).toBeHidden({ timeout: 10_000 })
    await expect(page.getByText('Demo Settlement E2E')).toBeVisible()

    // Tenant count must still be exactly one after settlement creation
    const meAfter = await page.request.get('/api/auth/me')
    expect(meAfter.status()).toBe(200)
    const meAfterJson = await meAfter.json()
    expect(meAfterJson.tenantIds).toHaveLength(1)
    expect(meAfterJson.tenantIds[0]).toBe(me.tenantIds[0])
  })
})
