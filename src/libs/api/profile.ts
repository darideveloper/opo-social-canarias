import { fetchJWT } from './base/fetchJWT'

export async function getProfile() {
  const { data, statusCode } = await fetchJWT('/users/me/', 'GET')
  return { data, statusCode }
}
