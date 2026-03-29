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

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText)
    throw new ApiError(response.status, message)
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
