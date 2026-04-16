import { test, expect } from '@playwright/test'

const SETTLEMENT_NAME = 'März 2026 E2E'

test.describe.serial('Settlement Lifecycle – Happy Path', () => {
  let settlementUrl: string

  test('Settlement erstellen', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Abrechnungen' })).toBeVisible()

    await page.getByRole('button', { name: 'Neue Abrechnung' }).click()

    // Wait for dialog to appear
    await expect(page.getByRole('heading', { name: 'Neue Abrechnung erstellen' })).toBeVisible()

    await page.getByLabel('Name').fill(SETTLEMENT_NAME)
    await page.getByRole('button', { name: 'Erstellen', exact: true }).click()

    // Wait for dialog to close
    await expect(page.getByRole('heading', { name: 'Neue Abrechnung erstellen' })).toBeHidden({ timeout: 10_000 })

    const card = page.getByText(SETTLEMENT_NAME)
    await expect(card).toBeVisible()

    await card.click()
    await page.waitForURL(/\/settlements\/\d+/)
    settlementUrl = page.url()
  })

  test('Baum und Rates konfigurieren', async ({ page }) => {
    await page.goto(settlementUrl)
    await expect(page.getByRole('tab', { name: 'Konfiguration' })).toBeVisible()

    // Helper: wait for the next PUT /config response (any status)
    const waitForSave = () =>
      page.waitForResponse(
        r => r.url().includes('/config') && r.request().method() === 'PUT',
        { timeout: 10_000 },
      )

    // Add 3 rates via inline input row (depth auto-increments: 1, 2, 3).
    // Each save is expected to fail (400) because the tree is still empty —
    // that is intentional; rates are persisted together with the first valid tree save.
    const ratesTable = page.locator('table').first()
    for (const ratePercent of [5, 3, 1]) {
      const inputRow = ratesTable.locator('tbody tr').last()
      await inputRow.locator('input[type="number"]').last().fill(String(ratePercent))
      await Promise.all([waitForSave(), ratesTable.getByRole('button', { name: 'Hinzufügen' }).click()])
    }

    // Add 5 tree nodes. Each save now includes the full rates + growing tree.
    // Waiting for each 200 response before the next click prevents concurrent
    // saves from racing and overwriting each other on the server.
    const treeNodes = [
      { id: 'A', parent: '' },
      { id: 'B', parent: 'A' },
      { id: 'C', parent: 'B' },
      { id: 'D', parent: 'B' },
      { id: 'E', parent: 'C' },
    ]

    const customerIdInput = page.getByPlaceholder('z.B. Alice')
    const parentIdInput = page.getByPlaceholder('z.B. Bob')
    // Tree "Hinzufügen" is always the last button — the rates one lives inside <table>
    const treeAddButton = page.getByRole('button', { name: 'Hinzufügen', exact: true }).last()

    for (const node of treeNodes) {
      await customerIdInput.fill(node.id)
      if (node.parent) {
        await parentIdInput.fill(node.parent)
      } else {
        await parentIdInput.clear()
      }
      const [resp] = await Promise.all([waitForSave(), treeAddButton.click()])
      expect(resp.status()).toBe(200)
    }

    await expect(page.getByText('5 Knoten')).toBeVisible()
  })

  test('Einkäufe hinzufügen', async ({ page }) => {
    await page.goto(settlementUrl)
    await page.getByRole('tab', { name: 'Einkäufe' }).click()
    await page.getByRole('tab', { name: 'Hinzufügen' }).click()

    const purchases = [
      { buyer: 'E', amount: '100', date: '2026-03-15T10:00' },
      { buyer: 'D', amount: '200', date: '2026-03-15T11:00' },
      { buyer: 'C', amount: '50', date: '2026-03-15T12:00' },
      { buyer: 'B', amount: '300', date: '2026-03-15T13:00' },
    ]

    const buyerInput = page.getByPlaceholder('z.B. Customer-A')
    const amountInput = page.getByPlaceholder('0,00')
    const dateInput = page.locator('input[type="datetime-local"]')

    for (const p of purchases) {
      await buyerInput.fill(p.buyer)
      await amountInput.fill(p.amount)
      await dateInput.fill(p.date)
      await page.getByRole('tabpanel').getByRole('button', { name: 'Hinzufügen' }).click()
    }

    await expect(page.getByText('4 Einkauf/Einkäufe bereit zum Senden')).toBeVisible()
    await page.getByRole('button', { name: 'Einkäufe senden' }).click()
    await expect(page.getByText(/4 Einkäufe gesendet/)).toBeVisible({ timeout: 10_000 })
  })

  test('Berechnen und Ergebnisse prüfen', async ({ page }) => {
    await page.goto(settlementUrl)
    await page.getByRole('button', { name: 'Berechnen' }).click()
    await expect(page.getByText('Berechnung abgeschlossen')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('Berechnet')).toBeVisible()

    await page.getByRole('tab', { name: 'Ergebnisse' }).click()

    // Check commission amounts
    await expect(page.getByText('23,50')).toBeVisible()
    await expect(page.getByText('15,50')).toBeVisible()
    await expect(page.getByText('5,00')).toBeVisible()

    // Check audit log
    await page.getByRole('tab', { name: 'Audit-Log' }).click()
    await expect(page.getByText('8 Einträge')).toBeVisible()
  })

  test('Freigeben', async ({ page }) => {
    await page.goto(settlementUrl)
    await page.getByRole('button', { name: 'Freigeben' }).click()
    await expect(page.getByText('Abrechnung freigegeben')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('Freigegeben', { exact: true })).toBeVisible()

    // ActionBar should be gone
    await expect(page.getByRole('button', { name: 'Berechnen' })).toBeHidden()
    await expect(page.getByRole('button', { name: 'Freigeben' })).toBeHidden()

    // Navigate back to dashboard and verify
    await page.getByText('Zurück').click()
    await expect(page.getByText(SETTLEMENT_NAME)).toBeVisible()
  })
})
