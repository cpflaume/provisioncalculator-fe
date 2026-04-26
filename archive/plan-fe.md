# Frontend Plan: Provisionsrechner (provisioncalculator-fe)

## Context

Das Backend-API (`provisioncalculator`) ist ein Multi-Tenant Provisionsberechnungs-Microservice. Kunden sind in einer Baumstruktur organisiert; Käufe lösen Provisionszahlungen an übergeordnete Knoten aus, basierend auf Tiefe und konfigurierten Prozentsätzen. Das Frontend soll diesen Workflow **benutzerzentriert** abbilden — nicht als 1:1 API-Mapping, sondern als geführter, intuitiver Prozess.

**Ziel:** Ein React-Frontend, das den gesamten Settlement-Lifecycle (Erstellen → Konfigurieren → Einkäufe erfassen → Berechnen → Prüfen → Freigeben) als zusammenhängenden, visuellen Workflow darstellt.

---

## Tech-Stack

| Technologie | Zweck |
|---|---|
| **Vite** | Build-Tool & Dev-Server |
| **React 18** + **TypeScript** | UI-Framework |
| **React Router v6** | Routing |
| **TanStack Query (React Query)** | Server-State, Caching, Mutations |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | UI-Komponenten (Dialog, Button, Input, Table, Card, Badge, Tabs, etc.) |
| **Lucide React** | Icons |
| **Recharts** | Balkendiagramme für Provisionsauswertung |
| **reactflow** | Interaktive Baumvisualisierung (Kundenbaum + Provisionsfluss) |

---

## Projekt-Struktur

```
provisioncalculator-fe/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── components.json                  # shadcn/ui config
├── .env                             # VITE_API_BASE_URL=http://localhost:8080
├── .env.example
├── .gitignore
├── public/
└── src/
    ├── main.tsx
    ├── App.tsx                      # Router-Setup
    ├── index.css                    # Tailwind imports
    ├── api/
    │   ├── client.ts                # Axios/fetch Wrapper mit tenantId + baseURL
    │   ├── settlements.ts           # Settlement API-Aufrufe
    │   ├── purchases.ts             # Purchase API-Aufrufe
    │   ├── calculations.ts          # Calculation API-Aufrufe
    │   └── types.ts                 # TypeScript-Interfaces für alle API-Responses
    ├── hooks/
    │   ├── useSettlements.ts        # TanStack Query Hooks für Settlements
    │   ├── usePurchases.ts          # TanStack Query Hooks für Purchases
    │   ├── useCalculation.ts        # TanStack Query Hooks für Calculation
    │   └── useTenant.ts             # Tenant-ID Context/Hook
    ├── components/
    │   ├── ui/                      # shadcn/ui Komponenten (auto-generiert)
    │   ├── layout/
    │   │   ├── AppShell.tsx         # Sidebar + Header + Main-Content
    │   │   ├── Sidebar.tsx          # Navigation
    │   │   └── TenantSelector.tsx   # Tenant-Auswahl im Header
    │   ├── settlement/
    │   │   ├── SettlementCard.tsx   # Karte auf dem Dashboard mit Status-Badge
    │   │   ├── StatusBadge.tsx      # Farbige Status-Anzeige (OPEN/CALCULATED/APPROVED)
    │   │   ├── StatusStepper.tsx    # Horizontaler Fortschrittsbalken des Lifecycle
    │   │   ├── CreateSettlementDialog.tsx  # Modal für neue Abrechnung
    │   │   └── ActionBar.tsx        # Kontextabhängige Aktions-Buttons
    │   ├── common/
    │   │   └── JsonFileImport.tsx   # Wiederverwendbare Drag&Drop JSON-Import Komponente
    │   ├── config/
    │   │   ├── RatesEditor.tsx      # Tabelle zum Bearbeiten der Provisionssätze
    │   │   ├── TreeEditor.tsx       # Formular zum Hinzufügen/Entfernen von Knoten
    │   │   ├── TreeVisualization.tsx # reactflow-basierte Baumdarstellung
    │   │   ├── TreeImport.tsx       # JSON-Import für Baumstruktur (+ Rates)
    │   │   └── ConfigPanel.tsx      # Kombiniert Rates + Tree + Import in Tabs
    │   ├── purchases/
    │   │   ├── PurchaseTable.tsx    # Paginierte Tabelle aller Einkäufe
    │   │   ├── AddPurchaseForm.tsx  # Formular für einzelne/Batch-Einkäufe
    │   │   ├── PurchaseImport.tsx   # JSON-Import für Einkäufe
    │   │   └── PurchaseStats.tsx    # Zusammenfassung (Anzahl, Gesamtumsatz)
    │   └── results/
    │       ├── ResultsSummary.tsx   # Übersichtskarten (Gesamtprovision, Empfänger)
    │       ├── RecipientTable.tsx   # Tabelle mit Provision pro Empfänger
    │       ├── RecipientDetail.tsx  # Detail-Ansicht mit Aufschlüsselung
    │       ├── CommissionTreeView.tsx  # Baum mit Provisionsfluss-Visualisierung
    │       └── AuditTrail.tsx       # Vollständiges Audit-Log
    └── pages/
        ├── DashboardPage.tsx        # Übersicht aller Abrechnungen
        └── SettlementPage.tsx       # Einzelne Abrechnung (Tab-basiert)
```

