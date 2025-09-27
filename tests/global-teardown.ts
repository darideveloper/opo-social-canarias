/**
 * Global Teardown for Playwright Tests
 * 
 * This file runs once after all tests complete to clean up resources
 * and close database connections properly.
 * 
 * @fileoverview Global teardown configuration for Playwright tests
 */

import { closeConnection } from './utils/db'

/**
 * Global teardown function that runs after all tests
 * Closes database connections and performs global cleanup
 */
async function globalTeardown() {
  console.log('🧹 Starting global test teardown...')
  
  try {
    // Close database connection
    await closeConnection()
    console.log('✅ Global teardown completed successfully')
  } catch (error) {
    console.error('❌ Global teardown failed:', error)
    // Don't throw error in teardown to avoid masking test failures
  }
}

export default globalTeardown
