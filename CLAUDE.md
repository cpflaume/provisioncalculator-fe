# CLAUDE.md — Development Guidelines

## Verification Before Pushing

Always run this chain locally before every push. Fix all failures before committing.

```bash
# 1. Type-check and build
npm run build

# 2. Lint
npm run lint

# 3. E2E tests (requires the backend running on http://localhost:8080)
npm run test:e2e
```

Do not push if any step fails.

## Commit and Push Policy

- Commit after every logical unit of work — do not accumulate unrelated changes in one commit.
- Push to the feature branch immediately after committing.
- Use the branch specified in the task or session. Never push to `main` directly.
- Commit message format: `type: short description` (e.g. `feat: add provision filter`, `fix: correct rounding error`).

## Autonomous Operation (Token Efficiency)

Operate autonomously. The following do **not** require user confirmation:

- Running tests, lint, or the build.
- Committing and pushing to the designated feature branch.
- Reading any file in the repository.
- Installing dependencies listed in `package.json`.

Only pause and ask when:
- The task description is genuinely ambiguous.
- A destructive or irreversible action is required (force-push, delete branch, drop data).
- A decision has significant architectural impact not covered by the existing codebase patterns.

## Code Style

- Match existing patterns. Do not introduce new abstractions or libraries without being asked.
- No comments unless the reason is non-obvious.
- No plan files, progress docs, or TODO markdown files — use the conversation instead.
- Prefer editing existing files over creating new ones.

## Stack Reference

| Concern | Tool |
|---|---|
| Framework | React 19 + TypeScript + Vite |
| Styling | TailwindCSS v4 |
| Data fetching | TanStack Query v5 |
| Routing | React Router v7 |
| Charts | Recharts |
| Flow diagrams | XYFlow / React Flow |
| E2E tests | Playwright |
| Linting | ESLint (flat config) |

Backend API runs on `http://localhost:8080` in local development (see `.env.example`).
