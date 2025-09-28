import { query } from '../utils/db'

// Clean up test data
export async function cleanupTestData() {
  try {
    await query('DELETE FROM auth_user WHERE email LIKE $1', ['test-'])
    console.log('🧹 Test data cleaned up')
  } catch (error) {
    console.error('Error cleaning up test data:', error)
  }
}

// Get user by email
export async function getUserByEmail(email: string) {
  try {
    const result = await query('SELECT * FROM auth_user WHERE email = $1', [
      email,
    ])
    return result.rows[0] || null
  } catch (error) {
    console.error('Error getting user:', error)
    throw error
  }
}

export async function getProfileByUserId(userId: string) {
  try {
    const result = await query(
      'SELECT * FROM jwt_auth_profile WHERE user_id = $1',
      [userId]
    )
    return result.rows[0] || null
  } catch (error) {
    console.error('Error getting profile:', error)
    throw error
  }
}

// Create test user
export async function createTestUser(
  email: string,
  password: string,
  name: string
) {
  try {
    const result = await query(
      'INSERT INTO auth_user (email, password, name, is_active) VALUES ($1, $2, $3, $4) RETURNING id',
      [email, password, name, false]
    )
    return result.rows[0].id
  } catch (error) {
    console.error('Error creating test user:', error)
    throw error
  }
}

// Activate user
export async function activateUser(email: string) {
  try {
    await query('UPDATE auth_user SET is_active = true WHERE email = $1', [
      email,
    ])
    console.log(`✅ User ${email} activated`)
  } catch (error) {
    console.error('Error activating user:', error)
    throw error
  }
}

// Delete user by email
export async function deleteUserByEmail(email: string) {
  try {
    await query('DELETE FROM auth_user WHERE email = $1', [email])
    console.log(`🗑️ User ${email} deleted`)
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}

export async function getTokenFromEmail(
  email: string,
  type: string = 'sign_up',
  isActive: boolean = true,
  raiseError: boolean = true
) {
  
  try {
    const user = await getUserByEmail(email)
    console.log('🔑 User:', user)
    const profile = await getProfileByUserId(user.id)
    console.log('🔑 Profile:', profile)
    const result = await query(
      'SELECT token FROM jwt_auth_temptoken WHERE profile_id = $1 AND type = $2 and is_active = $3',
      [profile.id, type, isActive]
    )
    return result?.rows[0]?.token || null
  } catch (error) {
    console.error('Error getting token from email:', error)
    if (raiseError) {
      throw error
    }
    return null
  }
}
