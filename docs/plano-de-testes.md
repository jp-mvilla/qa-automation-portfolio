# Plano de testes

## 1. Objetivo
Validar as funcionalidades principais de uma loja virtual (SauceDemo) e de uma API REST de
reservas (Restful-Booker), com testes automatizados executados a cada alteração no repositório.

## 2. Escopo

**Dentro do escopo**
- SauceDemo: login, carrinho, checkout e exibição de produtos.
- Restful-Booker: autenticação e CRUD de reservas.

**Fora do escopo**
- Testes de performance e carga.
- Testes de segurança aprofundados.
- Outros navegadores além do Chromium.

## 3. Estratégia
- **Testes E2E (interface):** simulam o usuário no navegador com Playwright.
- **Testes de API:** requisições HTTP diretas, validando status code e corpo da resposta.
- **Testes independentes:** cada teste prepara os próprios dados (login no `beforeEach`,
  reserva criada no próprio teste) e não depende da ordem de execução.
- **Caminho feliz e caminhos de erro:** cada funcionalidade tem ao menos um cenário de sucesso
  e cenários de erro (campos obrigatórios, credenciais inválidas, falta de permissão).
- **Defeitos conhecidos:** reproduzidos com `test.fail()` e documentados em [bugs.md](bugs.md).

## 4. Técnicas de design de testes
- **Partição de equivalência:** no login, as entradas foram divididas em classes (válido, senha
  inválida, usuário bloqueado, usuário vazio, senha vazia), com um caso por classe.
- **Transição de estado:** carrinho (vazio → 1 item → 2 itens → remoção).
- **Validação de regra de negócio:** subtotal, imposto e total calculados no checkout.

## 5. Casos de teste

### E2E: SauceDemo
| ID | Cenário | Tipo | Resultado esperado |
|---|---|---|---|
| CT01 | Login com credenciais válidas | Positivo | Redireciona para a lista de produtos |
| CT02 | Login com senha incorreta | Negativo | Mensagem de credenciais inválidas |
| CT03 | Login com usuário bloqueado | Negativo | Mensagem de usuário bloqueado |
| CT04 | Login com usuário vazio | Negativo | "Username is required" |
| CT05 | Login com senha vazia | Negativo | "Password is required" |
| CT06 | Adicionar 2 produtos ao carrinho | Positivo | Contador mostra 1 e depois 2 |
| CT07 | Remover produto do carrinho | Positivo | Contador volta para 1 |
| CT08 | Compra completa | Positivo | Subtotal $39.98, imposto $3.20, total $43.18 e pedido confirmado |
| CT09 | Checkout sem nome | Negativo | "First Name is required" |
| CT10 | Checkout sem CEP | Negativo | "Postal Code is required" |
| CT11 | Imagens dos produtos (standard_user) | Positivo | 6 produtos com 6 imagens distintas |
| CT12 | Imagens dos produtos (problem_user) | Defeito | Reproduz o BUG-03 |

### API: Restful-Booker
| ID | Cenário | Tipo | Resultado esperado |
|---|---|---|---|
| API01 | Healthcheck (`GET /ping`) | Positivo | 201 |
| API02 | Autenticação válida | Positivo | Retorna token |
| API03 | Criar reserva (`POST`) | Positivo | 200, com id e os dados enviados |
| API04 | Consultar reserva (`GET`) | Positivo | 200, com os dados cadastrados |
| API05 | Atualizar com token (`PUT`) | Positivo | 200, com os dados alterados |
| API06 | Atualizar sem token | Negativo | 403 |
| API07 | Excluir e consultar novamente | Positivo | Exclusão aceita e consulta retorna 404 |
| API08 | Consultar reserva inexistente | Negativo | 404 |
| API09 | Autenticação com senha inválida | Defeito | Reproduz o BUG-01 |

## 6. Critérios de aceite
- Todos os testes passam no pipeline de CI.
- Todo defeito encontrado está registrado em [bugs.md](bugs.md) com passos, esperado x obtido e evidência.
