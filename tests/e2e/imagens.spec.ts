import { test, expect, Page } from '@playwright/test';

/**
 * Imagens dos produtos — SauceDemo
 *
 * CT11 garante o comportamento correto (cada produto com sua própria imagem).
 * CT12 reproduz o BUG-03 (docs/bugs.md): com o usuário problem_user todos os produtos exibem a mesma imagem.
 * Ele está marcado com test.fail(): o teste descreve o comportamento CORRETO e "falha" de propósito
 * enquanto o bug existir. Se um dia o bug for corrigido, o Playwright avisa.
 */

async function login(page: Page, usuario: string) {
  await page.goto('/');
  await page.getByTestId('username').fill(usuario);
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL(/inventory\.html/);
}

async function caminhosDasImagens(page: Page): Promise<(string | null)[]> {
  return page.locator('img.inventory_item_img').evaluateAll((imgs) =>
    imgs.map((img) => img.getAttribute('src')),
  );
}

test('CT11 - cada produto exibe uma imagem diferente', async ({ page }) => {
  await login(page, 'standard_user');

  const imagens = await caminhosDasImagens(page);

  expect(imagens).toHaveLength(6);
  expect(new Set(imagens).size).toBe(6); // 6 produtos, 6 imagens distintas
});

test('CT12 - [BUG-03] problem_user: todos os produtos exibem a mesma imagem', async ({ page }) => {
  test.fail(true, 'Defeito conhecido: BUG-03 em docs/bugs.md');
  await login(page, 'problem_user');

  const imagens = await caminhosDasImagens(page);

  expect(new Set(imagens).size).toBe(6);
});