---

## Routing

| Route | Seite | Beschreibung |
|---|---|---|
| `/` | DashboardPage | Übersicht aller Settlements mit Status-Filter |
| `/settlements/:id` | SettlementPage | Detailseite mit Tabs |

Der `tenantId` wird über einen Context/Selector im Header verwaltet (Default: `"acme"`).

---

## Seiten-Design

### 1. Dashboard (`DashboardPage`)

- **Header:** "Provisionsrechner" + Tenant-Selector
- **Filterleiste:** Buttons für Status-Filter (Alle / Offen / Berechnet / Freigegeben)
- **Karten-Grid:** Jedes Settlement als Karte mit:
  - Name (z.B. "März 2026")
  - Status-Badge (farbig: grün=OPEN, blau=CALCULATED, grau=APPROVED)
  - Erstellt-am Datum
  - Klick → navigiert zu `/settlements/:id`
- **FAB/Button:** "Neue Abrechnung erstellen" → öffnet CreateSettlementDialog

### 2. Settlement-Detail (`SettlementPage`)

Oben: Settlement-Name + **StatusStepper** (visueller 4-Schritt-Fortschritt: Konfiguration → Einkäufe → Berechnung → Freigabe)

Darunter: **Tab-Navigation** mit kontextabhängigen Tabs:

#### Tab "Konfiguration"
- **JSON-Import:** "JSON importieren" Button → Drag&Drop Dialog für komplette Konfiguration (Rates + Tree)
- **Provisionssätze:** Editierbare Tabelle (Tiefe | Prozentsatz) mit Add/Remove
- **Kundenbaum:**
  - Links: Formular zum Hinzufügen von Knoten (Kunden-ID + übergeordneter Kunde)
  - Rechts: **reactflow-Visualisierung** des Baums (interaktiv, zoombar)
- **Speichern-Button:** Sendet PUT config (Rates + Tree atomar)
- Bei Status APPROVED: Alles read-only, Hinweis "Abrechnung ist freigegeben"

#### Tab "Einkäufe"
- **Statistik-Karten:** Anzahl Einkäufe, Gesamtumsatz
- **JSON-Import:** "Einkäufe importieren" Button → Drag&Drop für Batch-Import aus JSON-Datei
- **Einkauf hinzufügen:** Formular (Käufer aus Dropdown/Autocomplete der Baumknoten, Betrag, Datum)
- **Einkaufsliste:** Paginierte Tabelle
- Bei Status APPROVED: Kein Hinzufügen möglich

#### Tab "Ergebnisse"
- **Sichtbar nur wenn Status ≥ CALCULATED** (sonst: Hinweis "Bitte zuerst berechnen")
- **Zusammenfassung:** Gesamtprovision, Anzahl Empfänger, Cache-Status
- **Empfänger-Tabelle:** Sortierbar nach Name/Provision
- **Klick auf Empfänger** → Expandable Row oder Modal mit Detail-Aufschlüsselung
- **Provisions-Baum:** reactflow-Visualisierung mit Provisionsbeträgen an den Kanten
- **Audit-Trail Tab:** Vollständige Liste aller Einzelposten

