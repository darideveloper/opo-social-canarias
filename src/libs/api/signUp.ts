export async function signUp(
  email: string,
  password: string,
  name: string,
  avatar?: File
) {
  // get PUBLIC_API_BASE from .env
  const PUBLIC_API_BASE = import.meta.env.PUBLIC_API_BASE

  const formdata = new FormData()
  formdata.append('email', email)
  formdata.append('password', password)
  formdata.append('name', name)

  if (avatar) {
    formdata.append('avatar', avatar)
  }

  const requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow',
    credentials: 'include',
  }

  const response = await fetch(
    `${PUBLIC_API_BASE}/auth/register/`,
    requestOptions as RequestInit
  )
  const data = await response.json()
  const statusCode = response.status
  return { data, statusCode }
}
