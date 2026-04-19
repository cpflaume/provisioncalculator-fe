# Provision Calculator — Frontend

A React single-page application for managing multi-level commission (provision) settlements. Visualises the customer hierarchy tree, imports purchases, and displays calculated commission results.

## Live Demo

Check it out at **https://provisioncalculator.copf-demo.de**

> The initial API product was a little boring on its own, so this frontend was added on top — tree visualisation, charts, settlement lifecycle management and all.

## What it does

- Create and configure settlements with a customer hierarchy tree
- Set commission rates per tree depth
- Import purchases and trigger commission calculation
- Visualise results with charts and a tree view
- Manage the full settlement lifecycle through to approval

## Tech stack

- **React 19** + **TypeScript**
- **Vite** for bundling
- **Tailwind CSS v4** + **shadcn/ui** components
- **TanStack Query** for data fetching
- **React Router v7**
- **Recharts** for charts, **XYFlow** for tree visualisation
- **Playwright** for end-to-end tests

## Getting started

```bash
# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Set VITE_API_BASE_URL to your backend URL

# Start dev server
npm run dev

# Run e2e tests
npm run test:e2e
```

## Related

- Backend API: [provisioncalculator](https://github.com/cpflaume/provisioncalculator)

## License

MIT — see [LICENSE](LICENSE)

---

> Disclaimer: This entire project was coded from a mobile phone using [Claude Code](https://claude.ai/code). It was good fun.
