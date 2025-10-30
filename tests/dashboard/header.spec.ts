/**
 * Dashboard Header Tests
 *
 * This test suite validates the complete dashboard header including:
 * - load user data
 * - load user data no profile image
 * 
 * Prerequisites:
 * - Environment variables must be set for test credentials
 * - Backend must be running on localhost:8000
 * - Backend access token must be set to 1 minutes
 * - Backend refresh token must be set to 3 minutes
 *
 * @fileoverview Comprehensive dashboard header test suite
 */

import { test, expect, type Page } from '@playwright/test'
import { getTokenFromEmail, deleteProfileImage } from '../helpers/db-helpers'
import path from 'path'
import { fileURLToPath } from 'url'

// Main settings
const BASE_URL = 'http://localhost:4321'

// Shared data
let currentName = ''
let currentEmail = ''
let currentPassword = ''
const selectors = {
    menuButton: '.dropdown [role="button"]',
    profileImage: 'img[alt="avatar"]',
    profileName: '.dropdown-content div:nth-child(1)',
    profileEmail: '.dropdown-content div:nth-child(2)',
}


test.describe('Dashboard Header Tests', { tag: ['@dashboard'] }, () => {
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
        currentName = name

        // Navigate to login page and wait for it to fully load
        await page.goto(`${BASE_URL}/sign-up`)
        await page.waitForTimeout(2000)

        // Fill data
        await page.fill('input#name', name)
        await page.fill('input#email', email)
        await page.fill('input#password', password)
        await page.fill('input#passwordValidation', password)

        // Add image to upload
        await page.setInputFiles('input[name="profileImage"]', path.join(
            path.dirname(fileURLToPath(import.meta.url)),
            '../fixtures/test-image.jpg'
        ))

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
        await registerUser(page)

        // Activate user
        await activateUser(page)
    })

    /**
     * ------------------------------------------------------------
     * TEST CASES
     * ------------------------------------------------------------
     */

    /**
     * Load user data: show user info in header menu
     * - Load user data
     * - Validate profile image from backend
     * - Validate name from backend
     * - Validate email from backend
     */
    test('load user data', { tag: ['@positive'] }, async ({ page }) => {
        // Act: Login with user credentials
        await login(page, currentEmail, currentPassword)

        // Act: open menu
        await page.click(selectors.menuButton)
        await page.waitForTimeout(1000)

        // Assert: validate profile image from backend
        const imageSrc = await page.locator(selectors.profileImage).getAttribute('src')
        expect(imageSrc).not.toBeNull()
        expect(imageSrc).toContain('test-image')
        expect(imageSrc).toContain('jpg')
        expect(imageSrc).toContain(':8000/media/')

        // Validate user email and name
        expect(await page.locator(selectors.profileName).textContent()).toContain(currentName)
        expect(await page.locator(selectors.profileEmail).textContent()).toContain(currentEmail)
    })

    test('load user data no profile image', { tag: ['@positive'] }, async ({ page }) => {
        // Delete profile image from db
        await deleteProfileImage(currentEmail)

        // Act: Login with user credentials
        await login(page, currentEmail, currentPassword)

        // Act: open menu
        await page.click(selectors.menuButton)
        await page.waitForTimeout(1000)

        // Assert: validate profile image from backend
        const imageSrc = await page.locator(selectors.profileImage).getAttribute('src')
        expect(imageSrc).not.toBeNull()
        expect(imageSrc).toContain('/user.svg')
    })
    
})