/**
 * Global Setup for Playwright Tests
 * 
 * This file runs once before all tests to set up the database connection
 * and perform any global initialization needed for the test suite.
 * 
 * @fileoverview Global setup configuration for Playwright tests
 */

import { testConnection } from './utils/db'

/**
 * Global setup function that runs before all tests
 * Establishes database connection and performs global initialization
 */
async function globalSetup() {
  console.log('🚀 Starting global test setup...')
  
  try {
    // Test database connection
    const connected = await testConnection()
    
    if (!connected) {
      throw new Error('Failed to connect to database during global setup')
    }
    
    console.log('✅ Global setup completed successfully')
  } catch (error) {
    console.error('❌ Global setup failed:', error)
    throw error
  }
}

export default globalSetup
