const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

/**
 * Maps known BE error messages to German user-facing messages.
 * Falls back to the original message if no mapping is found.
 */
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

  // Generic
  "Data integrity violation — duplicate or invalid reference": "Datenintegritätsfehler — doppelter Eintrag oder ungültige Referenz.",
  "Malformed request body": "Ungültiger Request-Body.",
  "Internal server error": "Ein interner Serverfehler ist aufgetreten.",
  "Unexpected error": "Ein unerwarteter Fehler ist aufgetreten.",
}

function translateError(message: string): string {
  // Exact match
  if (errorMessages[message]) return errorMessages[message]

  // Prefix match for messages with dynamic suffixes (e.g., "Settlement must be CALCULATED to approve, current: OPEN")
  for (const [key, translation] of Object.entries(errorMessages)) {
    if (message.startsWith(key)) return translation
  }

  // Match "Tree must have exactly one root node, found X"
  if (message.startsWith("Tree must have exactly one root node")) {
    return "Der Baum darf nur genau einen Wurzelknoten haben."
  }

  // Match "Settlement X not found"
  if (/^Settlement \d+ not found$/.test(message)) {
    return "Abrechnung nicht gefunden."
  }

  // Match orphaned node errors: "Node 'X' references unknown parent 'Y'"
  if (message.includes("references unknown parent")) {
    return "Ein Knoten verweist auf einen unbekannten Elternknoten."
  }

  return message
}

interface ErrorResponseBody {
  status: number
  message: string
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const contentType = response.headers.get("content-type")
    if (contentType?.includes("application/json")) {
      try {
        const body: ErrorResponseBody = await response.json()
        throw new ApiError(response.status, translateError(body.message))
      } catch (e) {
        if (e instanceof ApiError) throw e
      }
    }
    const message = await response.text().catch(() => response.statusText)
    throw new ApiError(response.status, translateError(message))
  }
  if (response.status === 204) return undefined as T
  const contentType = response.headers.get("content-type")
  if (contentType?.includes("application/json")) {
    return response.json()
  }
  return undefined as T
}

function buildUrl(tenantId: string, path: string): string {
  return `${BASE_URL}/api/v1/tenants/${encodeURIComponent(tenantId)}${path}`
}

export function apiGet<T>(tenantId: string, path: string): Promise<T> {
  return fetch(buildUrl(tenantId, path)).then(handleResponse<T>)
}

export function apiPost<T>(tenantId: string, path: string, body?: unknown): Promise<T> {
  return fetch(buildUrl(tenantId, path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : "{}",
  }).then(handleResponse<T>)
}

export function apiPut<T>(tenantId: string, path: string, body: unknown): Promise<T> {
  return fetch(buildUrl(tenantId, path), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(handleResponse<T>)
}
