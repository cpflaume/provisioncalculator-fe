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
