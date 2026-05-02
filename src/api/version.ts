import { rawGet } from "./client"

export interface VersionResponse {
  version: string
}

export function fetchBackendVersion(): Promise<VersionResponse> {
  return rawGet<VersionResponse>("/api/version")
}
