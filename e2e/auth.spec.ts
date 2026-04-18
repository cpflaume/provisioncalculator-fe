import { test, expect } from '@playwright/test'
import { registerUser, activateUser, logout } from './helpers/auth'

// These tests run without the stored admin session (test isolation)
test.use({ storageState: { cookies: [], origins: [] } })

const uniqueEmail = () => `user-${Date.now()}@e2e.test`

test.describe('TC-01: Registrierung + Pending-Status', () => {
  test('Neuer User landet nach Registrierung auf /pending', async ({ page }) => {
    const email = uniqueEmail()
    await registerUser(page, { name: 'Test User', email, password: 'Test1234!' })

    await page.waitForURL('/pending')
    await expect(page.getByRole('heading', { name: 'Konto wird geprüft' })).toBeVisible()
    await expect(page.getByText('Test User')).toBeVisible()
  })

  test('Pending-User wird von / auf /pending weitergeleitet', async ({ page }) => {
    const email = uniqueEmail()
    await registerUser(page, { name: 'Pending Guard', email, password: 'Test1234!' })
    await page.waitForURL('/pending')

    await page.goto('/')
    await page.waitForURL('/pending')
  })
})

test.describe('TC-02: Login-Fehler', () => {
  test('Ungültige Credentials zeigen Fehlermeldung, kein Redirect', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('E-Mail').fill('nicht-vorhanden@e2e.test')
    await page.getByLabel('Passwort').fill('falschesPasswort')
    await page.getByRole('button', { name: 'Anmelden' }).click()

    await expect(page.getByText('Ungültige Anmeldedaten')).toBeVisible()
    await expect(page).toHaveURL('/login')
  })
})

test.describe('TC-03: Admin aktiviert User → Zugang freigeschaltet', () => {
  test('Aktivierter User kann auf Dashboard zugreifen', async ({ browser }) => {
    const adminContext = await browser.newContext({
      storageState: 'e2e/.auth.json',
    })
    const adminPage = await adminContext.newPage()

    const userEmail = uniqueEmail()

    // Register user in a separate context (no admin session)
    const userContext = await browser.newContext()
    const userPage = await userContext.newPage()
    await registerUser(userPage, { name: 'Neuer Nutzer', email: userEmail, password: 'Test1234!' })
    await userPage.waitForURL('/pending')

    // Admin activates the user
    await activateUser(adminPage, userEmail)

    // User logs out and back in — should now access dashboard
    await userPage.goto('/login')
    await userPage.getByLabel('E-Mail').fill(userEmail)
    await userPage.getByLabel('Passwort').fill('Test1234!')
    await userPage.getByRole('button', { name: 'Anmelden' }).click()
    await userPage.waitForURL('/')
    await expect(userPage.getByRole('heading', { name: 'Abrechnungen' })).toBeVisible()

    await adminContext.close()
    await userContext.close()
  })
})

test.describe('TC-04: Mandanten-Isolation (API)', () => {
  test('USER kann nur eigene Mandanten ansehen', async ({ page }) => {
    const email = uniqueEmail()
    const adminContext = await page.context().browser()!.newContext({
      storageState: 'e2e/.auth.json',
    })
    const adminPage = await adminContext.newPage()

    // Register and activate user
    await registerUser(page, { name: 'Mandant Tester', email, password: 'Test1234!' })
    await page.waitForURL('/pending')
    await activateUser(adminPage, email)
    await adminContext.close()

    // Log in as user
    await page.goto('/login')
    await page.getByLabel('E-Mail').fill(email)
    await page.getByLabel('Passwort').fill('Test1234!')
    await page.getByRole('button', { name: 'Anmelden' }).click()
    await page.waitForURL('/')

    // TenantSelector shows only own tenant
    const tenantDisplay = page.locator('[data-testid="tenant-display"]')
    await expect(tenantDisplay).toContainText('mandant-tester')
  })
})

test.describe('TC-05: Admin-Bereich gesperrt für normale User', () => {
  test('Normaler User wird von /admin zu / weitergeleitet', async ({ browser }) => {
    const email = uniqueEmail()
    const adminCtx = await browser.newContext({ storageState: 'e2e/.auth.json' })
    const adminPage = await adminCtx.newPage()

    const userCtx = await browser.newContext()
    const userPage = await userCtx.newPage()

    await registerUser(userPage, { name: 'Kein Admin', email, password: 'Test1234!' })
    await userPage.waitForURL('/pending')
    await activateUser(adminPage, email)

    await userPage.goto('/login')
    await userPage.getByLabel('E-Mail').fill(email)
    await userPage.getByLabel('Passwort').fill('Test1234!')
    await userPage.getByRole('button', { name: 'Anmelden' }).click()
    await userPage.waitForURL('/')

    await userPage.goto('/admin')
    await userPage.waitForURL('/')

    await adminCtx.close()
    await userCtx.close()
  })
})

test.describe('TC-06: Logout', () => {
  test('Logout löscht Session und leitet auf /login weiter', async ({ page }) => {
    const email = uniqueEmail()
    const adminCtx = await page.context().browser()!.newContext({
      storageState: 'e2e/.auth.json',
    })
    const adminPage = await adminCtx.newPage()

    await registerUser(page, { name: 'Logout Test', email, password: 'Test1234!' })
    await page.waitForURL('/pending')
    await activateUser(adminPage, email)
    await adminCtx.close()

    await page.goto('/login')
    await page.getByLabel('E-Mail').fill(email)
    await page.getByLabel('Passwort').fill('Test1234!')
    await page.getByRole('button', { name: 'Anmelden' }).click()
    await page.waitForURL('/')

    await logout(page)
    await expect(page).toHaveURL('/login')

    // Navigating back to / re-redirects to /login
    await page.goto('/')
    await page.waitForURL('/login')
  })
})

test.describe('TC-07: Token-Ablauf', () => {
  test('Ungültiger Token im localStorage führt zu Redirect nach /login', async ({ page }) => {
    // Inject an invalid/expired token
    await page.goto('/login')
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'invalid.token.value')
    })

    await page.goto('/')
    await page.waitForURL('/login')
  })
})
