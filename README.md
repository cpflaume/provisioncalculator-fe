# 🖥️ Provision Calculator — Frontend

> A React SPA for managing multi-level commission settlements.  
> Because someone looked at the raw API responses and said "this needs a tree view."

![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)
![Coded on](https://img.shields.io/badge/coded_on-mobile_phone-333?logo=android&logoColor=white)

## 🌐 Live Demo

**→ [provisioncalculator.copf-demo.de](https://provisioncalculator.copf-demo.de)**

> The backend API was perfectly functional and completely unexciting. This frontend exists to fix that.

## ⚙️ What it does

- 🌳 Visualises the customer hierarchy as an interactive tree (the graph kind, not the plant)
- 📊 Displays commission results in charts, because a wall of numbers deserves better
- 🔄 Full settlement lifecycle UI: `create` → `configure` → `import` → `calculate` → `approve`
- 🧪 Covered by Playwright e2e tests, because clicking through manually is a lifestyle choice

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript |
| Bundler | Vite — fast enough to feel suspicious |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Data Fetching | TanStack Query |
| Routing | React Router v7 |
| Charts | Recharts |
| Tree Visualisation | XYFlow |
| E2E Tests | Playwright |

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Set VITE_API_BASE_URL to your backend URL

# Start dev server
npm run dev

# Run e2e tests — optional but appreciated by future you
npm run test:e2e
```

## 🔗 Related

- Backend API: [provisioncalculator](https://github.com/cpflaume/provisioncalculator) — the boring part that makes this part possible

## 📄 License

MIT — see [LICENSE](LICENSE).

---

> **Disclaimer:** This entire codebase was written on a mobile phone using [Claude Code](https://claude.ai/code).  
> No laptops were harmed. Thumbs were fine. It was, objectively, good fun.
