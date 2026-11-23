import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProdutosPage } from '../../pages/ProdutosPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

/**
 * Fluxo de compra — SauceDemo
 *
 * Cobre o caminho feliz (carrinho → checkout → pedido finalizado),
 * a conferência dos valores calculados e os caminhos de erro do formulário de entrega.
 */

const MOCHILA = 'sauce-labs-backpack'; // $29.99
const LANTERNA = 'sauce-labs-bike-light'; // $9.99

let produtos: ProdutosPage;
let checkout: CheckoutPage;

// Antes de cada teste: login, para todos começarem na lista de produtos.
test.beforeEach(async ({ page }) => {
  await new LoginPage(page).entrarComSucesso();
  produtos = new ProdutosPage(page);
  checkout = new CheckoutPage(page);
});

test('CT06 - adicionar produtos atualiza o contador do carrinho', async () => {
  await produtos.adicionar(MOCHILA);
  await expect(produtos.contadorCarrinho).toHaveText('1');

  await produtos.adicionar(LANTERNA);
  await expect(produtos.contadorCarrinho).toHaveText('2');
});

test('CT07 - remover produto do carrinho atualiza o contador', async () => {
  await produtos.adicionar(MOCHILA);
  await produtos.adicionar(LANTERNA);
  await produtos.remover(MOCHILA);

  await expect(produtos.contadorCarrinho).toHaveText('1');
});

test('CT08 - compra completa com conferência de subtotal, imposto e total', async () => {
  await produtos.adicionar(MOCHILA);
  await produtos.adicionar(LANTERNA);
  await produtos.abrirCarrinho();
  await expect(checkout.itensCarrinho).toHaveCount(2);

  await checkout.iniciar();
  await checkout.preencherEntrega('João', 'Villa', '15105-000');

  // $29.99 + $9.99 = $39.98; imposto de 8% = $3.20; total = $43.18
  await expect(checkout.subtotal).toHaveText('Item total: $39.98');
  await expect(checkout.imposto).toHaveText('Tax: $3.20');
  await expect(checkout.total).toHaveText('Total: $43.18');

  await checkout.finalizar();
  await expect(checkout.mensagemConfirmacao).toHaveText('Thank you for your order!');
});

test('CT09 - checkout sem nome exibe erro de campo obrigatório', async () => {
  await produtos.adicionar(MOCHILA);
  await produtos.abrirCarrinho();
  await checkout.iniciar();
  await checkout.preencherEntrega('', 'Villa', '15105-000');

  await expect(checkout.mensagemErro).toHaveText('Error: First Name is required');
});

test('CT10 - checkout sem CEP exibe erro de campo obrigatório', async () => {
  await produtos.adicionar(MOCHILA);
  await produtos.abrirCarrinho();
  await checkout.iniciar();
  await checkout.preencherEntrega('João', 'Villa', '');

  await expect(checkout.mensagemErro).toHaveText('Error: Postal Code is required');
});
