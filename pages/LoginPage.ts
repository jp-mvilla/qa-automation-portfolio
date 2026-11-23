import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object da tela de login.
 * Concentra os seletores e as ações da página em um só lugar:
 * se a tela mudar, só este arquivo precisa ser atualizado.
 */
export class LoginPage {
  readonly usuario: Locator;
  readonly senha: Locator;
  readonly botaoEntrar: Locator;
  readonly mensagemErro: Locator;

  constructor(private readonly page: Page) {
    this.usuario = page.getByTestId('username');
    this.senha = page.getByTestId('password');
    this.botaoEntrar = page.getByTestId('login-button');
    this.mensagemErro = page.getByTestId('error');
  }

  async abrir() {
    await this.page.goto('/');
  }

  /** Campos passados como '' ficam em branco de propósito (cenários negativos). */
  async entrar(usuario: string, senha: string) {
    if (usuario) await this.usuario.fill(usuario);
    if (senha) await this.senha.fill(senha);
    await this.botaoEntrar.click();
  }

  /** Atalho para os testes que só precisam estar logados. */
  async entrarComSucesso(usuario = 'standard_user', senha = 'secret_sauce') {
    await this.abrir();
    await this.entrar(usuario, senha);
    await expect(this.page).toHaveURL(/inventory\.html/);
  }
}
