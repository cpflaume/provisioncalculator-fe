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
- [ ] API-Client (`api/client.ts`) — zentraler fetch-Wrapper mit tenantId + baseURL
- [ ] TypeScript-Interfaces für alle API-Responses (`api/types.ts`)
- [ ] API-Funktionen: Settlements (`api/settlements.ts`)
- [ ] API-Funktionen: Purchases (`api/purchases.ts`)
- [ ] API-Funktionen: Calculations (`api/calculations.ts`)
- [ ] Tenant-Context/Hook (`hooks/useTenant.ts`)
- [ ] AppShell Layout (`components/layout/AppShell.tsx`) — Sidebar + Header + Main
- [ ] Sidebar Navigation (`components/layout/Sidebar.tsx`)
- [ ] TenantSelector im Header (`components/layout/TenantSelector.tsx`)

## Phase 2: Dashboard

- [ ] DashboardPage (`pages/DashboardPage.tsx`) — Grundstruktur mit Filterleiste
- [ ] StatusBadge Komponente (`components/settlement/StatusBadge.tsx`)
- [ ] SettlementCard Komponente (`components/settlement/SettlementCard.tsx`)
- [ ] Karten-Grid mit Settlement-Liste und Status-Filter (Alle/Offen/Berechnet/Freigegeben)
- [ ] CreateSettlementDialog (`components/settlement/CreateSettlementDialog.tsx`)
- [ ] TanStack Query Hook: `useSettlements` (`hooks/useSettlements.ts`)
- [ ] TanStack Query Mutation: `useCreateSettlement`

## Phase 3: Settlement-Detail — Konfiguration

- [ ] SettlementPage (`pages/SettlementPage.tsx`) — Tab-Navigation Grundstruktur
- [ ] StatusStepper Komponente (`components/settlement/StatusStepper.tsx`)
- [ ] TanStack Query Hook: `useSettlement` (Einzel-Settlement laden)
- [ ] TanStack Query Hook: `useConfig` (`hooks/useSettlements.ts`)
- [ ] RatesEditor (`components/config/RatesEditor.tsx`) — editierbare Tabelle mit Add/Remove
- [ ] TreeEditor (`components/config/TreeEditor.tsx`) — Formular für Knoten hinzufügen/entfernen
- [ ] TreeVisualization (`components/config/TreeVisualization.tsx`) — reactflow Baumdarstellung
- [ ] JsonFileImport (`components/common/JsonFileImport.tsx`) — wiederverwendbare Drag&Drop Komponente
- [ ] TreeImport (`components/config/TreeImport.tsx`) — JSON-Import für Konfiguration mit Vorschau
- [ ] ConfigPanel (`components/config/ConfigPanel.tsx`) — Rates + Tree + Import kombiniert
- [ ] TanStack Query Mutation: `useConfigureSettlement`
- [ ] Read-only Modus bei Status APPROVED

## Phase 4: Einkäufe

- [ ] TanStack Query Hook: `usePurchases` — paginiert (`hooks/usePurchases.ts`)
- [ ] PurchaseStats (`components/purchases/PurchaseStats.tsx`) — Anzahl + Gesamtumsatz
- [ ] PurchaseTable (`components/purchases/PurchaseTable.tsx`) — paginierte Tabelle
- [ ] AddPurchaseForm (`components/purchases/AddPurchaseForm.tsx`) — Käufer-Autocomplete aus Baumknoten
- [ ] PurchaseImport (`components/purchases/PurchaseImport.tsx`) — JSON-Import mit Vorschau + Validierung
- [ ] TanStack Query Mutation: `useSubmitPurchases`
- [ ] Read-only Modus bei Status APPROVED

## Phase 5: Ergebnisse & Berechnung

- [ ] ActionBar (`components/settlement/ActionBar.tsx`) — kontextabhängige Buttons (Berechnen/Freigeben/Ablehnen)
- [ ] TanStack Query Mutations: `useCalculate`, `useApprove`, `useReject`
- [ ] TanStack Query Hook: `useCalculation` (`hooks/useCalculation.ts`)
- [ ] TanStack Query Hook: `useRecipientDetail`
- [ ] TanStack Query Hook: `useAuditTrail`
- [ ] ResultsSummary (`components/results/ResultsSummary.tsx`) — Gesamtprovision, Empfängeranzahl
- [ ] RecipientTable (`components/results/RecipientTable.tsx`) — sortierbar nach Name/Provision
- [ ] RecipientDetail (`components/results/RecipientDetail.tsx`) — expandierbare Aufschlüsselung
- [ ] CommissionTreeView (`components/results/CommissionTreeView.tsx`) — Baum mit Provisionsfluss
- [ ] AuditTrail (`components/results/AuditTrail.tsx`) — vollständiges Audit-Log
- [ ] Hinweis "Bitte zuerst berechnen" wenn Status < CALCULATED

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
