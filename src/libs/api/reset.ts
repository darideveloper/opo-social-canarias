const PUBLIC_API_BASE = import.meta.env.PUBLIC_API_BASE
const API_URL = `${PUBLIC_API_BASE}/auth/password/reset/`

function getRequestOptions(method: string, body: object) {
  const requestOptions = {
    method: method,
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    redirect: 'follow',
    credentials: 'include',
    body: JSON.stringify(body),
  }
  return requestOptions
}

export async function requestResetPasswordEmail(email: string) {
  const response = await fetch(
    API_URL,
    getRequestOptions('POST', { email: email }) as RequestInit
  )
  const data = await response.json()
  // Always return 200 status
  const statusCode = 200
  return { data, statusCode }
}


export async function updatePassword(token: string, newPassword: string) {
  const response = await fetch(
    API_URL,
    getRequestOptions('PUT', { token: token, new_password: newPassword }) as RequestInit
  )
  const data = await response.json()
  const statusCode = response.status
  return { data, statusCode }
}