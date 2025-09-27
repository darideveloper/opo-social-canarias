/**
 * Activate Authentication Tests
 *
 * This test suite validates the complete activate authentication flow including:
 * - test 1
 *
 * Prerequisites:
 * - Environment variables must be set for test credentials
 * - Backend must be running on localhost:8000
 * - Backend access token must be set to 1 minutes
 * - Backend refresh token must be set to 3 minutes
 *
 * @fileoverview Comprehensive login authentication test suite
 */

import { test, expect, type Page } from '@playwright/test'
import { testConnection, closeConnection } from '../utils/db'
import { cleanupTestData, getTokenFromEmail } from '../helpers/db-helpers'

// Main settings
const BASE_URL = 'http://localhost:4321'

let currentEmail = ''
let currentPassword = ''

test.describe(
  'Activate Authentication Flow',
  { tag: ['@auth', '@smoke'] },
  () => {
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
      await page.goto(`${BASE_URL}/register`)
      await page.waitForTimeout(2000)

      // Fill data
      await page.fill('input#name', name)
      await page.fill('input#email', email)
      await page.fill('input#password', password)
      await page.fill('input#confirmPassword', password)

      // Submit form
      await page.click('button[type="submit"]')
      await page.waitForTimeout(3000)
    }

    /**
     * Setup db and register a new user
     */
    test.beforeEach(async ({ page }) => {
      // Connect to db
      await testConnection()
      await cleanupTestData()

      // Register a new user
      await registerUser(page)
    })

    // Add this afterAll hook
    test.afterAll(async () => {
      await closeConnection()
    })

    /**
     * Validate activate account
     */
    test('validate activate account', { tag: ['@positive'] }, async ({ page }) => {
      // Arrange: get token from email
      const token = await getTokenFromEmail(currentEmail)

      // Act: navigate to activate page
      await page.goto(`${BASE_URL}/activate/${token}`)
      await page.waitForTimeout(2000)

      // Assert: validate activate account
      await expect(page.locator('h1.text-2xl')).toHaveText('Activación de Cuenta')
      await expect(page.locator('h1 + p')).toHaveText(
        'Tu cuenta ha sido activada exitosamente.'
      )
      await expect(page.locator('button.bg-primary')).toHaveText('Ir al Login')
      await page.click('button')
      await page.waitForTimeout(2000)

      // Validate login with credentials
      await expect(page.url()).toBe(`${BASE_URL}/login`)

      await page.fill('input[type="email"]', currentEmail)
      await page.fill('input[type="password"]', currentPassword)
      await page.click('button[type="submit"]')
      await page.waitForTimeout(2000)

      // Assert: validate login
      await expect(page.url()).toBe(`${BASE_URL}/`)
      await expect(page.locator('h1.text-3xl')).toHaveText('Welcome to OpoSocial')
    })
  }
)
