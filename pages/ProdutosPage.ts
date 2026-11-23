import { Page, Locator } from '@playwright/test';

/** Page Object da lista de produtos (inventory). */
export class ProdutosPage {
  readonly titulo: Locator;
  readonly contadorCarrinho: Locator;
  readonly linkCarrinho: Locator;
  readonly imagens: Locator;

  constructor(private readonly page: Page) {
    this.titulo = page.getByTestId('title');
    this.contadorCarrinho = page.getByTestId('shopping-cart-badge');
    this.linkCarrinho = page.getByTestId('shopping-cart-link');
    this.imagens = page.locator('img.inventory_item_img');
  }

  /** Exemplo: adicionar('sauce-labs-backpack') */
  async adicionar(produto: string) {
    await this.page.getByTestId(`add-to-cart-${produto}`).click();
  }

  async remover(produto: string) {
    await this.page.getByTestId(`remove-${produto}`).click();
  }

  async abrirCarrinho() {
    await this.linkCarrinho.click();
  }

  /** Endereço (src) de cada imagem de produto exibida na página. */
  async caminhosDasImagens(): Promise<(string | null)[]> {
    return this.imagens.evaluateAll((imgs) => imgs.map((img) => img.getAttribute('src')));
  }
}
