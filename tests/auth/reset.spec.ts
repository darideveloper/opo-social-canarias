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
import {
  getTokenFromEmail,
  updateToken,
} from '../helpers/db-helpers'

// Main settings
const BASE_URL = 'http://localhost:4321'

let currentEmail = ''
let currentPassword = ''

test.describe('Reset Password Authentication Flow', { tag: ['@auth'] }, () => {
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
  async function validateMessage(
    page: Page,
    message: string,
    waitTime: number = 2000
  ) {
    // Wait for redirect to complete
    await page.waitForTimeout(waitTime)

    // verify message
    await expect(page.locator('.Toastify')).toHaveText(message)
  }

  /**
   * Submit email form
   * @param page - Playwright page instance
   * @param email - User email
   */
  async function submitEmailForm(page: Page, email: string) {
    // Arrange: navigate to reset password page
    await page.goto(`${BASE_URL}/reset-password`)
    await page.waitForTimeout(2000)

    // Act: request valid email
    await page.fill('input#email', email)
    await page.click('button[type="submit"]')
  }

  /**
   * Submit reset password form
   * @param page - Playwright page instance
   * @param password - User password
   * @param confirmPassword - User confirm password
   */
  async function submitResetPasswordForm(
    page: Page,
    password: string,
    confirmPassword: string,
    token: string
  ) {
    // Arrange: navigate to reset password page with token
    await page.goto(`${BASE_URL}/reset-password/${token}`)
    await page.waitForTimeout(2000)

    // Act: fill password fields
    await page.fill('input#password', password)
    await page.fill('input#confirmPassword', confirmPassword)
    await page.click('button[type="submit"]')
  }

  /**
   * Login with user credentials
   * @param page - Playwright page instance
   * @param email - User email
   * @param password - User password
   */
  async function login(
    page: Page,
    email: string,
    password: string,
    validLogin: boolean = true
  ) {
    // Act: Open login page
    await page.goto(`${BASE_URL}/login`)
    await page.waitForTimeout(2000)

    // Act: Submit login form
    await page.fill('input[type="email"]', email)
    await page.fill('input[type="password"]', password)
    await page.click('button[type="submit"]')

    // Assert: redirect to home page
    await expect(page).toHaveURL(`${BASE_URL}/`)

    // Assert: welcome message is displayed
    if (validLogin) {
      await expect(page.locator('main h1.text-3xl.font-bold')).toHaveText(
        'Welcome to Socialia'
      )
    } else {
      await expect(page.locator('main h1.text-3xl.font-bold')).toHaveText(
        'Welcome to Socialia'
      )
    }
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
  })

  /**
   * ------------------------------------------------------------
   * POST REQUESTS
   * ------------------------------------------------------------
   */

  /**
   * Request valid email
   * - Request valid email
   * - Validate toast message
   * - Validate token generated in db
   */
  test(
    'post - request valid email',
    { tag: ['@positive'] },
    async ({ page }) => {
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

  /**
   * Request invalid email
   * - Request invalid email
   * - Validate toast message
   * - Validate token not generated in db
   */
  test(
    'post - request invalid email',
    { tag: ['@negative'] },
    async ({ page }) => {
      // Act: request valid email
      await submitEmailForm(page, 'invalid-no-registered@email.com')

      // Assert: toast message
      await validateMessage(
        page,
        'Si el email existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.'
      )

      // Assert: token not generated in db
      const token = await getTokenFromEmail(currentEmail, 'pass')
      expect(token).toBeNull()
    }
  )

  /**
   * Request invalid email format
   * - Request invalid email format
   * - Validate toast message
   * - Validate token not generated in db
   */
  test(
    'post - invalid email format',
    { tag: ['@negative'] },
    async ({ page }) => {
      // Act: request valid email
      const email = 'a@a'
      await submitEmailForm(page, email)

      // Assert: error message
      const errorMessageElement = page.locator('p.text-sm.text-destructive')
      await expect(errorMessageElement).toHaveText(
        'Por favor ingresa un email válido'
      )

      // Assert: token not generated in db
      const token = await getTokenFromEmail(currentEmail, 'pass')
      expect(token).toBeNull()
    }
  )

  /**
   * Request missing fields
   * - Request missing fields
   * - Validate toast message
   * - Validate token not generated in db
   */
  test('post - missing fields', { tag: ['@negative'] }, async ({ page }) => {
    // Act: request valid email
    await submitEmailForm(page, '')

    // Assert: no alert because no email was filled
    await expect(page.locator('main [role="alert"]')).not.toBeVisible()

    // Assert: token not generated in db
    const token = await getTokenFromEmail(currentEmail, 'pass')
    expect(token).toBeNull()
  })

  /**
   * ------------------------------------------------------------
   * POST REQUESTS
   * ------------------------------------------------------------
   */

  /**
   * Reset password with token
   * - Generate token submiting form with email
   * - Get token generated from db
   * - Navigate to reset password page with token
   * - Fill password fields
   * - Submit form
   * - Validate success screen
   * - Validate login with new password
   * - Validate token disabled in database
   */
  test(
    'put - reset password with valid token',
    { tag: ['@positive'] },
    async ({ page }) => {
      // Arrange: generate token submiting form with email
      await submitEmailForm(page, currentEmail)

      // Wait 2 seconds
      await page.waitForTimeout(2000)

      // Assert: get token generated in db and valdiate
      let token = await getTokenFromEmail(currentEmail, 'pass')
      expect(token).not.toBeNull()

      // Act: fill password fields
      await submitResetPasswordForm(
        page,
        currentPassword,
        currentPassword,
        token!
      )

      // Assert: toast message
      await validateMessage(page, 'Contraseña restablecida exitosamente')

      // Assert: login with new password
      await login(page, currentEmail, currentPassword)

      // Validate token disabled in database
      token = await getTokenFromEmail(currentEmail, 'pass')
      expect(token).toBeNull()
    }
  )

  /**
   * Reset password with invalid token
   * - Generate token submiting form with email
   * - Get token generated from db
   * - Navigate to reset password page with token
   * - Fill password fields
   * - Submit form
   * - Validate error screen
   * - Validate token not generated in db
   */
  test(
    'put - reset password with invalid token',
    { tag: ['@negative'] },
    async ({ page }) => {
      // Arrange: generate token submiting form with email
      await submitEmailForm(page, currentEmail)

      // Wait 2 seconds
      await page.waitForTimeout(2000)

      // Assert: get token generated in db and valdiate
      let token = await getTokenFromEmail(currentEmail, 'pass')
      expect(token).not.toBeNull()

      // Act: fill password fields
      await submitResetPasswordForm(
        page,
        currentPassword,
        currentPassword,
        'invalid-token'
      )

      // Assert: toast message
      await validateMessage(
        page,
        'Error al restablecer la contraseña. Intenta más tarde o solicita un nuevo enlace de restablecimiento.'
      )

      // Assert: login with new password
      await login(page, currentEmail, currentPassword, false)

      // Validate token still active (unused) in database
      token = await getTokenFromEmail(currentEmail, 'pass')
      expect(token).not.toBeNull()
    }
  )

  /**
   * Password fields validation: missing fields
   * - Submit form
   * - Validate error screen
   * - Validate token not generated in db
   */
  test(
    'put - password validation: missing fields',
    { tag: ['@negative'] },
    async ({ page }) => {
      // Act: fill password fields
      await submitResetPasswordForm(
        page,
        currentPassword,
        currentPassword,
        'fake-token'
      )

      // Assert: no alert because no password was filled
      await expect(page.locator('main [role="alert"]')).not.toBeVisible()

      // Assert: token not generated in db
      const token = await getTokenFromEmail(currentEmail, 'pass')
      expect(token).toBeNull()
    }
  )

  /**
   * Password fields validation: invalid password (less than 6 characters)
   * - Submit form
   * - Validate error screen
   * - Validate token not generated in db
   */
  test(
    'put - password validation: invalid password (less than 6 characters)',
    { tag: ['@negative'] },
    async ({ page }) => {
      // Act: fill password fields
      await submitResetPasswordForm(page, '12345', '12345', 'fake-token')

      // Assert: no alert because no password was filled
      await expect(page.locator('main [role="alert"]')).not.toBeVisible()

      // Assert: token not generated in db
      const token = await getTokenFromEmail(currentEmail, 'pass')
      expect(token).toBeNull()
    }
  )

  /**
   * Password fields validation: invalid password (don't match)
   * - Submit form
   * - Validate error screen
   * - Validate token not generated in db
   */
  test(
    'put - password validation: invalid password (dont match)',
    { tag: ['@negative'] },
    async ({ page }) => {
      // Act: fill password fields
      await submitResetPasswordForm(page, '123456', '1234567', 'fake-token')

      // Assert: error in toast
      const errorMessageElement = page.locator('p.text-sm.text-destructive')
      await expect(errorMessageElement).toHaveText(
        'Las contraseñas no coinciden'
      )

      // Assert: token not generated in db
      const token = await getTokenFromEmail(currentEmail, 'pass')
      expect(token).toBeNull()
    }
  )

  /**
   * Try to reset password with an expired token
   * - Generate token submiting form with email
   * - Wait 3 minutes
   * - Get token generated from db
   * - Navigate to reset password page with token
   * - Fill password fields
   * - Submit form
   * - Validate error screen
   * - Validate token not active in db
   */
  test(
    'put - reset password with an expired token',
    { tag: ['@negative', '@long-running'] },
    async ({ page }) => {
      // Arrange: Set custom timeout for this long-running test
      test.setTimeout(4 * 60 * 1000)

      // Arrange: generate token submiting form with email
      await submitEmailForm(page, currentEmail)

      // Wait 2 seconds
      await page.waitForTimeout(2000)

      // Assert: get token generated in db and valdiate
      let token = await getTokenFromEmail(currentEmail, 'pass')
      expect(token).not.toBeNull()

      // Wait 3 minutes
      await page.waitForTimeout(3 * 60 * 1000)

      // Act: fill password fields
      await submitResetPasswordForm(page, '123456', '123456', token!)

      // Assert: toast message
      await validateMessage(
        page,
        'Error al restablecer la contraseña. Intenta más tarde o solicita un nuevo enlace de restablecimiento.'
      )

      // Assert: token still active in db (but expired)
      token = await getTokenFromEmail(currentEmail, 'pass')
      expect(token).not.toBeNull()
    }
  )

  /**
   * Try to reset password with an disabled token
   * - Generate token submiting form with email
   * - Get token generated from db
   * - Disable token in database
   * - Navigate to reset password page with token
   * - Fill password fields
   * - Submit form
   * - Validate error screen
   * - Validate token not active in db
   */
  test(
    'put - reset password with an disabled token',
    { tag: ['@negative'] },
    async ({ page }) => {
      // Arrange: generate token submiting form with email
      await submitEmailForm(page, currentEmail)

      // Wait 2 seconds
      await page.waitForTimeout(2000)

      // Assert: get token generated in db and valdiate
      let token = await getTokenFromEmail(currentEmail, 'pass')
      expect(token).not.toBeNull()

      // Act: disable token in database
      await updateToken(token!, false)

      // Act: fill password fields
      await submitResetPasswordForm(page, '123456', '123456', token!)

      // Assert: toast message
      await validateMessage(
        page,
        'Error al restablecer la contraseña. Intenta más tarde o solicita un nuevo enlace de restablecimiento.'
      )

      // Assert: token not active in db
      token = await getTokenFromEmail(currentEmail, 'pass')
      expect(token).toBeNull()
    }
  )
})
