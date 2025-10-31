/**
 * Activate Authentication Tests
 *
 * This test suite validates the complete activate authentication flow including:
 * - Success
 * - Invalid token
 * - Expired token
 * - Already used token (disabled)
 *
 * Prerequisites:
 * - Environment variables must be set for test credentials
 * - Backend must be running on localhost:8000
 * - Backend temp token must be set to 2 minutes
 *
 * @fileoverview Comprehensive login authentication test suite
 */

// Libs
import { test, expect, type Page } from '@playwright/test'

// Helpers
import { getTokenFromEmail } from '../helpers/db-helpers'
import { validateMessage, registerUser } from '../helpers/auth-helpers'

// Main settings
const BASE_URL = 'http://localhost:4321'

let currentEmail = ''
let currentPassword = ''

test.describe('Activate Authentication Flow', { tag: ['@auth'] }, () => {
  /**
   * Check if user is active
   * @param page - Playwright page instance
   * @param active - True if user is active, false otherwise
   */
  async function checkIsUserActive(page: Page, active: boolean = true) {
    // Go to login page
    await page.goto(`${BASE_URL}/login`)
    await page.waitForTimeout(2000)

    // Fill credentials
    await page.fill('input[type="email"]', currentEmail)
    await page.fill('input[type="password"]', currentPassword)
    await page.click('button[type="submit"]')

    // Wait after login
    await page.waitForTimeout(2000)

    // Assert: validate login
    if (active) {
      await expect(page.url()).toBe(`${BASE_URL}/dashboard`)
    } else {
      await expect(page.url()).toBe(`${BASE_URL}/login`)
    }
  }

  /**
   * Validate activate account success screen
   * @param page - Playwright page instance
   */
  async function validateActivationSuccessScreen(page: Page) {
    // Assert: validate activate account
    await validateMessage(page, '¡Cuenta activada exitosamente!')
    await expect(page.locator('main h1')).toHaveText('Activación de Cuenta')

    // Validate login button
    const button = page.locator('.card-body a')
    await expect(button).toHaveText('Ir a Login')
    await expect(button).toHaveAttribute('href', `/login`)
  }

  /**
   * Validate activate account error screen
   * @param page - Playwright page instance
   */
  async function validateActivationErrorScreen(page: Page) {
    // Assert: validate activate account
    await validateMessage(page, 'Error al activar la cuenta. Intenta registrarte nuevamente.')
    await expect(page.locator('main h1')).toHaveText('Activación de Cuenta')

    // Validate login button
    const button = page.locator('.card-body a')
    await expect(button).toHaveText('Ir a Registro')
    await expect(button).toHaveAttribute('href', `/sign-up`)
  }

  /**
   * Setup db and register a new user
   * @param page - Playwright page instance
   */
  test.beforeEach(async ({ page }) => {
    // Register a new user
    const { email, name, password } = await registerUser(page)
    currentEmail = email
    currentPassword = password
  })

  /**
   * Validate activate account:
   * - Navigate to activate page
   * - Validate activate account (from db)
   * - Login with credentials
   * - Validate login
   */
  test('success', { tag: ['@positive'] }, async ({ page }) => {
    // Arrange: get token from email
    const token = await getTokenFromEmail(currentEmail)

    // Act: navigate to activate page
    await page.goto(`${BASE_URL}/activate/${token}`)
    await page.waitForTimeout(2000)

    // Assert: validate activate account
    await validateActivationSuccessScreen(page)

    // Assert: validate user is active
    await checkIsUserActive(page, true)
  })

  /**
   * Validate activate account with invalid token
   * - Navigate to activate page with invalid token
   * - Try to Validate activate account
   * - Check error page
   * - Confirm user no activated
   */
  test('invalid token', { tag: ['@negative'] }, async ({ page }) => {
    // Arrange: navigate to activate page with invalid token
    await page.goto(`${BASE_URL}/activate/invalid-token`)
    await page.waitForTimeout(2000)

    // Assert: validate activate account
    await validateActivationErrorScreen(page)

    // Assert: validate user is active
    await checkIsUserActive(page, false)
  })

  /**
   * Validate activate account with expired token
   * - Navigate to activate page with expired token
   * - Try to Validate activate account
   * - Check error page
   * - Confirm user no activated
   */
  test(
    'expired token',
    { tag: ['@negative', '@long-running'] },
    async ({ page }) => {
      // Set custom timeout for this long-running test
      test.setTimeout(4 * 60 * 1000)

      // Arrange: get token from email
      const token = await getTokenFromEmail(currentEmail)

      // Wait 3 minutes
      await page.waitForTimeout(2 * 60 * 1000)

      // Act: navigate to activate page with expired token
      await page.goto(`${BASE_URL}/activate/${token}`)
      await page.waitForTimeout(2000)

      // Assert: validate activate account
      await validateActivationErrorScreen(page)

      // Assert: validate user is active
      await checkIsUserActive(page, false)
    }
  )

  /**
   * Validate activate account with an already used token
   * - Navigate to activate page with an already used token
   * - Try to Validate activate account
   * - Check error page
   * - Confirm user no activated
   */
  test(
    'already used token (disabled)',
    { tag: ['@negative'] },
    async ({ page }) => {
      // Arrange: get token from email
      const token = await getTokenFromEmail(currentEmail)

      // Act: navigate to activate page with an already used token
      await page.goto(`${BASE_URL}/activate/${token}`)
      await page.waitForTimeout(2000)

      // Act: try to activate account again
      await page.goto(`${BASE_URL}/activate/${token}`)
      await page.waitForTimeout(2000)

      // Assert: validate activate account
      await validateActivationErrorScreen(page)
    }
  )
})
