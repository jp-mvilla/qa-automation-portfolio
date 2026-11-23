import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProdutosPage } from '../../pages/ProdutosPage';

/**
 * Login — SauceDemo
 *
 * Técnica: partição de equivalência.
 * As entradas foram divididas em grupos que devem se comportar igual,
 * e testamos um representante de cada grupo:
 *   1. usuário e senha válidos         → entra no sistema
 *   2. senha inválida                  → erro de credenciais
 *   3. usuário válido, porém bloqueado → erro de bloqueio
 *   4. usuário vazio                   → erro de campo obrigatório
 *   5. senha vazia                     → erro de campo obrigatório
 */

const SENHA = 'secret_sauce';
let login: LoginPage;

test.beforeEach(async ({ page }) => {
  login = new LoginPage(page);
  await login.abrir();
});

test('CT01 - login com credenciais válidas leva para a lista de produtos', async ({ page }) => {
  await login.entrar('standard_user', SENHA);

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(new ProdutosPage(page).titulo).toHaveText('Products');
});

test('CT02 - senha incorreta exibe erro de credenciais', async ({ page }) => {
  await login.entrar('standard_user', 'senha_errada');

  await expect(login.mensagemErro).toHaveText(
    'Epic sadface: Username and password do not match any user in this service',
  );
  await expect(page).not.toHaveURL(/inventory\.html/);
});

test('CT03 - usuário bloqueado não consegue entrar', async () => {
  await login.entrar('locked_out_user', SENHA);

  await expect(login.mensagemErro).toHaveText('Epic sadface: Sorry, this user has been locked out.');
});

test('CT04 - usuário vazio exibe erro de campo obrigatório', async () => {
  await login.entrar('', SENHA);

  await expect(login.mensagemErro).toHaveText('Epic sadface: Username is required');
});

test('CT05 - senha vazia exibe erro de campo obrigatório', async () => {
  await login.entrar('standard_user', '');

  await expect(login.mensagemErro).toHaveText('Epic sadface: Password is required');
});
