import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // Permite override via CLI o env vars
    // @ts-ignore - process.env disponible en Node.js
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:5173',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 15000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    video: true,
    screenshotOnRunFailure: true,
    setupNodeEvents() {
      // implement node event listeners here
    },
    env: {
      // @ts-ignore - process.env disponible en Node.js
      apiUrl: process.env.CYPRESS_API_URL || 'http://localhost:8080'
    }
  },
});
