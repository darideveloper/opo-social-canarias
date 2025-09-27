/**
 * Register Authentication Tests
 *
 * This test suite validates the complete register authentication flow including:
 * - Both passwords match
 * - Password be at least 6 characters
 * - Successfully register a new user
 * - Replice inactive user data in second register
 * - don't allow to register with existing email
 * - don't allow to submit with missing fields
 * - don't login after register (activation required)

 * Prerequisites:
 * - Environment variables must be set for test credentials
 * - Backend must be running on localhost:8000
 *
 * @fileoverview Comprehensive register authentication test suite
 */

import { test, expect, type Page } from '@playwright/test'

// Main settings
const BASE_URL = 'http://localhost:4321'

test.describe(
  'Register Authentication Flow',
  { tag: ['@auth', '@smoke'] },
  () => {
    /**
     * Fill form data
     * @param page - Playwright page instance
     * @param name - User name
     * @param email - User email
     * @param password - User password
     * @param confirmPassword - User confirm password
     * @param submit - Submit form
     */
    async function fillFormData(
      page: Page,
      name: string | null,
      email: string | null,
      password: string | null,
      confirmPassword: string | null = null,
      submit: boolean = true
    ) {
      // Load register page
      await page.goto(`${BASE_URL}/register`)
      await page.waitForTimeout(2000)

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
        await page.fill('input#confirmPassword', confirmPassword)
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
      await expect(page.locator('[role="status"]')).toHaveText(message)
    }

    async function getRandomData(): Promise<{
      name: string
      email: string
      password: string
    }> {
      const name = `test-${Math.random().toString(36).substring(2, 15)}`
      const email = `test-${Math.random()
        .toString(36)
        .substring(2, 15)}@example.com`
      const password = `test-${Math.random().toString(36).substring(2, 15)}`
      return { name, email, password }
    }

    test(
      'should both passwords match',
      { tag: ['@negative'] },
      async ({ page }) => {
        // Arrange: use random email and password
        const { email, password, name } = await getRandomData()

        // Act: Submit register form with random credentials (but different passwords)
        await fillFormData(page, name, email, password, password + '1')

        // Assert: Verify both passwords match
        await validateMessage(page, 'Las contraseñas no coinciden')
      }
    )

    test(
      'should password be at least 6 characters',
      { tag: ['@negative'] },
      async ({ page }) => {
        // Arrange: use random email and password
        const { email, name } = await getRandomData()

        // Act: Submit register form with random credentials (but different passwords)
        await fillFormData(page, name, email, '123')

        // Assert: Verify both passwords match
        await validateMessage(
          page,
          'La contraseña debe tener al menos 6 caracteres'
        )
      }
    )

    test(
      'should successfully register a new user',
      { tag: ['@positive', '@smoke'] },
      async ({ page }) => {
        // Arrange: use random email and password
        const { name, email, password } = await getRandomData()

        // Act: Submit register form with random credentials
        await fillFormData(page, name, email, password)

        // Assert: Verify successful registration and redirect
        await validateMessage(page, '¡Registro exitoso!')
        await validateMessage(
          page,
          'Por favor, verifica tu correo electrónico para activar tu cuenta'
        )
      }
    )

    test(
      'should replicate inactive user data in second register',
      { tag: ['@negative'] },
      async ({ page }) => {
        // Arrange: use random email and password
        const { email, name } = await getRandomData()
      }
    )

    test(
      'should not allow to register with existing email',
      { tag: ['@negative'] },
      async ({ page }) => {
        // Arrange: use random email and password
        const { email, name } = await getRandomData()
      }
    )

    test(
      'should not allow to submit with missing fields',
      { tag: ['@negative'] },
      async ({ page }) => {
        // Arrange: use random email and password
        const { email, name } = await getRandomData()
      }
    )

    test(
      'should not login after register (activation required)',
      { tag: ['@negative'] },
      async ({ page }) => {
        // Arrange: use random email and password
        const { email, name } = await getRandomData()
      }
    )
  }
)
