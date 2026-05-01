# CLAUDE.md — Development Guidelines

## Verification Before Pushing

Always run this chain locally before every push. Fix all failures before committing.

```bash
# 1. Type-check and build
npm run build

# 2. Lint
npm run lint

# 3. E2E tests (see section below for setup)
npm run test:e2e
```

Do not push if any step fails.

## Running E2E Tests

Playwright starts both the frontend dev server and a local backend JAR automatically.
Two things must be in place before `npm run test:e2e` will work.

### 1. Backend JAR

Build the JAR from the `provisioncalculator` backend repo (skip tests for speed):

```bash
# From the provisioncalculator repo root — use system gradle if ./gradlew is missing its wrapper jar
gradle bootJar -x test
```

Copy the result into the expected location:

```bash
mkdir -p e2e/.backend
cp ../provisioncalculator/build/libs/provisioncalculator-0.0.1-SNAPSHOT.jar e2e/.backend/provisioncalculator.jar
```

`e2e/.backend/application-test.yml` is already committed and configures the JAR to use
an in-memory H2 database — no external Postgres needed.

### 2. Playwright Chromium browser

The pre-installed browser lives at `/opt/pw-browsers/chromium_headless_shell-1194`.
If `npm run test:e2e` fails with "Executable doesn't exist" and mentions a higher revision
number (e.g. `1217`), create a symlink:

```bash
# Replace 1217 with the revision Playwright actually asks for
mkdir -p /opt/pw-browsers/chromium_headless_shell-1217/chrome-headless-shell-linux64
ln -sf /opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell \
       /opt/pw-browsers/chromium_headless_shell-1217/chrome-headless-shell-linux64/chrome-headless-shell
```

If the pre-installed revision itself has changed, check `ls /opt/pw-browsers/` and adjust
the source path accordingly.

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
