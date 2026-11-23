import { Page, Locator } from '@playwright/test';

/** Page Object do carrinho e das etapas do checkout. */
export class CheckoutPage {
  readonly itensCarrinho: Locator;
  readonly botaoCheckout: Locator;
  readonly nome: Locator;
  readonly sobrenome: Locator;
  readonly cep: Locator;
  readonly botaoContinuar: Locator;
  readonly mensagemErro: Locator;
  readonly subtotal: Locator;
  readonly imposto: Locator;
  readonly total: Locator;
  readonly botaoFinalizar: Locator;
  readonly mensagemConfirmacao: Locator;

  constructor(private readonly page: Page) {
    this.itensCarrinho = page.getByTestId('inventory-item');
    this.botaoCheckout = page.getByTestId('checkout');
    this.nome = page.getByTestId('firstName');
    this.sobrenome = page.getByTestId('lastName');
    this.cep = page.getByTestId('postalCode');
    this.botaoContinuar = page.getByTestId('continue');
    this.mensagemErro = page.getByTestId('error');
    this.subtotal = page.getByTestId('subtotal-label');
    this.imposto = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.botaoFinalizar = page.getByTestId('finish');
    this.mensagemConfirmacao = page.getByTestId('complete-header');
  }

  async iniciar() {
    await this.botaoCheckout.click();
  }

  /** Preenche os dados de entrega. Campos passados como '' ficam em branco de propósito. */
  async preencherEntrega(nome: string, sobrenome: string, cep: string) {
    if (nome) await this.nome.fill(nome);
    if (sobrenome) await this.sobrenome.fill(sobrenome);
    if (cep) await this.cep.fill(cep);
    await this.botaoContinuar.click();
  }

  async finalizar() {
    await this.botaoFinalizar.click();
  }
}
