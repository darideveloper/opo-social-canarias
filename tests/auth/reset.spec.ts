/**
 * Reset Password Authentication Tests
 *
 * This test suite validates the complete reset password authentication flow including:
 * - post - request valid email
 * - post - request invalid email
 * - post - invalid email format
 * - post - missing fields
 * - put - reset password with valid token
 * - put - reset password with invalid token
 * - put - password validation: missing fields
 * - put - password validation: invalid password (less than 6 characters)
 * - put - password validation: invalid password (dont match)
 * - put - reset password with an expired token
 * - put - reset password with an disabled token
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
import { getTokenFromEmail, updateToken } from '../helpers/db-helpers'

// Helpers
import { registerUser, activateUser } from '../helpers/auth-helpers'

// Main settings
const BASE_URL = 'http://localhost:4321'

let currentEmail = ''
let currentPassword = ''
let currentName = ''

test.describe('Reset Password Authentication Flow', { tag: ['@auth'] }, () => {

 
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
    await expect(page.locator('.label-text-alt.text-error')).toHaveText(message)
  }

  /**
   * Validate confirmation screen
   * @param page - Playwright page instance
   * @param title - Title to validate
   * @param message - Message to validate
   */
  async function validateConfirmationScreen(
    page: Page,
    title: string,
    message: string,
  ) {
    // Validate h1 and text
    await expect(page.locator('.card-body h1')).toHaveText(title)
    await expect(page.locator('.card-body p')).toHaveText(message)

    // Validate go back button
    const button = await page.locator('.card-body a')
    await expect(button).toHaveText('Volver al inicio de sesión')
    await expect(button).toHaveAttribute('href', '/login')
  }

  /**
   * Validate confirmation post screen (email form)
   * @param page - Playwright page instance
   */
  async function validateConfirmationPost(page: Page) {
    await validateConfirmationScreen(
      page,
      'Email Enviado',
      'Hemos enviado un enlace de recuperación a tu correo electrónico. Por favor revisa tu bandeja de entrada.',
    )
  }


  /**
   * Validate confirmation put screen (reset password form)
   * @param page - Playwright page instance
   */
  async function validateConfirmationPut(page: Page) {
    await validateConfirmationScreen(
      page,
      'Contraseña Actualizada',
      'Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.',
    )
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

    // Act: wait to submit form
    await page.waitForTimeout(2000)
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
  ) {
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
    const { email, name, password } = await registerUser(page)
    currentEmail = email
    currentPassword = password
    currentName = name

    // Activate user
    await activateUser(page, currentEmail)
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

      // Assert email confirmation screen
      await validateConfirmationPost(page)

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

      // Assert email confirmation screen
      await validateConfirmationPost(page)

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
      await validateMessage(page, 'Por favor ingresa un email válido')

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
      await validateConfirmationPut(page)

      // Act: delete browser cookies to allow login with new password
      await page.context().clearCookies()

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
        'Error al actualizar la contraseña. Intenta más tarde.'
      )

      // Assert: login with new password
      await login(page, currentEmail, currentPassword)

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
      await submitResetPasswordForm(page, '1234567890', '0987654321', 'fake-token')

      // Assert: error in toast
      await validateMessage(page, 'Las contraseñas no coinciden')

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
      await submitResetPasswordForm(page, '1234567890', '1234567890', token!)

      // Assert: toast message
      await validateMessage(
        page,
        'Error al actualizar la contraseña. Intenta más tarde.'
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
      await submitResetPasswordForm(page, '1234567890', '1234567890', token!)

      // Assert: toast message
      await validateMessage(
        page,
        'Error al actualizar la contraseña. Intenta más tarde.'
      )

      // Assert: token not active in db
      token = await getTokenFromEmail(currentEmail, 'pass')
      expect(token).toBeNull()
    }
  )
})
