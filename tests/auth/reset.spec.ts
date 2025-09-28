/**
 * Reset Password Authentication Tests
 *
 * This test suite validates the complete reset password authentication flow including:
 * - test 1
 *
 * Prerequisites:
 * - Environment variables must be set for test credentials
 * - Backend must be running on localhost:8000
 * - Backend temp token must be set to 2 minutes
 *
 * @fileoverview Comprehensive login authentication test suite
 */

import { test, expect, type Page } from '@playwright/test'
import { cleanupTestData, getTokenFromEmail } from '../helpers/db-helpers'

// Main settings
const BASE_URL = 'http://localhost:4321'

let currentEmail = ''
let currentPassword = ''

test.describe(
  'Reset Password Authentication Flow',
  { tag: ['@auth'] },
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
     * Validate toast message
     * @param page - Playwright page instance
     * @param message - Message to validate
     */
    async function validateMessage(page: Page, message: string, waitTime: number = 2000) {
      // Wait for redirect to complete
      await page.waitForTimeout(waitTime)

      // verify message
      await expect(page.locator('[role="status"]')).toHaveText(message)
    }

    /**
     * Submit email form  
     * @param page - Playwright page instance
     * @param email - User email
     */
    async function submitEmailForm(page: Page, email: string) {
      // Act: request valid email
      await page.fill('input#email', email)
      await page.click('button[type="submit"]')
    }

    /**
     * Validate token not generated in db
     * @param email - User email
     */
    async function validateTokenNotGenerated(email: string) {
      const token = await getTokenFromEmail(email, 'pass', true, false)
      expect(token).toBeNull()
    }

    /**
     * Setup db and register a new user
     * @param page - Playwright page instance
     */
    test.beforeEach(async ({ page }) => {
      // Clean up test data before each test
      await cleanupTestData()

      // Register a new user
      await registerUser(page)

      // Activate user
      await activateUser(page)
    })

    test(
      'post - request valid email',
      { tag: ['@positive'] },
      async ({ page }) => {
        // Arrange: request valid email
        await page.goto(`${BASE_URL}/reset-password`)
        await page.waitForTimeout(2000)

        // Act: Submit email form
        await submitEmailForm(page, currentEmail)

        // Assert: toast message
        await validateMessage(
          page,
          'Si el email existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.'
        )

        // Assert: token generated in db
        const token = await getTokenFromEmail(currentEmail, 'pass')
        expect(token).not.toBeNull()
      }
    )

    test(
      'post - request invalid email',
      { tag: ['@positive'] },
      async ({ page }) => {
        // Arrange: request valid email
        await page.goto(`${BASE_URL}/reset-password`)
        await page.waitForTimeout(2000)

        // Act: request valid email
        await submitEmailForm(page, 'invalid-no-registered@email.com')

        // Assert: toast message
        await validateMessage(
          page,
          'Si el email existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.'
        )

        // Assert: token not generated in db
        await validateTokenNotGenerated(currentEmail)
      }
    )

    test(
      "post - invalid email format",
      { tag: ['@positive'] },
      async ({ page }) => {
        // Arrange: request valid email
        await page.goto(`${BASE_URL}/reset-password`)
        await page.waitForTimeout(2000)

        // Act: request valid email
        const email = 'a@a'
        await submitEmailForm(page, email)

        // Assert: toast message
        await validateMessage(page, 'Por favor ingresa un email válido', 0)

        // Assert: token not generated in db
        await validateTokenNotGenerated(currentEmail)
        await validateTokenNotGenerated(email)
      }
    )

    test(
      "post - missing fields",
      { tag: ['@positive'] },
      async ({ page }) => {
        // Arrange: request valid email
        await page.goto(`${BASE_URL}/reset-password`)
        await page.waitForTimeout(2000)

        // Act: request valid email
        await submitEmailForm(page, '')

        // Assert: no alert because no email was filled
        await expect(page.locator('[role="alert"]')).not.toBeVisible()

        // Assert: token not generated in db
        await validateTokenNotGenerated(currentEmail)
        await validateTokenNotGenerated('')
      }
    )
  }
)
