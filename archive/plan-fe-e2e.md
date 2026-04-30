# Playwright E2E User Acceptance Tests

## Context

Das Frontend (`provisioncalculator-fe`) ist fertig implementiert. Der User möchte nun **High-Level User-Acceptance-Tests** mit Playwright, die den kompletten Settlement-Workflow testen. Tests laufen gegen das **echte Backend** (JAR vom latest GitHub Release, mit H2-In-Memory-DB im Test-Profil). Keine Mocks.

---

## Architektur-Entscheidungen

| Entscheidung | Begründung |
|---|---|
| **Echtes Backend (H2)** | Kein Mock nötig — BE hat Test-Profil mit H2 in-memory, `ddl-auto: create-drop` |
| **JAR vom latest GitHub Release** | Download via GitHub API, kein lokaler Build nötig |
| **Playwright `webServer`** | Startet/stoppt BE + FE automatisch pro Test-Run |
| **`workers: 1`, sequential** | Alle Tests teilen eine DB — serielle Ausführung vermeidet Konflikte |
| **Role-based Locators** | Deutsche UI-Texte als Selektoren (Playwright Best Practice) |
| **Toasts als Completion-Signal** | Robuster als Network-Idle-Waits |

---

## Dateistruktur

```
provisioncalculator-fe/
  playwright.config.ts
  e2e/
    global-setup.ts
    fixtures/
      config.json          # Baum + Rates (A→B→{C→E, D}, 5%/3%/1%)
      purchases.json       # 4 Einkäufe (E/100, D/200, C/50, B/300)
    settlement-lifecycle.spec.ts   # Happy Path: Create → Config → Purchases → Calculate → Approve
    settlement-reject.spec.ts      # Rejection: Calculate → Reject → back to OPEN
    settlement-import.spec.ts      # JSON-Import für Config + Purchases
```

---

## Konfiguration

### `playwright.config.ts`

- **Two `webServer` entries:** BE JAR (port 8080) + Vite dev server (port 5173)
- `baseURL: 'http://localhost:5173'`
- Single browser: Chromium
- `timeout: 60s`, `actionTimeout: 10s`, `navigationTimeout: 15s`
- `trace: 'retain-on-failure'`, `screenshot: 'only-on-failure'`
- `reuseExistingServer: !process.env.CI` (re-use during local dev)

### `e2e/global-setup.ts`

- Prüft ob JAR lokal vorhanden (im `e2e/.backend/` Verzeichnis)
- Falls nicht: Download vom **latest GitHub Release** (`cpflaume/provisioncalculator`) via GitHub API
  - GitHub API `/repos/.../releases/latest` → erstes `.jar` Asset finden → Download
  - Kein `gh` CLI nötig, nur `fetch()` (Node.js 18+)
  - Fallback: Fehler mit klarer Meldung falls kein Release/JAR gefunden
- Server-Start wird von Playwright `webServer` Config übernommen

---

## Test-Szenarien

### 1. `settlement-lifecycle.spec.ts` — Kompletter Happy Path

Serielle Tests in `test.describe.serial()`:

| Test | Schritte |
|---|---|
| **Settlement erstellen** | Dashboard → "Neue Abrechnung" → Name "März 2026" → "Erstellen" → Karte mit "Offen" Badge sichtbar |
| **Baum + Rates konfigurieren** | Karte klicken → Konfiguration-Tab → 3 Rates (5%/3%/1%) + 5 Knoten (A,B,C,D,E) manuell eingeben → "Konfiguration speichern" → Toast |
| **Einkäufe hinzufügen** | Einkäufe-Tab → 4 Einkäufe manuell (E/100, D/200, C/50, B/300) → "Einkäufe senden" → Toast |
| **Berechnen + Ergebnisse** | "Berechnen" → Toast → Status "Berechnet" → Ergebnisse-Tab → A=23,50€, B=15,50€, C=5,00€ → Audit-Log 8 Einträge |
| **Freigeben** | "Freigeben" → Toast → Status "Freigegeben" → ActionBar verschwindet → Dashboard zeigt "Freigegeben" |

### 2. `settlement-reject.spec.ts` — Ablehnungs-Flow

| Test | Schritte |
|---|---|
| **Berechnen → Ablehnen** | `beforeAll`: Settlement via API seeden (Create + Config + Purchases) → UI: "Berechnen" → "Ablehnen" → Status zurück auf "Offen" → "Berechnen" wieder sichtbar |

