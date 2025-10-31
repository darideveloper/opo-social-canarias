export async function fetchJWT(
  endpoint: string,
  method: string,
  body: any = null,
  isJson: boolean = true,
  redirect: string = 'follow',
  credentials: string = 'include',
) {

  // get backend api base from .env
  const PUBLIC_API_BASE = import.meta.env.PUBLIC_API_BASE

  const parseJsonSafely = async (res: Response) => {
    try {
      return await res.json()
    } catch (_e) {
      return null
    }
  }

  // Optional json header
  const headers = new Headers()
  if (isJson) {
    headers.append('Content-Type', 'application/json')
  }

  const requestOptions = {
    method: method,
    headers: headers,
    body: body,
    redirect: redirect,
    credentials: credentials,
  }

  const url = `/api${endpoint}`

  // Perform the initial request
  const initialResponse = await fetch(url, requestOptions as RequestInit)

  // If unauthorized, attempt a single refresh and retry
  if (initialResponse.status === 401) {
    const refreshResponse = await fetch(
      `${PUBLIC_API_BASE}/auth/token/refresh/`,
      {
        method: 'POST',
        headers: headers,
        redirect: redirect,
        credentials: credentials,
      } as RequestInit
    )

    if (refreshResponse.ok) {
      const retryResponse = await fetch(url, requestOptions as RequestInit)
      const retryData = await parseJsonSafely(retryResponse)
      const retryStatusCode = retryResponse.status
      return { data: retryData, statusCode: retryStatusCode }
    }

    // Refresh failed; return the original unauthorized response
    const data = await parseJsonSafely(initialResponse)
    const statusCode = initialResponse.status
    return { data, statusCode }
  }

  // Normal flow for non-401 responses
  const data = await parseJsonSafely(initialResponse)
  const statusCode = initialResponse.status
  return { data, statusCode }
}