#### ActionBar (unten fixiert oder oben rechts)
Zeigt kontextabhängig:
- Status OPEN + Config vorhanden + Purchases vorhanden → **"Berechnen"** Button
- Status CALCULATED → **"Freigeben"** + **"Ablehnen"** Buttons
- Status APPROVED → Keine Aktionen, Badge "Freigegeben"

---

## API-Service-Layer

### `api/client.ts`
```typescript
// Zentraler fetch/axios Wrapper
// Liest VITE_API_BASE_URL aus env
// Alle Requests bekommen automatisch /api/v1/tenants/{tenantId} Prefix
// Fehlerbehandlung mit toast-Benachrichtigungen
```

### `api/types.ts`
Alle TypeScript-Interfaces basierend auf den API-Responses:
- `Settlement` (id, tenantId, name, status, createdAt)
- `SettlementStatus` = "OPEN" | "CALCULATED" | "APPROVED" | "REJECTED"
- `ConfigResponse`, `GetConfigResponse`, `RateResponse`, `TreeNodeResponse`
- `PurchaseResponse`, `SubmitPurchasesResponse`
- `CalculationResponse`, `RecipientTotal`, `RecipientDetailResponse`, `CommissionDetail`
- `AuditEntry`

### TanStack Query Hooks
- `useSettlements(status?)` — Liste mit automatischem Refetch
- `useSettlement(id)` — Einzelnes Settlement
- `useConfig(settlementId)` — Konfiguration laden
- `usePurchases(settlementId, page, size)` — Paginierte Einkäufe
- `useCalculation(settlementId)` — Berechnungsergebnisse
- `useRecipientDetail(settlementId, customerId)` — Detail-Aufschlüsselung
- `useAuditTrail(settlementId)` — Audit-Log
- Mutations: `useCreateSettlement`, `useConfigureSettlement`, `useSubmitPurchases`, `useCalculate`, `useApprove`, `useReject`

---

## Schlüssel-Features für Benutzererlebnis

### 1. Geführter Workflow (StatusStepper)
Der Benutzer sieht immer, wo er im Prozess steht. Der Stepper zeigt:
```
[1. Konfiguration] → [2. Einkäufe] → [3. Berechnung] → [4. Freigabe]
     ✓ fertig          ✓ fertig        → aktuell           ○ ausstehend
```
Nicht-abgeschlossene Schritte sind ausgegraut.

### 2. Interaktive Baumvisualisierung
- reactflow mit automatischem Layout (top-to-bottom)
- Knoten zeigen Kunden-ID
- Im Ergebnis-Modus: Knoten zeigen zusätzlich Provisionsbetrag, Kanten zeigen Prozentsätze
- Hover über Knoten → Tooltip mit Details
- Zoom & Pan für große Bäume

### 3. Status-bewusste UI
- Buttons/Formulare werden basierend auf dem Settlement-Status ein-/ausgeblendet
- APPROVED Settlements sind komplett read-only mit visueller Kennzeichnung
- Automatische Aktualisierung nach Statuswechsel

### 4. Deutsche Oberfläche
Alle Labels, Buttons und Texte auf Deutsch:
- "Neue Abrechnung" statt "New Settlement"
- "Berechnen" statt "Calculate"
- "Freigeben" / "Ablehnen" statt "Approve" / "Reject"
- "Provisionssätze", "Kundenbaum", "Einkäufe", "Ergebnisse"

### 5. JSON-Datei-Import (Baum & Einkäufe)
Benutzer können Konfiguration und Einkäufe als JSON-Dateien importieren, statt alles manuell einzugeben.

#### Baum + Rates Import (Tab "Konfiguration")
- **"JSON importieren"**-Button öffnet Import-Dialog
- Drag & Drop oder Datei-Auswahl
- Erwartetes Format (identisch zum API-Format):
  ```json
  {
    "rates": [
      { "depth": 1, "ratePercent": 5.0 },
      { "depth": 2, "ratePercent": 3.0 }
    ],
    "tree": [
      { "customerId": "A", "parentCustomerId": null },
      { "customerId": "B", "parentCustomerId": "A" }
    ]
  }
  ```
