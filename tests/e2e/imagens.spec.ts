import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProdutosPage } from '../../pages/ProdutosPage';

/**
 * Imagens dos produtos — SauceDemo
 *
 * CT11 garante o comportamento correto: cada produto com a própria imagem.
 * CT12 reproduz o BUG-03 (docs/bugs.md): com o problem_user, todos os produtos exibem a mesma imagem.
 * Ele usa test.fail(): descreve o comportamento CORRETO e falha de propósito enquanto o defeito existir.
 * Se o defeito for corrigido, o Playwright avisa.
 */

test('CT11 - cada produto exibe uma imagem diferente', async ({ page }) => {
  await new LoginPage(page).entrarComSucesso('standard_user');

  const imagens = await new ProdutosPage(page).caminhosDasImagens();

  expect(imagens).toHaveLength(6);
  expect(new Set(imagens).size).toBe(6); // o Set descarta repetidos: 6 imagens distintas
});

test('CT12 - [BUG-03] problem_user: todos os produtos exibem a mesma imagem', async ({ page }) => {
  test.fail(true, 'Defeito conhecido: BUG-03 em docs/bugs.md');
  await new LoginPage(page).entrarComSucesso('problem_user');

  const imagens = await new ProdutosPage(page).caminhosDasImagens();

  expect(new Set(imagens).size).toBe(6);
});
