/**
 * Logout Authentication Tests
 *
 * This test suite validates the complete logout authentication flow including:
 * - logged - redirect to login page
 * - logged - delete cookies
 * - not logged - redirect to login page
 *
 * Prerequisites:
 * - Environment variables must be set for test credentials
 * - Backend must be running on localhost:8000
 *
 * @fileoverview Comprehensive logout authentication test suite
 */

// Libs
import { test, expect } from '@playwright/test'

// Helpers
import { registerUser, activateUser, login } from '../helpers/auth-helpers'

// Main settings
const BASE_URL = 'http://localhost:4321'

let currentEmail = ''
let currentPassword = ''

test.describe('Logout Authentication Flow', { tag: ['@auth'] }, () => {
  /**
   * Setup db and register a new user
   * @param page - Playwright page instance
   */
  test.beforeEach(async ({ page }) => {
    // Register a new user
    const { email, name, password } = await registerUser(page)
    currentEmail = email
    currentPassword = password

    // Activate user
    await activateUser(page, currentEmail)

    // Login with user credentials
    await login(page, currentEmail, currentPassword)
  })

  /**
   * logged - redirect to login page
   * - Logout
   * - Validate redirect to login page
   */
  test(
    'logged - redirect to login page',
    { tag: ['@positive'] },
    async ({ page }) => {
      // Act: Logout
      await page.goto(`${BASE_URL}/logout`)
      await page.waitForTimeout(2000)

      // Assert: redirect to login page
      await expect(page).toHaveURL(`${BASE_URL}/login`)
    }
  )

  /**
   * logged - redirect to login page
   * - Delete cookies
   * - Validate cookies are deleted
   */
  test(
    'logged - delete cookies',
    { tag: ['@positive'] },
    async ({ page }) => {
      // Act: Logout
      await page.goto(`${BASE_URL}/logout`)
      await page.waitForTimeout(2000)

      // Assert: cookies are deleted
      const cookies = await page.context().cookies()
      expect(cookies).toHaveLength(0)
    }
  )

  /**
   * not logged - redirect to login page
   * - Logout
   * - Validate redirect to login page
   */
  test(
    'not logged - redirect to login page',
    { tag: ['@positive'] },
    async ({ page }) => {
      // Act: initial logout
      await page.goto(`${BASE_URL}/logout`)
      await page.waitForTimeout(2000)

      // Act: second Logout
      await page.goto(`${BASE_URL}/logout`)
      await page.waitForTimeout(2000)

      // Assert: redirect to login page
      await expect(page).toHaveURL(`${BASE_URL}/login`)
    }
  )
})
