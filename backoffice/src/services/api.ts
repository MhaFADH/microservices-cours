const BASE_URLS = {
  identity: "http://localhost:8081",
  matchmaking: "http://localhost:8082",
  economy: "http://localhost:8083",
}

export type Service = "identity" | "matchmaking" | "economy"

export const apiRequest = async (
  service: Service,
  endpoint: string,
  method: string = "GET",
  body?: string,
  headers?: Record<string, string>
) => {
  const url = `${BASE_URLS[service]}${endpoint}`
  const token = localStorage.getItem("token")

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  }

  if (token && !requestHeaders.Authorization) {
    requestHeaders.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body || undefined,
  })

  const text = await response.text()
  let data
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = text
  }

  return {
    status: response.status,
    statusText: response.statusText,
    data,
    headers: Object.fromEntries(response.headers.entries()),
  }
}
