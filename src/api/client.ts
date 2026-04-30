const BASE_URL = import.meta.env.VITE_API_BASE_URL || ""

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

const errorMessages: Record<string, string> = {
  // State transitions (409 Conflict)
  "Settlement must be CALCULATED to approve": "Die Abrechnung muss zuerst berechnet werden, bevor sie freigegeben werden kann.",
  "Settlement must be CALCULATED to reject": "Die Abrechnung muss zuerst berechnet werden, bevor sie abgelehnt werden kann.",
  "Settlement is APPROVED and cannot be modified": "Die Abrechnung ist bereits freigegeben und kann nicht mehr geändert werden.",

  // Calculation prerequisites (400)
  "No commission settings configured": "Bitte zuerst Provisionsregeln und Baumstruktur konfigurieren.",
  "No purchases to calculate": "Bitte zuerst Einkäufe hinzufügen, bevor die Berechnung gestartet wird.",
  "Purchases list cannot be empty": "Die Einkaufsliste darf nicht leer sein.",

  // Tree validation (400)
  "Tree must contain at least one node": "Der Baum muss mindestens einen Knoten enthalten.",
  "Duplicate customer IDs in tree": "Der Baum enthält doppelte Kunden-IDs.",
  "Tree must have at least one root node": "Der Baum muss mindestens einen Wurzelknoten haben.",
  "Tree contains a cycle": "Der Baum enthält einen Zyklus.",
  "Unable to resolve tree node order": "Die Baumstruktur konnte nicht aufgelöst werden.",

  // Not found (404)
  "No calculation found": "Keine Berechnung gefunden.",

  // Auth
  "Email already registered": "Diese E-Mail-Adresse ist bereits registriert.",
  "Invalid credentials": "Ungültige Anmeldedaten.",

  // Generic
  "Data integrity violation — duplicate or invalid reference": "Datenintegritätsfehler — doppelter Eintrag oder ungültige Referenz.",
  "Malformed request body": "Ungültiger Request-Body.",
  "Internal server error": "Ein interner Serverfehler ist aufgetreten.",
  "Unexpected error": "Ein unerwarteter Fehler ist aufgetreten.",
}

const FALLBACK_ERROR_MESSAGE = "Ein unerwarteter Fehler ist aufgetreten."

function translateError(message: string | undefined | null): string {
  if (!message) return FALLBACK_ERROR_MESSAGE
  if (errorMessages[message]) return errorMessages[message]

  for (const [key, translation] of Object.entries(errorMessages)) {
    if (message.startsWith(key)) return translation
  }

  if (message.startsWith("Tree must have exactly one root node")) {
    return "Der Baum darf nur genau einen Wurzelknoten haben."
  }

  if (/^Settlement \d+ not found$/.test(message)) {
    return "Abrechnung nicht gefunden."
  }

  if (message.includes("references unknown parent")) {
    return "Ein Knoten verweist auf einen unbekannten Elternknoten."
  }

  return message
}

interface ErrorResponseBody {
  status?: number
  message?: string
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 401) {
      window.dispatchEvent(new Event("auth-expired"))
    }
    const text = await response.text().catch(() => response.statusText)
    const contentType = response.headers.get("content-type")
    if (contentType?.includes("application/json")) {
      try {
        const body = JSON.parse(text) as ErrorResponseBody
        throw new ApiError(response.status, translateError(body.message))
      } catch (e) {
        if (e instanceof ApiError) throw e
        // JSON.parse failed — fall through to use the raw text
      }
    }
    throw new ApiError(response.status, translateError(text))
  }
  if (response.status === 204) return undefined as T
  const contentType = response.headers.get("content-type")
  if (contentType?.includes("application/json")) {
    return response.json()
  }
  return undefined as T
}

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem("auth_token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function buildUrl(tenantId: string, path: string): string {
  return `${BASE_URL}/api/v1/tenants/${encodeURIComponent(tenantId)}${path}`
}

export function apiGet<T>(tenantId: string, path: string): Promise<T> {
  return fetch(buildUrl(tenantId, path), {
    headers: getAuthHeader(),
  }).then(handleResponse<T>)
}

export function apiPost<T>(tenantId: string, path: string, body?: unknown): Promise<T> {
  return fetch(buildUrl(tenantId, path), {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: body !== undefined ? JSON.stringify(body) : "{}",
  }).then(handleResponse<T>)
}

export function apiPut<T>(tenantId: string, path: string, body: unknown): Promise<T> {
  return fetch(buildUrl(tenantId, path), {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(body),
  }).then(handleResponse<T>)
}

export function apiDelete<T>(tenantId: string, path: string): Promise<T> {
  return fetch(buildUrl(tenantId, path), {
    method: "DELETE",
    headers: getAuthHeader(),
  }).then(handleResponse<T>)
}

export function rawGet<T>(path: string): Promise<T> {
  return fetch(`${BASE_URL}${path}`, {
    headers: getAuthHeader(),
  }).then(handleResponse<T>)
}

export function rawPost<T>(path: string, body?: unknown): Promise<T> {
  return fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: body !== undefined ? JSON.stringify(body) : "{}",
  }).then(handleResponse<T>)
}

export function rawDelete<T>(path: string): Promise<T> {
  return fetch(`${BASE_URL}${path}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  }).then(handleResponse<T>)
}
