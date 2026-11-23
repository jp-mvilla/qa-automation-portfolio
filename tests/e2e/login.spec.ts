import { test, expect } from '@playwright/test';

/**
 * Login — SauceDemo
 *
 * Técnica: partição de equivalência.
 * Dividimos as entradas em grupos que devem se comportar igual
 * e testamos um representante de cada grupo:
 *   1. usuário e senha válidos        → entra no sistema
 *   2. senha inválida                 → erro de credenciais
 *   3. usuário válido, porém bloqueado → erro de bloqueio
 *   4. usuário vazio                  → erro de campo obrigatório
 *   5. senha vazia                    → erro de campo obrigatório
 */

const SENHA = 'secret_sauce';

// Antes de cada teste, abre a página de login.
test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('CT01 - login com credenciais válidas leva para a lista de produtos', async ({ page }) => {
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill(SENHA);
  await page.getByTestId('login-button').click();

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.getByTestId('title')).toHaveText('Products');
});

test('CT02 - senha incorreta exibe erro de credenciais', async ({ page }) => {
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('senha_errada');
  await page.getByTestId('login-button').click();

  await expect(page.getByTestId('error')).toHaveText(
    'Epic sadface: Username and password do not match any user in this service',
  );
  await expect(page).not.toHaveURL(/inventory\.html/);
});

test('CT03 - usuário bloqueado não consegue entrar', async ({ page }) => {
  await page.getByTestId('username').fill('locked_out_user');
  await page.getByTestId('password').fill(SENHA);
  await page.getByTestId('login-button').click();

  await expect(page.getByTestId('error')).toHaveText(
    'Epic sadface: Sorry, this user has been locked out.',
  );
});

test('CT04 - usuário vazio exibe erro de campo obrigatório', async ({ page }) => {
  await page.getByTestId('password').fill(SENHA);
  await page.getByTestId('login-button').click();

  await expect(page.getByTestId('error')).toHaveText('Epic sadface: Username is required');
});

test('CT05 - senha vazia exibe erro de campo obrigatório', async ({ page }) => {
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('login-button').click();

  await expect(page.getByTestId('error')).toHaveText('Epic sadface: Password is required');
});