API-Seeding über `page.request` mit Base-URL `http://localhost:8080/api/v1/tenants/acme`.

### 3. `settlement-import.spec.ts` — JSON-Import

| Test | Schritte |
|---|---|
| **Config + Purchases importieren** | `beforeAll`: Settlement via API erstellen → Konfiguration-Tab → Import-Sub-Tab → `config.json` hochladen via `setInputFiles` → "Konfiguration speichern" → Einkäufe-Tab → Import → `purchases.json` hochladen → "Einkäufe senden" → "Berechnen" → Ergebnisse prüfen (A=23,50€) |

---

## Test-Fixtures

### `e2e/fixtures/config.json`
```json
{
  "rates": [
    { "depth": 1, "ratePercent": 5 },
    { "depth": 2, "ratePercent": 3 },
    { "depth": 3, "ratePercent": 1 }
  ],
  "tree": [
    { "customerId": "A", "parentCustomerId": null },
    { "customerId": "B", "parentCustomerId": "A" },
    { "customerId": "C", "parentCustomerId": "B" },
    { "customerId": "D", "parentCustomerId": "B" },
    { "customerId": "E", "parentCustomerId": "C" }
  ]
}
```

### `e2e/fixtures/purchases.json`
```json
{
  "purchases": [
    { "buyerCustomerId": "E", "amount": 100, "purchasedAt": "2026-03-15T10:00:00" },
    { "buyerCustomerId": "D", "amount": 200, "purchasedAt": "2026-03-15T11:00:00" },
    { "buyerCustomerId": "C", "amount": 50, "purchasedAt": "2026-03-15T12:00:00" },
    { "buyerCustomerId": "B", "amount": 300, "purchasedAt": "2026-03-15T13:00:00" }
  ]
}
```

---

## Locator-Strategie

Deutsche UI-Texte als Selektoren (keine CSS-Selektoren, keine test-ids):

- `page.getByRole('button', { name: 'Neue Abrechnung' })`
- `page.getByRole('tab', { name: 'Einkäufe' })`
- `page.getByRole('tab', { name: 'Import' })`
- `page.getByText('März 2026')`
- `page.getByText('23,50')` für Beträge
- `page.locator('input[type="file"]')` nur für File-Upload (hidden)

---

## npm Scripts

```json
{
  "test:e2e": "npx playwright test",
  "test:e2e:ui": "npx playwright test --ui",
  "test:e2e:headed": "npx playwright test --headed",
  "test:e2e:debug": "npx playwright test --debug"
}
```

---

## Implementierungs-Reihenfolge

1. `npm install --save-dev @playwright/test` + `npx playwright install chromium`
2. `playwright.config.ts` erstellen
3. `e2e/global-setup.ts` erstellen
4. `e2e/fixtures/config.json` + `purchases.json` erstellen
5. `e2e/settlement-lifecycle.spec.ts` (wichtigster Test zuerst)
6. `e2e/settlement-reject.spec.ts`
7. `e2e/settlement-import.spec.ts`
8. npm Scripts in `package.json` hinzufügen
9. `npm run test:e2e` ausführen + debuggen

---

## Kritische Dateien

- `/home/user/provisioncalculator-fe/playwright.config.ts` (neu)
- `/home/user/provisioncalculator-fe/e2e/global-setup.ts` (neu)
- `/home/user/provisioncalculator-fe/e2e/fixtures/config.json` (neu)
- `/home/user/provisioncalculator-fe/e2e/fixtures/purchases.json` (neu)
- `/home/user/provisioncalculator-fe/e2e/settlement-lifecycle.spec.ts` (neu)
- `/home/user/provisioncalculator-fe/e2e/settlement-reject.spec.ts` (neu)
- `/home/user/provisioncalculator-fe/e2e/settlement-import.spec.ts` (neu)
- `/home/user/provisioncalculator-fe/package.json` (edit: scripts + devDep)
- `e2e/.backend/*.jar` (downloaded by global-setup from latest GitHub Release)

## Verifikation

1. Tests ausführen: `cd /home/user/provisioncalculator-fe && npm run test:e2e`
2. global-setup downloaded automatisch das JAR vom latest Release
3. Alle 3 Spec-Dateien sollten grün sein
4. Bei Fehler: `npm run test:e2e:headed` für visuelles Debugging
