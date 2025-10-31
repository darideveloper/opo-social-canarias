export async function logout() {
    // get PUBLIC_API_BASE from .env
    const PUBLIC_API_BASE = import.meta.env.PUBLIC_API_BASE
  
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')
  
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
      credentials: 'include',
    }
  
    const response = await fetch(`${PUBLIC_API_BASE}/auth/logout/`, requestOptions as RequestInit)
    const data = await response.json()
    const statusCode = response.status
    return { data, statusCode }
  }
  