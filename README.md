# QA Automation Portfolio

[![Testes automatizados](https://github.com/jp-mvilla/qa-automation-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/jp-mvilla/qa-automation-portfolio/actions/workflows/playwright.yml)

Projeto de automação de testes **E2E** e de **API** com **Playwright + TypeScript**, coleção **Postman**
executada com **Newman** e pipeline de **CI no GitHub Actions**. Inclui plano de testes e relatórios de
defeitos reais encontrados durante a automação.

Sistemas testados (ambientes públicos criados para prática de QA):
- **[SauceDemo](https://www.saucedemo.com):** loja virtual (login, carrinho, checkout).
- **[Restful-Booker](https://restful-booker.herokuapp.com/apidoc/index.html):** API REST de reservas.

## O que tem aqui

| Área | Conteúdo |
|---|---|
| Testes E2E | 12 casos: login, carrinho, checkout com validação de valores e exibição de produtos |
| Testes de API | 9 casos: CRUD de reservas, autenticação por token e cenários negativos (403, 404) |
| Postman | Coleção com 8 requisições e 12 asserções, com variáveis encadeadas (token e id) |
| Documentação | [Plano de testes](docs/plano-de-testes.md) e [relatórios de defeitos](docs/bugs.md) com evidências |
| Boas práticas | Page Object Model, testes independentes, evidência automática em falhas, CI a cada push |

**3 defeitos encontrados e documentados** ([docs/bugs.md](docs/bugs.md)). Cada um tem um teste que o
reproduz, marcado com `test.fail()`: a suíte segue verde enquanto o defeito existir e avisa quando ele for corrigido.

## Tecnologias
- [Playwright](https://playwright.dev) + TypeScript
- Postman + [Newman](https://github.com/postmanlabs/newman)
- GitHub Actions

## Estrutura

```
├── pages/                  # Page Objects: seletores e ações de cada tela
│   ├── LoginPage.ts
│   ├── ProdutosPage.ts
│   └── CheckoutPage.ts
├── tests/
│   ├── e2e/                # testes de interface (SauceDemo)
│   └── api/                # testes de API (Restful-Booker)
├── postman/                # coleção Postman
├── docs/
│   ├── plano-de-testes.md
│   ├── bugs.md
│   └── evidencias/         # prints dos defeitos
└── .github/workflows/      # pipeline de CI
```

## Como rodar

Pré-requisito: [Node.js](https://nodejs.org) 18 ou superior.

```bash
npm install
npx playwright install chromium
```

| Comando | O que faz |
|---|---|
| `npm test` | Roda todos os testes do Playwright (E2E + API) |
| `npm run test:e2e` | Só os testes de interface |
| `npm run test:api` | Só os testes de API |
| `npm run test:postman` | Roda a coleção Postman pelo Newman |
| `npx playwright test --ui` | Modo visual, passo a passo |
| `npm run report` | Abre o relatório HTML da última execução |

## Técnicas de teste aplicadas
- **Partição de equivalência** nos cenários de login.
- **Transição de estado** no carrinho (adicionar e remover itens).
- **Validação de regra de negócio** no checkout (subtotal, imposto de 8% e total).
- **Caminho feliz e caminhos de erro** em cada funcionalidade.

## Uso de IA
Usei IA generativa (Claude) como apoio na criação deste projeto: para sugerir cenários de teste,
acelerar a escrita dos scripts e revisar a documentação. Os cenários, as execuções e a análise dos
defeitos foram conferidos manualmente.

## Autor
**João Pedro Marcosen Villa**, Software Engineer Jr
[LinkedIn](https://www.linkedin.com/in/joao-pedro-marcosen-villa)
