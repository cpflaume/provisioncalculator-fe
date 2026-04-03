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

    // Add 3 rates
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: 'Tiefe hinzufügen' }).click()
    }

    const rates = [
      { depth: 1, rate: 5 },
      { depth: 2, rate: 3 },
      { depth: 3, rate: 1 },
    ]

    // Fill rates row by row
    const ratesTable = page.locator('table').first()
    const rows = ratesTable.locator('tbody tr')
    for (let i = 0; i < 3; i++) {
      const row = rows.nth(i)
      const inputs = row.locator('input[type="number"]')
      await inputs.first().fill(String(rates[i].depth))
      await inputs.last().fill(String(rates[i].rate))
    }

    // Add 5 tree nodes
    const nodes = [
      { id: 'A', parent: '' },
      { id: 'B', parent: 'A' },
      { id: 'C', parent: 'B' },
      { id: 'D', parent: 'B' },
      { id: 'E', parent: 'C' },
    ]

    const customerIdInput = page.getByPlaceholder('z.B. Alice')
    const parentIdInput = page.getByPlaceholder('z.B. Bob')

    for (const node of nodes) {
      await customerIdInput.fill(node.id)
      if (node.parent) {
        await parentIdInput.fill(node.parent)
      } else {
        await parentIdInput.clear()
      }
      await page.getByRole('button', { name: 'Hinzufügen', exact: true }).click()
    }

    await expect(page.getByText('5 Knoten')).toBeVisible()

    await page.getByRole('button', { name: 'Konfiguration speichern' }).click()
    await expect(page.getByText('Konfiguration gespeichert')).toBeVisible({ timeout: 10_000 })
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
