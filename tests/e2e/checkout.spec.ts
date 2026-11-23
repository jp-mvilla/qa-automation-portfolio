import { test, expect } from '@playwright/test';

/**
 * Fluxo de compra — SauceDemo
 *
 * Cobre o caminho principal (adicionar ao carrinho → checkout → pedido finalizado),
 * a conferência dos valores e as validações do formulário de entrega.
 */

// Antes de cada teste: faz login, para todos começarem já na lista de produtos.
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill('secret_sauce');
  await page.getByTestId('login-button').click();
  await expect(page).toHaveURL(/inventory\.html/);
});

test('CT06 - adicionar produtos atualiza o contador do carrinho', async ({ page }) => {
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

  await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('2');
});

test('CT07 - remover produto do carrinho atualiza o contador', async ({ page }) => {
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
  await page.getByTestId('remove-sauce-labs-backpack').click();

  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
});

test('CT08 - compra completa com conferência de subtotal, imposto e total', async ({ page }) => {
  // Mochila ($29.99) + Lanterna ($9.99) = $39.98
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await page.getByTestId('add-to-cart-sauce-labs-bike-light').click();

  // Carrinho: confere se os 2 itens estão lá
  await page.getByTestId('shopping-cart-link').click();
  await expect(page.getByTestId('inventory-item')).toHaveCount(2);
  await page.getByTestId('checkout').click();

  // Dados de entrega
  await page.getByTestId('firstName').fill('João');
  await page.getByTestId('lastName').fill('Villa');
  await page.getByTestId('postalCode').fill('15105-000');
  await page.getByTestId('continue').click();

  // Resumo: confere os valores calculados pelo sistema
  await expect(page.getByTestId('subtotal-label')).toHaveText('Item total: $39.98');
  await expect(page.getByTestId('tax-label')).toHaveText('Tax: $3.20');
  await expect(page.getByTestId('total-label')).toHaveText('Total: $43.18');

  // Finaliza o pedido
  await page.getByTestId('finish').click();
  await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
});

test('CT09 - checkout sem nome exibe erro de campo obrigatório', async ({ page }) => {
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await page.getByTestId('shopping-cart-link').click();
  await page.getByTestId('checkout').click();

  await page.getByTestId('lastName').fill('Villa');
  await page.getByTestId('postalCode').fill('15105-000');
  await page.getByTestId('continue').click();

  await expect(page.getByTestId('error')).toHaveText('Error: First Name is required');
});

test('CT10 - checkout sem CEP exibe erro de campo obrigatório', async ({ page }) => {
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await page.getByTestId('shopping-cart-link').click();
  await page.getByTestId('checkout').click();

  await page.getByTestId('firstName').fill('João');
  await page.getByTestId('lastName').fill('Villa');
  await page.getByTestId('continue').click();

  await expect(page.getByTestId('error')).toHaveText('Error: Postal Code is required');
});
