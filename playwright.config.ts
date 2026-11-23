import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração central do Playwright.
 * Documentação: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,            // roda os testes em paralelo
  forbidOnly: !!process.env.CI,   // no CI, falha se alguém esqueceu um test.only
  retries: process.env.CI ? 2 : 0, // no CI, tenta de novo até 2x antes de marcar falha
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    testIdAttribute: 'data-test', // o SauceDemo marca os elementos com data-test="..."
    trace: 'on-first-retry',      // grava o passo a passo quando um teste falha e é repetido
    screenshot: 'only-on-failure', // evidência automática em caso de falha
  },

  projects: [
    {
      name: 'e2e',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Chrome'], baseURL: 'https://www.saucedemo.com' },
    },
  ],
});
