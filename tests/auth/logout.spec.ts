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

import { test, expect, type Page } from '@playwright/test'
import { getTokenFromEmail } from '../helpers/db-helpers'

// Main settings
const BASE_URL = 'http://localhost:4321'

let currentEmail = ''
let currentPassword = ''

test.describe('Logout Authentication Flow', { tag: ['@auth'] }, () => {
  /**
   * Get random data
   * @returns {Promise<{name: string, email: string, password: string}>}
   */
  async function getRandomData(): Promise<{
    name: string
    email: string
    password: string
  }> {
    // Create random string of 6 chars (only letters and numbers)
    const randomString = Math.random().toString(36).substring(2, 8)

    const name = `test-${randomString}`
    const email = `test-${randomString}@gmail.com`
    const password = `test-${randomString}`
    return { name, email, password }
  }

  /**
   * Register a new user
   * @param page - Playwright page instance
   */
  async function registerUser(page: Page) {
    // Arrange: use random email and password
    const { email, name, password } = await getRandomData()
    currentEmail = email
    currentPassword = password

    // Navigate to login page and wait for it to fully load
    await page.goto(`${BASE_URL}/sign-up`)
    await page.waitForTimeout(2000)

    // Fill data
    await page.fill('input#name', name)
    await page.fill('input#email', email)
    await page.fill('input#password', password)
    await page.fill('input#passwordValidation', password)

    // Submit form
    await page.click('button[type="submit"]')
    await page.waitForTimeout(3000)
  }

  /**
   * Activate user
   * @param page - Playwright page instance
   */
  async function activateUser(page: Page) {
    // Arrange: get token from email
    const token = await getTokenFromEmail(currentEmail)

    // Act: navigate to activate page
    await page.goto(`${BASE_URL}/activate/${token}`)
    await page.waitForTimeout(2000)
  }

  /**
   * Login with user credentials
   * @param page - Playwright page instance
   * @param email - User email
   * @param password - User password
   */
  async function login(page: Page, email: string, password: string) {
    // Act: Open login page
    await page.goto(`${BASE_URL}/login`)
    await page.waitForTimeout(2000)

    // Act: Submit login form
    await page.fill('input[type="email"]', email)
    await page.fill('input[type="password"]', password)
    await page.click('button[type="submit"]')

    // Assert: redirect to home page
    await expect(page).toHaveURL(`${BASE_URL}/dashboard`)
  }

  /**
   * Setup db and register a new user
   * @param page - Playwright page instance
   */
  test.beforeEach(async ({ page }) => {
    // Register a new user
    await registerUser(page)

    // Activate user
    await activateUser(page)

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
