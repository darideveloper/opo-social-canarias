import { test, expect, type Page } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  // Load login page and wait 2 seconds
  await page.goto('http://localhost:4321/login')
  await page.waitForTimeout(2000)
})

test.describe('Login', () => {


  async function validate_wrong_login(page: Page) {
    await expect(page).toHaveURL('http://localhost:4321/login')

    // Check toast error message
    await expect(page.locator('body')).toHaveText(
      'La combinación de credenciales no tiene una cuenta activa'
    )
  }

  test('invalid credentials', async ({ page }) => {
    // Login with invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com')
    await page.fill('input[type="password"]', 'invalidpassword')
    await page.click('button[type="submit"]')
    
    // Validate wrong login
    validate_wrong_login(page)

  })

  test('inactive user', async ({ page }) => {
    // Login with inactive user
    await page.fill('input[type="email"]', process.env.TEST_LOGIN_USERNAME_INACTIVE!)
    await page.fill('input[type="password"]', process.env.TEST_LOGIN_PASSWORD!)
    await page.click('button[type="submit"]')
    
    // Validate wrong login
    validate_wrong_login(page)
  })

  test('should login', async ({ page }) => {
    await page.fill('input[type="email"]', process.env.TEST_LOGIN_USERNAME!)
    await page.fill('input[type="password"]', process.env.TEST_LOGIN_PASSWORD!)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('http://localhost:4321/')
  })
})
