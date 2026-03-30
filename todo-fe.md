# To-Do: Frontend Provisionsrechner

## Phase 1: Projekt-Setup & Grundgerüst

- [x] Vite + React + TypeScript Projekt initialisieren
- [x] Tailwind CSS installieren und konfigurieren
- [x] shadcn/ui Setup (components.json, erste Basis-Komponenten)
- [x] React Router v6 einrichten
- [x] TanStack Query (React Query) einrichten
- [x] reactflow installieren
- [x] Recharts installieren
- [x] Lucide React Icons installieren
- [x] `.env` / `.env.example` mit `VITE_API_BASE_URL` anlegen
- [x] `.gitignore` erstellen
- [x] API-Client (`api/client.ts`) — zentraler fetch-Wrapper mit tenantId + baseURL
- [x] TypeScript-Interfaces für alle API-Responses (`api/types.ts`)
- [x] API-Funktionen: Settlements (`api/settlements.ts`)
- [x] API-Funktionen: Purchases (`api/purchases.ts`)
- [x] API-Funktionen: Calculations (`api/calculations.ts`)
- [x] Tenant-Context/Hook (`hooks/useTenant.ts`)
- [x] AppShell Layout (`components/layout/AppShell.tsx`) — Sidebar + Header + Main
- [x] Sidebar Navigation (`components/layout/Sidebar.tsx`)
- [x] TenantSelector im Header (`components/layout/TenantSelector.tsx`)

## Phase 2: Dashboard

- [x] DashboardPage (`pages/DashboardPage.tsx`) — Grundstruktur mit Filterleiste
- [x] StatusBadge Komponente (`components/settlement/StatusBadge.tsx`)
- [x] SettlementCard Komponente (`components/settlement/SettlementCard.tsx`)
- [x] Karten-Grid mit Settlement-Liste und Status-Filter (Alle/Offen/Berechnet/Freigegeben)
- [x] CreateSettlementDialog (`components/settlement/CreateSettlementDialog.tsx`)
- [x] TanStack Query Hook: `useSettlements` (`hooks/useSettlements.ts`)
- [x] TanStack Query Mutation: `useCreateSettlement`

## Phase 3: Settlement-Detail — Konfiguration

- [x] SettlementPage (`pages/SettlementPage.tsx`) — Tab-Navigation Grundstruktur
- [x] StatusStepper Komponente (`components/settlement/StatusStepper.tsx`)
- [x] TanStack Query Hook: `useSettlement` (Einzel-Settlement laden)
- [x] TanStack Query Hook: `useConfig` (`hooks/useSettlements.ts`)
- [x] RatesEditor (`components/config/RatesEditor.tsx`) — editierbare Tabelle mit Add/Remove
- [x] TreeEditor (`components/config/TreeEditor.tsx`) — Formular für Knoten hinzufügen/entfernen
- [x] TreeVisualization (`components/config/TreeVisualization.tsx`) — reactflow Baumdarstellung
- [x] JsonFileImport (`components/common/JsonFileImport.tsx`) — wiederverwendbare Drag&Drop Komponente
- [x] TreeImport (`components/config/TreeImport.tsx`) — JSON-Import für Konfiguration mit Vorschau
- [x] ConfigPanel (`components/config/ConfigPanel.tsx`) — Rates + Tree + Import kombiniert
- [x] TanStack Query Mutation: `useConfigureSettlement`
- [x] Read-only Modus bei Status APPROVED

## Phase 4: Einkäufe

- [x] TanStack Query Hook: `usePurchases` — paginiert (`hooks/usePurchases.ts`)
- [x] PurchaseStats (`components/purchases/PurchaseStats.tsx`) — Anzahl + Gesamtumsatz
- [x] PurchaseTable (`components/purchases/PurchaseTable.tsx`) — paginierte Tabelle
- [x] AddPurchaseForm (`components/purchases/AddPurchaseForm.tsx`) — Käufer-Autocomplete aus Baumknoten
- [x] PurchaseImport (`components/purchases/PurchaseImport.tsx`) — JSON-Import mit Vorschau + Validierung
- [x] TanStack Query Mutation: `useSubmitPurchases`
- [x] Read-only Modus bei Status APPROVED

## Phase 5: Ergebnisse & Berechnung

- [x] ActionBar (`components/settlement/ActionBar.tsx`) — kontextabhängige Buttons (Berechnen/Freigeben/Ablehnen)
- [x] TanStack Query Mutations: `useCalculate`, `useApprove`, `useReject`
- [x] TanStack Query Hook: `useCalculation` (`hooks/useCalculation.ts`)
- [x] TanStack Query Hook: `useRecipientDetail`
- [x] TanStack Query Hook: `useAuditTrail`
- [x] ResultsSummary (`components/results/ResultsSummary.tsx`) — Gesamtprovision, Empfängeranzahl
- [x] RecipientTable (`components/results/RecipientTable.tsx`) — sortierbar nach Name/Provision
- [x] RecipientDetail (`components/results/RecipientDetail.tsx`) — expandierbare Aufschlüsselung
- [x] CommissionTreeView (`components/results/CommissionTreeView.tsx`) — Baum mit Provisionsfluss
- [x] AuditTrail (`components/results/AuditTrail.tsx`) — vollständiges Audit-Log
- [x] Hinweis "Bitte zuerst berechnen" wenn Status < CALCULATED

## Phase 6: Polish & Qualität

- [ ] Error-Handling: API-Fehler als Toast-Benachrichtigungen
- [ ] Loading-States: Skeleton-Loader für alle Daten-Bereiche
- [ ] Success-Toasts nach Aktionen (Erstellen, Speichern, Berechnen, Freigeben)
- [ ] Responsive Design Feinschliff
- [ ] Alle Labels/Buttons auf Deutsch verifizieren
- [ ] Validierung im JSON-Import (Syntax, Pflichtfelder, Duplikate, Buyer im Baum)

## Verifikation

- [ ] `npm run dev` startet ohne Fehler
- [ ] Dashboard: Settlements laden und anzeigen
- [ ] Settlement erstellen: Dialog → Name → erscheint auf Dashboard
- [ ] Konfiguration: Rates + Tree manuell eingeben → Baum-Visualisierung korrekt
- [ ] JSON-Import Baum: Datei hochladen → Vorschau → Übernehmen speichert
- [ ] Einkäufe: Manuell hinzufügen → Tabelle zeigt sie
- [ ] JSON-Import Einkäufe: Datei hochladen → Vorschau → Batch senden
- [ ] Berechnung: "Berechnen" → Ergebnisse angezeigt, Status = CALCULATED
- [ ] Freigabe: "Freigeben" → Status APPROVED, UI read-only
- [ ] Ablehnung: "Ablehnen" → Status zurück auf OPEN
- [ ] Multi-Tenant: Tenant-Wechsel lädt andere Daten
