
// Libs
import { expect, type Page } from "@playwright/test"

// Helpers
import { getTokenFromEmail } from "./db-helpers"
import { fileURLToPath } from "url"
import path from "path"

// Main settings
const BASE_URL = 'http://localhost:4321'

/**
 * Get random data
 * @returns {Promise<{name: string, email: string, password: string}>}
 */
export async function getRandomData() {
    // Create random string of 6 chars (only letters and numbers)
    const randomString = Math.random().toString(36).substring(2, 8)

    const name = `test-${randomString}`
    const email = `test-${randomString}@gmail.com`
    const password = `123456`
    return { name, email, password }
}

/**
 * Validate toast message
 * @param page - Playwright page instance
 * @param message - Message to validate
 */
export async function validateMessage(page: Page, message: string) {
    // Wait for redirect to complete
    await page.waitForTimeout(2000)

    // verify message
    await expect(page.locator('.Toastify')).toHaveText(message)
}

/**
  * Register a new user
  * @param page - Playwright page instance
  */
export async function registerUser(page: Page, useProfileImage: boolean = false) {
    // Arrange: use random email and password
    const { email, name, password } = await getRandomData()

    // Navigate to login page and wait for it to fully load
    await page.goto(`${BASE_URL}/sign-up`)
    await page.waitForTimeout(2000)

    // Fill data
    await page.fill('input#name', name)
    await page.fill('input#email', email)
    await page.fill('input#password', password)
    await page.fill('input#passwordValidation', password)

    // Add image to upload
    if (useProfileImage) {
        await page.setInputFiles('input[name="profileImage"]', path.join(
            path.dirname(fileURLToPath(import.meta.url)),
            '../fixtures/test-image.jpg'
        ))
    }

    // Submit form
    await page.click('button[type="submit"]')
    await page.waitForTimeout(3000)

    return { email, name, password }
}

/**
 * Activate user
 * @param page - Playwright page instance
 */
export async function activateUser(page: Page, email: string) {
    // Arrange: get token from email
    const token = await getTokenFromEmail(email)

    // Act: navigate to activate page
    await page.goto(`${BASE_URL}/activate/${token}`)
    await page.waitForTimeout(2000)
}