- Nach Upload: Vorschau der importierten Daten (Rates-Tabelle + Baum-Visualisierung)
- Benutzer kann Daten prüfen und dann "Übernehmen" oder "Abbrechen"
- Validierung im Frontend: JSON-Syntax, erforderliche Felder, keine Duplikate

#### Einkäufe Import (Tab "Einkäufe")
- **"Einkäufe importieren"**-Button
- Erwartetes Format:
  ```json
  {
    "purchases": [
      { "buyerCustomerId": "D", "amount": 200.00, "purchasedAt": "2026-03-01T10:00:00" }
    ]
  }
  ```
- Nach Upload: Vorschau-Tabelle der importierten Einkäufe
- Validierung: buyerCustomerId muss im Baum existieren, amount > 0, gültiges Datum
- "Alle übernehmen" sendet den Batch an die API

#### Gemeinsame Import-Komponente (`JsonFileImport.tsx`)
- Drag & Drop Zone mit visuellem Feedback
- Datei-Typ Validierung (.json)
- JSON-Parse mit Fehlermeldung bei ungültigem Format
- Wiederverwendbar für beide Import-Szenarien

### 6. Echtzeit-Feedback
- Loading-States mit Skeleton-Loaders
- Success/Error Toasts nach Aktionen
- Optimistic Updates wo sinnvoll

---

## Implementierungs-Reihenfolge

### Phase 1: Projekt-Setup & Grundgerüst
1. Vite + React + TypeScript initialisieren
2. Tailwind CSS + shadcn/ui Setup
3. React Router Setup
4. API-Client + Types
5. AppShell Layout (Sidebar + Header + TenantSelector)

### Phase 2: Dashboard
6. DashboardPage mit Settlement-Liste
7. SettlementCard + StatusBadge
8. CreateSettlementDialog

### Phase 3: Settlement-Detail — Konfiguration
9. SettlementPage mit Tab-Navigation + StatusStepper
10. RatesEditor (Tabelle mit Add/Remove)
11. TreeEditor (Formular)
12. TreeVisualization (reactflow)
13. JsonFileImport (gemeinsame Drag&Drop Komponente)
14. TreeImport (JSON-Import für Konfiguration mit Vorschau)
15. ConfigPanel (Kombination + Import + Speichern)

### Phase 4: Einkäufe
16. PurchaseTable (paginiert)
17. AddPurchaseForm
18. PurchaseImport (JSON-Import für Einkäufe mit Vorschau + Validierung)
19. PurchaseStats

### Phase 5: Ergebnisse & Berechnung
20. ActionBar mit Berechnen/Freigeben/Ablehnen
21. ResultsSummary
22. RecipientTable + RecipientDetail (expandierbar)
23. CommissionTreeView (Baum mit Provisionsfluss)
24. AuditTrail

### Phase 6: Polish
25. Error-Handling & Toasts
26. Loading-States
27. Responsive Design Feinschliff

---

## Verifikation

1. **Dev-Server starten:** `npm run dev` — App lädt ohne Fehler
2. **Dashboard:** Settlements werden geladen und angezeigt (setzt laufendes Backend voraus)
3. **Settlement erstellen:** Dialog öffnet, Name eingeben, Settlement erscheint auf Dashboard
4. **Konfiguration:** Rates + Tree eingeben, Baum-Visualisierung zeigt korrekte Struktur
5. **Einkäufe:** Einkäufe hinzufügen, Tabelle zeigt sie an
6. **Berechnung:** "Berechnen" klicken → Ergebnisse werden angezeigt, Status wechselt zu CALCULATED
7. **Freigabe:** "Freigeben" klicken → Status APPROVED, UI wird read-only
8. **Ablehnen:** "Ablehnen" bei CALCULATED → Status zurück auf OPEN
9. **JSON-Import Baum:** JSON-Datei mit Rates + Tree hochladen → Vorschau zeigt Baum korrekt → "Übernehmen" speichert Konfiguration
10. **JSON-Import Einkäufe:** JSON-Datei mit Purchases hochladen → Vorschau-Tabelle → "Alle übernehmen" sendet Batch

**Ohne Backend:** Die App wird API-Fehler zeigen, aber alle Komponenten sollten rendern. Für lokale Entwicklung API unter `http://localhost:8080` starten.
