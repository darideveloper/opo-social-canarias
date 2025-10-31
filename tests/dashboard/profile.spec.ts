/**
 * Dashboard Profile Tests
 *
 * This test suite validates the complete dashboard profile including:
 * - data loaded
 * - update name
 * - update image
 * - update password
 * - no update email
 * - update all fields
 * - render new image preview
 * 
 * Prerequisites:
 * - Environment variables must be set for test credentials
 * - Backend must be running on localhost:8000
 *
 * @fileoverview Comprehensive dashboard profile test suite
 */

// Libs
import { test, expect, type Page } from '@playwright/test'

// Helpers
import { registerUser, activateUser, login } from '../helpers/auth-helpers'
import path from 'path'
import { fileURLToPath } from 'url'

// Main settings
const BASE_URL = 'http://localhost:4321'

// Shared data
let currentName = ''
let currentEmail = ''
let currentPassword = ''
const selectors = {
    profileName: '#name',
    profileEmail: '#email',
    profileImage: '#profileImage',
    profileImagePreview: 'form img[alt="Preview"]',
    profilePassword: '#newPassword',
    profilePasswordValidation: '#confirmPassword',
    profileSubmit: 'button[type="submit"]',
}

test.describe('Dashboard Profile Tests', { tag: ['@dashboard'] }, () => {

    /**
     * Setup db and register a new user
     * @param page - Playwright page instance
     */
    test.beforeEach(async ({ page }) => {
        // Register a new user
        const { email, name, password } = await registerUser(page, true)
        currentEmail = email
        currentPassword = password
        currentName = name

        // Activate user
        await activateUser(page, currentEmail)

        // Login with user credentials
        await login(page, currentEmail, currentPassword)

        // Go to profile page
        await page.goto(`${BASE_URL}/dashboard/profile`)
        await page.waitForTimeout(2000)
    })

    /**
     * ------------------------------------------------------------
     * TEST CASES
     * ------------------------------------------------------------
     */

    /**
     * data loaded: show user info in profile page
     * - Load user data
     * - Validate profile image from backend
     * - Validate name from backend
     * - Validate email from backend
     */
    test('data loaded', { tag: ['@positive'] }, async ({ page }) => {
        // Aseert: validate profile data
        const imageSrc = await page.locator(selectors.profileImagePreview).getAttribute('src')
        expect(imageSrc).not.toBeNull()
        expect(imageSrc).toContain('test-image')
        expect(imageSrc).toContain('jpg')
        expect(imageSrc).toContain(':8000/media/')
        await expect(page.locator(selectors.profileName)).toHaveValue(currentName)
        await expect(page.locator(selectors.profileEmail)).toHaveValue(currentEmail)
    })

    /**
     * Update name: update user name
     * - Update name
     * - Validate name from backend
     */
    test('update name', { tag: ['@positive'] }, async ({ page }) => {

        const newName = 'New Name'

        // Act: update name
        await page.fill(selectors.profileName, newName)
        await page.click(selectors.profileSubmit)
        await page.waitForTimeout(2000)

        // Assert: refresh and validate name updates
        await page.reload()
        await page.waitForTimeout(2000)
        await expect(page.locator(selectors.profileName)).toHaveValue(newName)
    })

    /**
     * Update image: update user image
     * - Update image
     * - Validate image from backend
     */
    test('update image', { tag: ['@positive'] }, async ({ page }) => {
        // Act: update image
        await page.setInputFiles(selectors.profileImage, path.join(
            path.dirname(fileURLToPath(import.meta.url)),
            '../fixtures/test-image.webp'
        ))

        // Act: submit form
        await page.click(selectors.profileSubmit)
        await page.waitForTimeout(2000)

        // Assert: validate image from backend
        const imageSrc = await page.locator(selectors.profileImagePreview).getAttribute('src')
        expect(imageSrc).not.toBeNull()
        expect(imageSrc).toContain('test-image')
        expect(imageSrc).toContain('webp')
        expect(imageSrc).toContain(':8000/media/')
    })

    /**
     * Update password: update user password
     * - Update password
     * - Validate password from backend
     */
    test('update password', { tag: ['@positive'] }, async ({ page }) => {
        // Act: update password
        await page.fill(selectors.profilePassword, 'New Password')
        await page.fill(selectors.profilePasswordValidation, 'New Password')
        await page.click(selectors.profileSubmit)
        await page.waitForTimeout(2000)

        // Assert: refresh, delete cookies and login with new password
        await page.reload()
        await page.waitForTimeout(2000)
        await page.context().clearCookies()
        await login(page, currentEmail, 'New Password')
    })

    /**
     * Update email: update user email
     * - Update email
     * - Validate email from backend
     */
    test('no update email', { tag: ['@negative'] }, async ({ page }) => {

        // Act: for set new email in field (expected to fail)
        try {
            await page.fill(selectors.profileEmail, 'new@example.com', {timeout: 500})
        } catch (error) {
            // Expected error: field is disabled
        }

        // Assert: submit button disabled
        await expect(page.locator(selectors.profileSubmit)).toBeDisabled()
    })

    /**
     * Update all fields: update user all fields
     * - Update all fields
     * - Validate all fields from backend
     */
    test('update all fields', { tag: ['@positive'] }, async ({ page }) => {

        const newName = 'New Name'
        const newPassword = 'New Password'
        const newImage = path.join(
            path.dirname(fileURLToPath(import.meta.url)),
            '../fixtures/test-image.webp'
        )

        // Act: update all fields
        await page.fill(selectors.profileName, newName)
        await page.fill(selectors.profilePassword, newPassword)
        await page.fill(selectors.profilePasswordValidation, newPassword)

        // Act: set new image
        await page.setInputFiles(selectors.profileImage, newImage)

        // Act: submit form
        await page.click(selectors.profileSubmit)
        await page.waitForTimeout(1000)

        // Assert: refresh and validate all fields updates
        await page.reload()
        await page.waitForTimeout(1000)
        await expect(page.locator(selectors.profileName)).toHaveValue(newName)

        // Assert: validate image from backend
        const imageSrc = await page.locator(selectors.profileImagePreview).getAttribute('src')
        expect(imageSrc).not.toBeNull()
        expect(imageSrc).toContain('test-image')
        expect(imageSrc).toContain('webp')
        expect(imageSrc).toContain(':8000/media/')
    })
})