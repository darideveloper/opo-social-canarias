/**
 * Register Authentication Tests
 *
 * This test suite validates the complete register authentication flow including:
 * - Both passwords match
 * - Password be at least 6 characters
 * - Successfully register a new user
 * - Replace inactive user data in second register
 * - Don't allow to register with existing email
 * - Don't allow to submit with missing fields
 * - Don't login after register (activation required)
 * - Validate email format

 * Prerequisites:
 * - Environment variables must be set for test credentials
 * - Backend must be running on localhost:8000
 *
 * @fileoverview Comprehensive register authentication test suite
 */

import { test, expect, type Page } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'
import { getProfileByUserId, getUserByEmail } from '../helpers/db-helpers'

// Main settings
const BASE_URL = 'http://localhost:4321'

test.describe('Register Authentication Flow', { tag: ['@auth'] }, () => {
  /**
   * Navigate to login page and wait for it to fully load
   */
  test.beforeEach(async ({ page }) => {
    // Navigate to login page and wait for it to fully load
    await page.goto(`${BASE_URL}/sign-up`)
    await page.waitForTimeout(2000)
  })

  /**
   * Fill form data
   * @param page - Playwright page instance
   * @param name - User name
   * @param email - User email
   * @param password - User password
   * @param confirmPassword - User confirm password
   * @param imagePath - Path to image file to upload
   * @param submit - Submit form
   */
  async function fillFormData(
    page: Page,
    name: string | null,
    email: string | null,
    password: string | null,
    confirmPassword: string | null = null,
    imagePath: string | null = null,
    submit: boolean = true
  ) {
    // Fill data
    if (name) {
      await page.fill('input#name', name)
    }
    if (email) {
      await page.fill('input#email', email)
    }
    if (password) {
      await page.fill('input#password', password)
    }
    if (confirmPassword === null && password !== null) {
      confirmPassword = password
    }
    if (confirmPassword) {
      await page.fill('input#passwordValidation', confirmPassword)
    }

    // Upload image if provided
    if (imagePath) {
      await page.setInputFiles('input[name="profileImage"]', imagePath)
    }

    // Submit form
    if (submit) {
      await page.click('button[type="submit"]')
      await page.waitForTimeout(1000)
    }
  }

  /**
   * Validate toast message
   * @param page - Playwright page instance
   * @param message - Message to validate
   */
  async function validateMessage(page: Page, message: string) {
    // Wait for redirect to complete
    await page.waitForTimeout(2000)

    // verify message
    await expect(page.locator('.Toastify')).toHaveText(message)
  }

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

  async function validateSuccessRegistration(page: Page) {
    // Wait extra time to see the messages
    await page.waitForTimeout(2000)

    // Assert: Verify successful registration and redirect
    await validateMessage(
      page,
      '¡Registro exitoso! Por favor, verifica tu correo electrónico para activar tu cuenta'
    )
  }

  /**
   * Both passwords match
   * - Submit register form with random credentials (but different passwords)
   * - Validate error message
   */
  test('both passwords match', { tag: ['@negative'] }, async ({ page }) => {
    // Arrange: use random email and password
    const { email, password, name } = await getRandomData()

    // Act: Submit register form with random credentials (but different passwords)
    await fillFormData(page, name, email, password, password + '1')

    // Assert: Verify both passwords match
    const errorMessageElement = page.locator('.label-text-alt.text-error')
    await expect(errorMessageElement).toHaveText('Las contraseñas no coinciden')
  })

  /**
   * Password be at least 6 characters
   * - Submit register form with random credentials (but password is less than 6 characters)
   * - Validate error message
   */
  test(
    'password be at least 6 characters',
    { tag: ['@negative'] },
    async ({ page }) => {
      // Arrange: use random email and password
      const { email, name } = await getRandomData()

      // Act: Submit register form with random credentials (but different passwords)
      await fillFormData(page, name, email, '123')

      // Assert: Verify error message
      const errorMessageElement = page.locator('.label-text-alt.text-error')
      await expect(errorMessageElement).toHaveText(
        'La contraseña debe tener al menos 6 caracteres'
      )
    }
  )

  /**
   * Successfully register a new user
   * - Submit register form with random credentials
   * - Validate successful registration
   * - Validate user inactive in db
   */
  test(
    'successfully register a new user',
    { tag: ['@positive'] },
    async ({ page }) => {
      // Arrange: use random email and password
      const { name, email, password } = await getRandomData()

      // Act: Submit register form with random credentials
      await fillFormData(page, name, email, password)

      // Assert: Verify successful registration and redirect
      await validateSuccessRegistration(page)

      // validate user inactive in db
      const user = await getUserByEmail(email)
      expect(user.is_active).toBe(false)
    }
  )

  /**
   * Replace inactive user data in second register
   * - Submit register form with inactive user credentials
   * - Validate successful registration
   * - Validate username updated in db
   */
  test(
    'replace inactive user data in second register',
    { tag: ['@negative'] },
    async ({ page }) => {
      // Arrange: use random name and already registered email and password
      const { name } = await getRandomData()
      const email = process.env.TEST_LOGIN_USERNAME_INACTIVE!
      const password = process.env.TEST_LOGIN_PASSWORD!

      // Act: Submit register form with random credentials (but different passwords)
      await fillFormData(page, name, email, password)

      // Assert: Verify successful registration and redirect
      await validateSuccessRegistration(page)

      // Validate username updated in databse
      const user = await getUserByEmail(email)
      const profile = await getProfileByUserId(user.id)
      expect(profile.name).toBe(name)
    }
  )

  /**
   * Register with existing email
   * - Submit register form with already registered email
   * - Validate error message
   */
  test(
    'register with existing email',
    { tag: ['@negative'] },
    async ({ page }) => {
      // Arrange: use random name and password, but already registered (and active) email
      const { name, password } = await getRandomData()
      const email = process.env.TEST_LOGIN_USERNAME!

      // Act: Submit register form with random credentials (but different passwords)
      await fillFormData(page, name, email, password)

      // Assert: Verify error message
      await validateMessage(page, 'El email ya está registrado')
    }
  )

  /**
   * Submit with missing fields
   * - Submit register form with missing fields
   * - Validate no toast (form does not submit)
   */
  test(
    'submit with missing fields',
    { tag: ['@negative'] },
    async ({ page }) => {
      // Click in submit form without data
      await page.click('button[type="submit"]')

      // Assert: Verify no toast (form does not submit)
      await expect(page.locator('.Toastify')).not.toBeVisible()
    }
  )

  /**
   * Login after register (activation required)
   * - Submit register form with random credentials
   * - Validate successful registration
   * - Validate user inactive in db
   */
  test(
    'login after register (activation required)',
    { tag: ['@negative'] },
    async ({ page }) => {
      // Arrange: use random email and password
      const { email, name, password } = await getRandomData()

      // Act: Submit register form with random credentials
      await fillFormData(page, name, email, password)

      // Assert: Verify successful registration and redirect
      await validateSuccessRegistration(page)

      // Act: go to login page
      await page.goto(`${BASE_URL}/login`)
      await page.waitForTimeout(1000)

      // Act: submit login form with same credentials
      await page.fill('input[type="email"]', email)
      await page.fill('input[type="password"]', password)
      await page.click('button[type="submit"]')

      // Assert: Verify error message
      await validateMessage(
        page,
        'La combinación de credenciales no tiene una cuenta activa'
      )
    }
  )

  /**
   * Register with invalid email format
   * - Submit register form with invalid email format
   * - Validate error message
   */
  test(
    'register with invalid email format',
    { tag: ['@negative'] },
    async ({ page }) => {
      // Arrange: use random email and password
      let { email, name, password } = await getRandomData()

      // Arrange: add random symbols to email
      email = email.replace('test', '!#$%^&*')

      // Act: Submit register form with random credentials
      await fillFormData(page, name, email, password)

      // Assert: Verify error message
      const errorMessageElement = page.locator('.label-text-alt.text-error')
      await expect(errorMessageElement).toHaveText(
        'Por favor, ingresa un email válido'
      )
    }
  )

  /**
   * Register with profile image upload
   * - Submit register form with random credentials and profile image
   * - Validate successful registration
   */
  test(
    'register with profile image upload',
    { tag: ['@positive'] },
    async ({ page }) => {
      // Arrange: use random email and password
      const { name, email, password } = await getRandomData()
      const imagePath = path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        '../fixtures/test-image.jpg'
      )

      // Act: Submit register form with image
      await fillFormData(page, name, email, password, null, imagePath)

      // Assert: Verify successful registration
      await validateSuccessRegistration(page)

      // Validate user profile image exists in db
      const user = await getUserByEmail(email)
      const profile = await getProfileByUserId(user.id)
      expect(profile.profile_img).not.toBeNull()
    }
  )

  /**
   * Register without profile image (optional field)
   * - Submit register form with random credentials without image
   * - Validate successful registration
   */
  test(
    'register without profile image',
    { tag: ['@positive'] },
    async ({ page }) => {
      // Arrange: use random email and password
      const { name, email, password } = await getRandomData()

      // Act: Submit register form without image
      await fillFormData(page, name, email, password, null, null)

      // Assert: Verify successful registration
      await validateSuccessRegistration(page)

      // Validate user profile image does not exist in db
      const user = await getUserByEmail(email)
      const profile = await getProfileByUserId(user.id)
      console.log(profile)
      expect(profile.profile_img).toBe("")
    }
  )
})
