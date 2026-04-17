import { execSync } from 'child_process'
import { existsSync, mkdirSync, copyFileSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BACKEND_DIR = path.resolve(__dirname, '.backend')
const JAR_PATH = path.join(BACKEND_DIR, 'provisioncalculator.jar')
const BE_REPO = path.resolve(__dirname, '../../provisioncalculator')
const BACKEND_CONFIG = path.join(BACKEND_DIR, 'application.yml')

function writeBackendConfig() {
  const config = `
app:
  jwt:
    secret: e2e-test-jwt-secret-must-be-at-least-32-bytes-long
    expiration-ms: 86400000
    issuer: provisioncalculator
  seed:
    admin:
      enabled: true
      email: admin@e2e.test
      password: Admin1234!
      display-name: E2E Admin
`
  writeFileSync(BACKEND_CONFIG, config.trimStart())
  console.log('[global-setup] Wrote backend config with test admin seed.')
}

function buildFromSource() {
  if (!existsSync(BE_REPO)) {
    throw new Error(`Backend repo not found at ${BE_REPO}. Clone it next to the frontend project.`)
  }

  // Find latest version tag
  const latestTag = execSync('git tag --sort=-v:refname | head -1', {
    cwd: BE_REPO,
    encoding: 'utf-8',
  }).trim()

  if (!latestTag) {
    throw new Error('No tags found in backend repo.')
  }

  console.log(`[global-setup] Checking out backend tag ${latestTag}...`)
  execSync(`git checkout ${latestTag}`, { cwd: BE_REPO, stdio: 'inherit' })

  console.log('[global-setup] Building backend JAR...')
  execSync('gradle bootJar -x test', {
    cwd: BE_REPO,
    stdio: 'inherit',
    timeout: 120_000,
    env: { ...process.env, JAVA_TOOL_OPTIONS: '' },
  })

  // Find the built JAR
  const libsDir = path.join(BE_REPO, 'build/libs')
  const jars = execSync(`ls ${libsDir}/*.jar`, { encoding: 'utf-8' }).trim().split('\n')
  const builtJar = jars[0]

  if (!builtJar || !existsSync(builtJar)) {
    throw new Error('Built JAR not found in build/libs/')
  }

  mkdirSync(BACKEND_DIR, { recursive: true })
  copyFileSync(builtJar, JAR_PATH)
  console.log(`[global-setup] Copied JAR to ${JAR_PATH}`)

  // Return to previous branch
  execSync('git checkout -', { cwd: BE_REPO, stdio: 'inherit' })
}

export default async function globalSetup() {
  mkdirSync(BACKEND_DIR, { recursive: true })
  writeBackendConfig()

  if (existsSync(JAR_PATH)) {
    console.log('[global-setup] Backend JAR already exists, skipping build.')
    return
  }

  buildFromSource()
}
