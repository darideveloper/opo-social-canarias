import { fetchJWT } from './base/fetchJWT'

export async function getProfile() {
  const { data, statusCode } = await fetchJWT('/users/me/', 'GET')
  return { data, statusCode }
}

export async function updateProfile(
  name?: string,
  password?: string,
  avatar?: File | null) {
  // Save data as formdata
  const formdata = new FormData();
  if (name) {
    formdata.append("name", name);
  }
  if (avatar) {
    formdata.append("profile_img", avatar);
  }
  if (password) {
    formdata.append("password", password)
  }

  const { data, statusCode } = await fetchJWT('/users/me/', 'PUT', formdata, false)
  return { data, statusCode }
}