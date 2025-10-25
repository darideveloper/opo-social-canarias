export async function login(username: string, password: string) {
  // get PUBLIC_API_BASE from .env
  const PUBLIC_API_BASE = import.meta.env.PUBLIC_API_BASE

  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  const raw = JSON.stringify({
    username: username,
    password: password,
  })

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
    credentials: 'include',
  }

  const response = await fetch(`${PUBLIC_API_BASE}/auth/token/`, requestOptions as RequestInit)
  const data = await response.json()
  const statusCode = response.status
  return { data, statusCode }
}
