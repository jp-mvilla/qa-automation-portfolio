import { test, expect, APIRequestContext } from '@playwright/test';

/**
 * API de reservas — Restful-Booker
 * Documentação da API: https://restful-booker.herokuapp.com/apidoc/index.html
 *
 * Cobre o CRUD completo (criar, consultar, atualizar, excluir),
 * autenticação e cenários negativos (sem token, reserva inexistente).
 */

// Dados de uma reserva válida, reaproveitados nos testes.
const novaReserva = {
  firstname: 'Joao',
  lastname: 'Villa',
  totalprice: 350,
  depositpaid: true,
  bookingdates: { checkin: '2026-12-10', checkout: '2026-12-15' },
  additionalneeds: 'Cafe da manha',
};

// Funções auxiliares: evitam repetir o mesmo código em vários testes.
async function gerarToken(request: APIRequestContext): Promise<string> {
  const resposta = await request.post('/auth', {
    data: { username: 'admin', password: 'password123' },
  });
  expect(resposta.ok()).toBeTruthy();
  const corpo = await resposta.json();
  return corpo.token;
}

async function criarReserva(request: APIRequestContext): Promise<number> {
  const resposta = await request.post('/booking', { data: novaReserva });
  expect(resposta.status()).toBe(200);
  const corpo = await resposta.json();
  return corpo.bookingid;
}

test('API01 - healthcheck: a API está no ar', async ({ request }) => {
  const resposta = await request.get('/ping');
  expect(resposta.status()).toBe(201); // a documentação define 201 para o /ping
});

test('API02 - autenticação com credenciais válidas retorna um token', async ({ request }) => {
  const token = await gerarToken(request);
  expect(token).toBeTruthy();
  expect(typeof token).toBe('string');
});

test('API03 - criar reserva (POST) retorna o id e os dados enviados', async ({ request }) => {
  const resposta = await request.post('/booking', { data: novaReserva });

  expect(resposta.status()).toBe(200);
  const corpo = await resposta.json();
  expect(corpo.bookingid).toEqual(expect.any(Number));
  expect(corpo.booking).toEqual(novaReserva); // o que voltou é igual ao que foi enviado
});

test('API04 - consultar reserva (GET) devolve os dados cadastrados', async ({ request }) => {
  const id = await criarReserva(request);

  const resposta = await request.get(`/booking/${id}`);

  expect(resposta.status()).toBe(200);
  expect(await resposta.json()).toEqual(novaReserva);
});

test('API05 - atualizar reserva (PUT) com token altera os dados', async ({ request }) => {
  const id = await criarReserva(request);
  const token = await gerarToken(request);
  const reservaAlterada = { ...novaReserva, totalprice: 500, additionalneeds: 'Estacionamento' };

  const resposta = await request.put(`/booking/${id}`, {
    headers: { Cookie: `token=${token}` },
    data: reservaAlterada,
  });

  expect(resposta.status()).toBe(200);
  expect(await resposta.json()).toEqual(reservaAlterada);
});

test('API06 - atualizar reserva sem token é bloqueado (403)', async ({ request }) => {
  const id = await criarReserva(request);

  const resposta = await request.put(`/booking/${id}`, { data: novaReserva });

  expect(resposta.status()).toBe(403);
});

test('API07 - excluir reserva (DELETE) e confirmar que ela não existe mais', async ({ request }) => {
  const id = await criarReserva(request);
  const token = await gerarToken(request);

  const exclusao = await request.delete(`/booking/${id}`, {
    headers: { Cookie: `token=${token}` },
  });
  expect(exclusao.status()).toBe(201); // ver BUG-02 em docs/bugs.md

  const consulta = await request.get(`/booking/${id}`);
  expect(consulta.status()).toBe(404);
});

test('API08 - consultar reserva inexistente retorna 404', async ({ request }) => {
  const resposta = await request.get('/booking/999999999');
  expect(resposta.status()).toBe(404);
});

test('API09 - [BUG-01] autenticação com senha inválida deveria retornar 401', async ({ request }) => {
  test.fail(true, 'Defeito conhecido: BUG-01 em docs/bugs.md (a API responde 200)');

  const resposta = await request.post('/auth', {
    data: { username: 'admin', password: 'senha_errada' },
  });

  expect(resposta.status()).toBe(401);
});
