<p align="center">
  <a href="https://webhookcatcher.com">
    <img src="https://raw.githubusercontent.com/WebhookCatcher/WebhookCatcher-Node/main/docs/images/logo.png" alt="WebhookCatcher" width="120" height="120">
  </a>
</p>

<h1 align="center">WebhookCatcher for n8n</h1>

<p align="center">
  Capture, inspecione, proteja e encaminhe webhooks com o <a href="https://webhookcatcher.com">WebhookCatcher</a> e reaja a eles nos seus workflows do <a href="https://n8n.io">n8n</a>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@webhookcatcher/n8n-nodes-webhookcatcher"><img src="https://img.shields.io/npm/v/@webhookcatcher/n8n-nodes-webhookcatcher.svg" alt="npm version"></a>
  <a href="../LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT license"></a>
  <a href="https://docs.n8n.io/integrations/community-nodes/"><img src="https://img.shields.io/badge/n8n-community%20node-ff6d5a.svg" alt="n8n community node"></a>
</p>

<p align="center">
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/README.md">English</a> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.es.md">Español</a> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.de.md">Deutsch</a> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.fr.md">Français</a> ·
  <b>Português</b> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.ja.md">日本語</a> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.ru.md">Русский</a> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.zh.md">中文</a>
</p>

---

Este pacote adiciona quatro nodes ao n8n:

| Node | O que faz |
| :--- | :--- |
| **WebhookCatcher** | Gerencia endpoints, forwarding targets, auth methods e requests de webhook, consulta o uso e as analytics da sua conta e reenvia requests. Os AI Agents do n8n também podem usá-lo como ferramenta. |
| **WebhookCatcher Trigger** | Inicia um workflow em tempo real sempre que um endpoint recebe um webhook. Exige uma instância do n8n acessível pela internet. |
| **WebhookCatcher Polling Trigger** | Inicia um workflow quando novos requests são armazenados. Funciona com o n8n em localhost ou atrás de um firewall. |
| **WebhookCatcher Event Trigger** | Inicia um workflow quando o WebhookCatcher gera um alerta: uma entrega com falha, um request com rate limit, um evento de segurança ou um aviso de uso. |

## Conteúdo

