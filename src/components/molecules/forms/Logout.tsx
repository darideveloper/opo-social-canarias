// libs
import { logout } from '../../../libs/api/logout'

// Hooks
import { useEffect } from 'react'

export default function Logout() {
  // Logout when component mounts
  useEffect(() => {
    async function logoutUser() {
      await logout()
      // Redirect to login page
      window.location.href = '/login'
    }
    logoutUser()
  }, [])

  // Full screen daisy loading spinner
  return (
    <div className='flex items-center justify-center h-screen'>
      <span className='loading loading-dots loading-lg'></span>
    </div>
  )
}
