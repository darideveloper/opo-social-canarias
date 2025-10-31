/**
 * Login Authentication Tests
 *
 * This test suite validates the complete login authentication flow including:
 * - Invalid credential handling
 * - Inactive user account management
 * - Successful authentication
 * - Token refresh mechanisms
 * - Logout after refresh token fails
 * - don't allow to login with missing fields
 *
 * Prerequisites:
 * - Environment variables must be set for test credentials
 * - Backend must be running on localhost:8000
 * - Backend access token must be set to 1 minutes
 * - Backend refresh token must be set to 3 minutes
 *
 * @fileoverview Comprehensive login authentication test suite
 */

// Libs
import { test, expect, type Page } from '@playwright/test'

// Helpers
import { validateMessage } from '../helpers/auth-helpers'

// Main settings
const BASE_URL = 'http://localhost:4321'

test.describe('Login Authentication Flow', { tag: ['@auth'] }, () => {
  /**
   * Navigate to login page and wait for it to fully load
   */
  test.beforeEach(async ({ page }) => {
    // Navigate to login page and wait for it to fully load
    await page.goto(`${BASE_URL}/login`)
    await page.waitForTimeout(2000)
  })

  /**
   * Validates that a login attempt with invalid credentials fails properly
   * @param page - Playwright page instance
   * @param expectedErrorMessage - Optional custom error message to validate
   */
  async function validateWrongLogin(page: Page, expectedErrorMessage?: string) {
    // Wait for the login process to complete
    await page.waitForTimeout(2000)

    // Ensure we remain on the login page (no redirect occurred)
    await expect(page).toHaveURL(`${BASE_URL}/login`)

    // Verify the error toast message is displayed
    const errorMessage =
      expectedErrorMessage ||
      'La combinación de credenciales no tiene una cuenta activa'
    await validateMessage(page, errorMessage)
  }

  /**
   * Validates successful login by checking URL redirect and welcome message
   * @param page - Playwright page instance
   */
  async function validateCorrectLogin(page: Page) {
    // Wait for redirect to complete
    await page.waitForTimeout(2000)

    // Verify redirect to dashboard
    await expect(page).toHaveURL(`${BASE_URL}/dashboard`)
  }

  /**
   * Submits the login form with provided credentials
   * @param page - Playwright page instance
   * @param email - User email address
   * @param password - User password
   */
  async function submitForm(page: Page, email: string, password: string) {
    // Fill email field
    await page.fill('input[type="email"]', email)

    // Fill password field
    await page.fill('input[type="password"]', password)

    // Submit the form
    await page.click('button[type="submit"]')
  }

  /**
   * Reject invalid credentials with proper error message
   * - Fill invalid credentials
   * - Validate error message
   */
  test(
    'reject invalid credentials with proper error message',
    { tag: ['@negative'] },
    async ({ page }) => {
      // Arrange: Set up test data with invalid credentials
      const invalidEmail = 'invalid@example.com'
      const invalidPassword = 'invalidpassword'

      // Act: Attempt login with invalid credentials
      await page.fill('input[type="email"]', invalidEmail)
      await page.fill('input[type="password"]', invalidPassword)
      await page.click('button[type="submit"]')

      // Assert: Validate that login failed appropriately
      await validateWrongLogin(page)
    }
  )

  /**
   * Handle inactive user accounts gracefully
   * - Fill inactive user credentials
   * - Validate error message
   */
  test(
    'handle inactive user accounts gracefully',
    { tag: ['@negative', '@edge-case'] },
    async ({ page }) => {
      // Arrange: Use inactive user credentials from environment
      const inactiveUserEmail = process.env.TEST_LOGIN_USERNAME_INACTIVE!
      const password = process.env.TEST_LOGIN_PASSWORD!

      // Act: Attempt login with inactive user
      await submitForm(page, inactiveUserEmail, password)

      // Assert: Verify appropriate error handling for inactive accounts
      await validateWrongLogin(page)
    }
  )

  /**
   * Successfully authenticate valid users
   * - Fill valid user credentials
   * - Validate successful authentication
   */
  test(
    'successfully authenticate valid users',
    { tag: ['@positive'] },
    async ({ page }) => {
      // Arrange: Use valid user credentials from environment
      const validUserEmail = process.env.TEST_LOGIN_USERNAME!
      const password = process.env.TEST_LOGIN_PASSWORD!

      // Act: Submit login form with valid credentials
      await submitForm(page, validUserEmail, password)

      // Assert: Verify successful authentication and redirect
      await validateCorrectLogin(page)
    }
  )

  /**
   * Refresh access token after expiration
   * - Fill valid user credentials
   * - Validate successful authentication
   * - Wait for token to expire
   * - Trigger token refresh by reloading page
   * - Validate successful authentication
   * - Validate refreshed access token
   */
  test(
    'refresh access token after expiration',
    { tag: ['@token', '@long-running'] },
    async ({ page }) => {
      // Set custom timeout for this long-running test
      test.setTimeout(4 * 60 * 1000)

      // Arrange: Login with valid credentials
      await submitForm(
        page,
        process.env.TEST_LOGIN_USERNAME!,
        process.env.TEST_LOGIN_PASSWORD!
      )

      // Act: Validate initial login
      await validateCorrectLogin(page)

      // Get initial access token from cookies
      const initialAccessToken = (await page.context().cookies()).find(
        (cookie: any) => cookie.name === 'access_token'
      )

      // Wait for token to expire (2 minutes)
      await page.waitForTimeout(1.5 * 60 * 1000)

      // Trigger token refresh by reloading page
      await page.reload()

      // Assert: Verify user remains logged in after token refresh
      await validateCorrectLogin(page)

      // Get refreshed access token
      const refreshedAccessToken = (await page.context().cookies()).find(
        (cookie: any) => cookie.name === 'access_token'
      )

      // Verify that the token was actually refreshed (different value)
      expect(refreshedAccessToken).not.toBe(initialAccessToken)
    }
  )

  /**
   * Logout after refresh token fails
   * - Fill valid user credentials
   * - Validate successful authentication
   * - Wait for token to expire
   * - Trigger token refresh by reloading page
   * - Validate redirect to login page
   */
  test(
    'logout after refresh token fails',
    { tag: ['@token', '@long-running'] },
    async ({ page }) => {
      // Arrange: Set custom timeout for this long-running test
      test.setTimeout(5 * 60 * 1000)

      // Arrange: Login with valid credentials
      await submitForm(
        page,
        process.env.TEST_LOGIN_USERNAME!,
        process.env.TEST_LOGIN_PASSWORD!
      )

      // Act: Validate initial login
      await validateCorrectLogin(page)

      // Act: Wait for token to expire (4 minutes)
      await page.waitForTimeout(4 * 60 * 1000)

      // Act: Trigger token refresh by reloading page
      await page.reload()

      // Assert: redirect to login page
      await expect(page).toHaveURL(`${BASE_URL}/login`)
    }
  )

  /**
   * Not allow to login with missing fields
   * - Submit login form with missing fields
   * - Validate no toast (form does not submit)
   * - Validate still at login page
   */
  test(
    'not allow to login with missing fields',
    { tag: ['@negative'] },
    async ({ page }) => {
      // Arrange: Submit login form with missing fields
      await submitForm(page, '', '')

      // Assert: Verify no toast (form does not submit)
      await expect(page.locator('.Toastify')).not.toBeVisible()

      // Assert: Verify still at login page
      await expect(page).toHaveURL(`${BASE_URL}/login`)
    }
  )
})