- [Instalação](#instalação)
- [Credenciais](#credenciais)
- [Permissões do token](#permissões-do-token)
- [Node WebhookCatcher](#node-webhookcatcher)
- [WebhookCatcher Trigger](#webhookcatcher-trigger)
- [WebhookCatcher Polling Trigger](#webhookcatcher-polling-trigger)
- [WebhookCatcher Event Trigger](#webhookcatcher-event-trigger)
- [Qual trigger devo usar?](#qual-trigger-devo-usar)
- [Workflows de exemplo](#workflows-de-exemplo)
- [Solução de problemas](#solução-de-problemas)
- [Desenvolvimento](#desenvolvimento)
- [Recursos](#recursos)

## Instalação

### Pelo editor do n8n (recomendado)

1. Abra **Settings → Community Nodes**.
2. Clique em **Install**.
3. Digite `@webhookcatcher/n8n-nodes-webhookcatcher` e confirme.
4. Procure por **WebhookCatcher** no painel de nodes.

Veja o [guia de community nodes do n8n](https://docs.n8n.io/integrations/community-nodes/installation/) para mais detalhes.

### Instalação manual (n8n auto-hospedado)

```bash
cd ~/.n8n/nodes
npm install @webhookcatcher/n8n-nodes-webhookcatcher
```

Reinicie o n8n após a instalação. Com Docker, execute o comando dentro do contêiner (em `/home/node/.n8n/nodes`) e reinicie o contêiner.

## Credenciais

Os nodes se autenticam com um **API token** do WebhookCatcher.

> [!NOTE]
> O acesso à API está disponível nos planos **Pro**, **Team** e **Business**. Requests feitos com um token de uma equipe sem acesso à API são rejeitados com `403`.

1. Entre no [WebhookCatcher](https://webhookcatcher.com).
2. Abra o menu do seu perfil → **API Tokens**.
3. Digite um nome (por exemplo `n8n`) e selecione as [permissões](#permissões-do-token) de que seus workflows precisam.
4. Copie o token. Ele é exibido apenas uma vez.
5. No n8n, crie uma credencial **WebhookCatcher API**:

| Campo | Valor |
| :--- | :--- |
| **API Token** | O token que você acabou de criar. |
| **Base URL** | `https://webhookcatcher.com/api/v1`. Altere apenas para uma instância auto-hospedada do WebhookCatcher. |

O n8n testa a credencial chamando `GET /account`, então o token precisa ao menos da permissão `account:read`.

Um token pertence à equipe que estava ativa quando ele foi criado. Todo node que usa a credencial trabalha com os endpoints e requests dessa equipe.

## Permissões do token

Dê a cada token apenas as permissões de que seus workflows precisam.

| Permissão | Permite |
| :--- | :--- |
| `account:read` | Conta, plano, uso e analytics. Necessária para testar a credencial. |
| `endpoints:read` | Listar e ler endpoints. Usada por todos os menus suspensos de endpoint. |
| `endpoints:write` | Criar, atualizar e excluir endpoints. |
| `forwarding-targets:read` | Listar e ler forwarding targets. |
| `forwarding-targets:write` | Criar, atualizar e excluir forwarding targets. |
| `auth-methods:read` | Listar e ler auth methods. |
| `auth-methods:write` | Criar, atualizar, excluir e regenerar auth methods. |
| `requests:read` | Listar e ler requests de webhook e suas entregas de forwarding. |
| `requests:redeliver` | Reenviar (replay) requests de webhook, um por um ou em lote. |
| `requests:delete` | Excluir requests de webhook, um por um ou em lote. |
| `events:read` | Ler as assinaturas de eventos de alerta. |
| `events:write` | Criar, atualizar e excluir assinaturas de eventos de alerta. |
| `cli:tunnel` | Usada pelo CLI do WebhookCatcher. Não é necessária no n8n. |

Permissões usadas por cada node:

| Node / operação | Permissões |
| :--- | :--- |
| Account → Get, Get Analytics | `account:read` |
| Endpoint → Get, Get Many | `endpoints:read` |
| Endpoint → Create, Update, Delete | `endpoints:write` |
| Forwarding Target → Get, Get Many | `forwarding-targets:read` |
| Forwarding Target → Create, Update, Delete | `forwarding-targets:write` |
| Auth Method → Get, Get Many | `auth-methods:read` |
| Auth Method → Create, Update, Delete, Regenerate Credentials | `auth-methods:write` |
| Request → Get, Get Many, Get Deliveries | `requests:read` |
| Request → Redeliver, Redeliver Many | `requests:redeliver` |
| Request → Delete, Delete Many | `requests:delete` |
| WebhookCatcher Trigger | `endpoints:read`, `forwarding-targets:read`, `forwarding-targets:write` |
| WebhookCatcher Polling Trigger | `endpoints:read`, `requests:read` |
| WebhookCatcher Event Trigger | `events:read`, `events:write` |

Tokens criados antes da existência dessas permissões continuam funcionando: `read` permite todas as permissões `:read`, `write` permite criar, atualizar e excluir, e `*` permite tudo.

Quando um token não tem uma permissão, a API responde `403` com `This API token does not have the "<permission>" permission.` e o node exibe essa mensagem.

## Node WebhookCatcher

| Resource | Operations |
| :--- | :--- |
| **Account** | Get (equipe, plano, recursos, uso mensal e detalhes do token) · Get Analytics (intervalo de datas) |
| **Endpoint** | Create · Get · Get Many · Update · Delete |
| **Forwarding Target** | Create · Get · Get Many · Update · Delete |
| **Auth Method** | Create · Get · Get Many · Update · Delete · Regenerate Credentials |
| **Request** | Get · Get Many · Get Deliveries · Redeliver · Redeliver Many · Delete · Delete Many |

### Endpoint

- **Create** recebe um nome, um caminho, o método HTTP aceito e a autenticação (`None`, `API Key`, `Basic Auth`, `Bearer Token` ou `HMAC`) com o auth method que a valida. Campos adicionais: descrição, estado ativo e limite de taxa.
- **Update** envia apenas os campos que você definir. O restante do endpoint permanece como está.
- **Get Many** aceita **Return All** ou um **Limit** e filtra pelo estado ativo.
- **Response Status Code**, **Response Body** e **Response Headers** definem o que o remetente recebe quando um webhook é aceito (por padrão `200` com um body JSON). O body pode devolver valores do request com os placeholders `{{body.*}}`, `{{query.*}}` e `{{header.*}}`, por exemplo `{{body.challenge}}` para a verificação de URL do Slack. Sem um header `Content-Type`, bodies JSON são enviados como `application/json` e o resto como `text/plain`.

### Forwarding Target

Encaminha todo request que um endpoint aceita para outra URL. Opções: método HTTP, autenticação do destino, headers personalizados, novas tentativas automáticas, estado ativo, descrição e **payload filters** (encaminhar somente quando um campo do payload atende a uma condição).

O destino deve ser uma URL pública. Endereços privados, de loopback e link-local são rejeitados para evitar SSRF.

Quando o target tem um auth method, o WebhookCatcher autentica cada request encaminhado com ele: `X-API-KEY` para API keys, `Authorization: Bearer …` ou `Authorization: Basic …`, ou `X-Timestamp` e `X-Signature` para HMAC (`hash_hmac('sha256', timestamp + body, secret)` sobre o body exato enviado). Se o auth method estiver inativo ou expirado, a entrega falha em vez de ser enviada sem credenciais. Escolha `None` em **Authentication** para removê-lo.

### Auth Method

Cria as credenciais que os endpoints usam para validar os webhooks recebidos: API key, Basic Auth (usuário e senha), Bearer token ou segredo HMAC. **Regenerate Credentials** troca o token ou segredo gerado e retorna o novo valor.

### Request

- **Get Many** filtra por endpoint, status (`success`, `error`, `pending`, `timeout`), método HTTP, código de resposta e intervalo de datas, ordenando dos mais novos ou dos mais antigos primeiro.
- **Get Deliveries** retorna cada tentativa de forwarding de um request, com seu código de status, duração, erro e corpo da resposta.
- **Redeliver** envia novamente um request armazenado para todos os forwarding targets do seu endpoint, para um forwarding target ou para uma URL pública personalizada.
- **Redeliver Many** envia novamente todos os requests que correspondem aos filtros (ou a uma lista de IDs de requests), dos mais antigos para os mais novos, para os forwarding targets do seu endpoint ou para um forwarding target. O node avança lote por lote (100 requests por chamada) até colocar todos na fila e retorna os IDs dos requests reenviados.
- **Delete** remove um request com suas tentativas de forwarding. **Delete Many** remove todos os requests que correspondem aos filtros ou a uma lista de IDs de requests. É necessário pelo menos um filtro, para que um workflow nunca esvazie todo o log por engano.
- Cada request inclui `body` (interpretado) e `raw_body`: os bytes exatos recebidos, para XML, texto simples ou payloads assinados. `raw_body` é `null` quando é idêntico ao `body` codificado como JSON.

### Uso como ferramenta de AI Agent

O node WebhookCatcher está marcado como `usableAsTool`. Conecte-o a um **AI Agent** do n8n para que o agente liste endpoints, inspecione requests com falha ou os reenvie.

## WebhookCatcher Trigger

Inicia o workflow assim que um endpoint aceita um webhook.

1. Adicione o node **WebhookCatcher Trigger** e selecione o endpoint.
2. Ative o workflow ou clique em **Listen for test event**.

Na ativação, o node cria um forwarding target nesse endpoint. Ele aponta para a URL de webhook do n8n e envia um header `X-WebhookCatcher-Secret` aleatório. O n8n rejeita com `401` qualquer chamada sem esse segredo. O forwarding target é excluído quando o workflow é desativado. As URLs de teste e de produção têm forwarding targets separados.

Saída:

```json
{
  "body": { "event": "invoice.paid", "id": "in_123" },
  "query": {},
  "headers": { "content-type": "application/json", "user-agent": "Stripe/1.0" },
  "receivedAt": "2026-10-08T15:04:05.000Z"
}
```

Desative **Options → Include Headers** para obter apenas o body e a query.

Ative **Options → Include Raw Body** para incluir também `rawBody`, o body exatamente como foi recebido. O WebhookCatcher encaminha os bytes e o `Content-Type` originais, então webhooks XML, de formulário e de texto simples chegam sem alterações.

> [!IMPORTANT]
> O WebhookCatcher precisa conseguir acessar a sua instância do n8n. Defina `WEBHOOK_URL` no n8n com a URL pública dela. Para o n8n em `localhost`, use o Polling Trigger.

## WebhookCatcher Event Trigger

Inicia o workflow quando o WebhookCatcher gera um alerta. Selecione os eventos em **Events**:

| Evento | Enviado quando |
| :--- | :--- |
| **Delivery Failed** (`webhook_failed`) | Um webhook não pôde ser entregue a um forwarding target após todas as tentativas. |
| **Rate Limited** (`rate_limited`) | Um endpoint rejeitou requests que excederam o rate limit. |
| **Security Event** (`security_events`) | Um request foi rejeitado por credenciais ausentes ou inválidas, um auth method foi criado, atualizado, regenerado ou excluído, ou um endpoint foi excluído. |
| **Monthly Usage Warning** (`monthly_usage_warning`) | A equipe usou 80% da cota mensal de webhooks, e novamente ao chegar a 100%. |
| **Test Alert** (`test`) | Você clica em **Send Test Alert** na página **Alerts** do WebhookCatcher. |

Eventos de rate limit e de credenciais rejeitadas são enviados no máximo uma vez a cada 5 minutos por endpoint, então uma rajada de requests rejeitados inicia uma única execução.

Ao ser ativado, o node cria uma assinatura de eventos que aponta para a URL do webhook do n8n. O WebhookCatcher assina cada evento com `X-WebhookCatcher-Signature` (`HMAC-SHA256(secret, X-WebhookCatcher-Timestamp + body)`). O n8n rejeita com `401` eventos com assinatura inválida ou com mais de 5 minutos. A assinatura é excluída quando o workflow é desativado.

Saída:

```json
{
  "id": "0199c2a4-5f1e-7c3a-9d1b-2f4e6a8b0c1d",
  "event": "webhook_failed",
  "title": "Webhook Delivery Failed",
  "message": "Delivery to Billing failed: Server Error",
  "team": { "id": 1, "slug": "acme", "name": "Acme" },
  "data": {
    "webhook_request_id": "0199c2a4-...",
    "endpoint_id": "0199c2a0-...",
    "forwarding_target_id": "0199c2a1-...",
    "forwarding_target_name": "Billing",
    "url": "https://billing.example.com/hooks",
    "attempts": 4,
    "response_status": 500,
    "error": "Server Error"
  },
  "occurred_at": "2026-10-09T15:04:05+00:00"
}
```

`data` para os outros eventos: `endpoint_id`, `endpoint_name`, `endpoint_path`, `status_code`, `error`, `method` e `ip` para requests com rate limit ou não autorizados, `action`, `auth_method_id`, `auth_type`, `endpoint_id` e `user` para alterações em auth methods e endpoints, e `used`, `limit`, `percentage`, `threshold` e `month` para avisos de uso.

São os mesmos eventos que você pode receber por e-mail, Slack ou Discord. O event trigger não depende dessas configurações de alerta.

> [!IMPORTANT]
> O WebhookCatcher precisa conseguir acessar a sua instância do n8n. Defina `WEBHOOK_URL` no n8n com a URL pública dela.

## WebhookCatcher Polling Trigger

Verifica no WebhookCatcher se há novos requests no intervalo de polling que você escolher (a cada minuto, a cada hora, …).

- **Endpoint**: um endpoint, ou vazio para todos os endpoints.
- **Filters → Status**: por exemplo, apenas requests `error`, para ser notificado sobre webhooks rejeitados.

Na primeira ativação, o node parte do request mais recente e não reproduz o histórico. Cada polling emite os requests recebidos desde o polling anterior, do mais antigo ao mais novo, até 500 por polling. Os requests restantes são emitidos no polling seguinte.

Uma execução de teste manual retorna o request mais recente para que você possa mapear seus campos.

## Qual trigger devo usar?

| | WebhookCatcher Trigger | WebhookCatcher Polling Trigger |
| :--- | :--- | :--- |
| Latência | Tempo real | Intervalo de polling |
| n8n em localhost ou em uma rede privada | ❌ | ✅ |
| Saída | Body, query e headers originais | Request armazenado (body, headers, status, código de resposta, duração, …) |
| Requests rejeitados | Não são recebidos, apenas os requests aceitos são encaminhados | São recebidos, use o filtro de status |
| Cria recursos no WebhookCatcher | Um forwarding target enquanto estiver ativo | Nenhum |

## Workflows de exemplo

- **Stripe → Slack**: WebhookCatcher Trigger no seu endpoint do Stripe → IF `body.type` é `invoice.payment_failed` → mensagem no Slack.
- **Alerta de webhooks rejeitados**: Polling Trigger com **Status = Error** → e-mail ou mensagem no Slack com o endpoint, o código de resposta e o erro.
- **Nova tentativa de forwards com falha**: Schedule Trigger → Request: Get Many (status `error`, última hora) → Request: Get Deliveries → Request: Redeliver.
- **Relatório diário de uso**: Schedule Trigger → Account: Get e Get Analytics → Google Sheets.
- **Incidente em entregas com falha**: Event Trigger (Delivery Failed) → PagerDuty ou Slack → Request: Redeliver quando o destino voltar.
- **Alerta de uso**: Event Trigger (Monthly Usage Warning) → e-mail para o dono da conta.
- **Retenção de dados**: Schedule Trigger (diário) → Request: Delete Many (Received Before: 30 dias atrás).
- **Verificação de um app do Slack**: Endpoint: Create com **Response Body** `{{body.challenge}}`.
- **Onboarding de clientes**: Form Trigger → Auth Method: Create → Endpoint: Create → Forwarding Target: Create → enviar a URL e as credenciais ao cliente.

## Solução de problemas

| Problema | Solução |
| :--- | :--- |
| `401 Unauthenticated` | O token está incorreto, expirou ou foi excluído. Crie um novo. |
| `403 Your active plan does not support API access` | A equipe do token precisa do plano Pro, Team ou Business. |
| `403 This API token does not have the "…" permission` | Edite as permissões do token em WebhookCatcher → API Tokens. |
| `422` com erros de campo | O node exibe a mensagem de validação de cada campo. Confira os valores que você envia. |
| O Trigger nunca dispara | O n8n não é público, `WEBHOOK_URL` não está definida ou o endpoint rejeita o webhook antes de encaminhá-lo (verifique a autenticação dele). Experimente o Polling Trigger. |
| O Event Trigger nunca dispara | O n8n não é público ou `WEBHOOK_URL` não está definido. Clique em **Send Test Alert** na página Alerts do WebhookCatcher para verificar. |
| `URLs pointing to private or internal networks are not allowed.` | Forwarding targets e reenvios não podem usar endereços privados ou locais. |
| Os menus suspensos estão vazios | O token precisa da permissão `:read` correspondente. |

## Desenvolvimento

Requisitos: Node.js 20.19 ou superior e npm.

```bash
git clone https://github.com/WebhookCatcher/WebhookCatcher-Node.git
cd WebhookCatcher-Node
npm install
npm run dev
```

`npm run dev` compila os nodes, recompila ao detectar mudanças e inicia um n8n local em <http://localhost:5678> com o pacote carregado.

| npm script | make | Descrição |
| :--- | :--- | :--- |
| `npm run dev` | `make dev` | Inicia o n8n com os nodes carregados e recompila ao detectar mudanças. |
| `npm run build` | `make build` | Compila o TypeScript e copia os ícones para `dist/`. |
| `npm run build:watch` | `make watch` | Recompila ao detectar mudanças sem iniciar o n8n. |
| `npm run lint` | `make lint` | Verifica o código com as regras de community nodes do n8n. |
| `npm run lint:fix` | `make lint-fix` | Corrige os problemas que podem ser corrigidos automaticamente. |
| `npm run format` | `make format` | Formata o código com o Prettier. |
| `npm run release` | `make release` | Incrementa a versão, atualiza o changelog, cria a tag e faz o push. |

### Releasing

O [workflow Publish](../.github/workflows/publish.yml) publica cada release no npm com uma declaração de proveniência, que o n8n exige para community nodes. Execute `npm run release` localmente: ele executa o lint, compila, incrementa a versão, cria a tag e faz o push, e o workflow publica o pacote.

Configure o **Trusted Publishing** do npm para `WebhookCatcher/WebhookCatcher-Node` com o workflow `publish.yml`, ou adicione um secret de repositório `NPM_TOKEN`.

### Estrutura do projeto

```text
credentials/
  WebhookCatcherApi.credentials.ts      API token and base URL
nodes/
  WebhookCatcher/                       Action node, shared API helpers and descriptions
  WebhookCatcherTrigger/                Real-time trigger (forwarding target + secret header)
  WebhookCatcherPollingTrigger/         Polling trigger (cursor on request ids)
  WebhookCatcherEventTrigger/           Alert events trigger (signed event subscription)
docs/                                   Translated READMEs and images
```

## Recursos

- [WebhookCatcher](https://webhookcatcher.com)
- [Documentação de community nodes do n8n](https://docs.n8n.io/integrations/#community-nodes)
- [Reportar um problema](https://github.com/WebhookCatcher/WebhookCatcher-Node/issues)
- Suporte: [support@webhookcatcher.com](mailto:support@webhookcatcher.com)

## Licença

[MIT](../LICENSE.md)
