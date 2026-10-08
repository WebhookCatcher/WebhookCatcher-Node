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

Este pacote adiciona três nodes ao n8n:

| Node | O que faz |
| :--- | :--- |
| **WebhookCatcher** | Gerencia endpoints, forwarding targets, auth methods e requests de webhook, consulta o uso e as analytics da sua conta e reenvia requests. Os AI Agents do n8n também podem usá-lo como ferramenta. |
| **WebhookCatcher Trigger** | Inicia um workflow em tempo real sempre que um endpoint recebe um webhook. Exige uma instância do n8n acessível pela internet. |
| **WebhookCatcher Polling Trigger** | Inicia um workflow quando novos requests são armazenados. Funciona com o n8n em localhost ou atrás de um firewall. |

## Conteúdo

- [Instalação](#instalação)
- [Credenciais](#credenciais)
- [Permissões do token](#permissões-do-token)
- [Node WebhookCatcher](#node-webhookcatcher)
- [WebhookCatcher Trigger](#webhookcatcher-trigger)
- [WebhookCatcher Polling Trigger](#webhookcatcher-polling-trigger)
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
| `requests:redeliver` | Reenviar (replay) requests de webhook. |
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
| Request → Redeliver | `requests:redeliver` |
| WebhookCatcher Trigger | `endpoints:read`, `forwarding-targets:read`, `forwarding-targets:write` |
| WebhookCatcher Polling Trigger | `endpoints:read`, `requests:read` |

Tokens criados antes da existência dessas permissões continuam funcionando: `read` permite todas as permissões `:read`, `write` permite criar, atualizar e excluir, e `*` permite tudo.

Quando um token não tem uma permissão, a API responde `403` com `This API token does not have the "<permission>" permission.` e o node exibe essa mensagem.

## Node WebhookCatcher

| Resource | Operations |
| :--- | :--- |
| **Account** | Get (equipe, plano, recursos, uso mensal e detalhes do token) · Get Analytics (intervalo de datas) |
| **Endpoint** | Create · Get · Get Many · Update · Delete |
| **Forwarding Target** | Create · Get · Get Many · Update · Delete |
| **Auth Method** | Create · Get · Get Many · Update · Delete · Regenerate Credentials |
| **Request** | Get · Get Many · Get Deliveries · Redeliver |

### Endpoint

- **Create** recebe um nome, um caminho, o método HTTP aceito e a autenticação (`None`, `API Key`, `Basic Auth`, `Bearer Token` ou `HMAC`) com o auth method que a valida. Campos adicionais: descrição, estado ativo e limite de taxa.
- **Update** envia apenas os campos que você definir. O restante do endpoint permanece como está.
- **Get Many** aceita **Return All** ou um **Limit** e filtra pelo estado ativo.

### Forwarding Target

Encaminha todo request que um endpoint aceita para outra URL. Opções: método HTTP, autenticação do destino, headers personalizados, novas tentativas automáticas, estado ativo, descrição e **payload filters** (encaminhar somente quando um campo do payload atende a uma condição).

O destino deve ser uma URL pública. Endereços privados, de loopback e link-local são rejeitados para evitar SSRF.

### Auth Method

Cria as credenciais que os endpoints usam para validar os webhooks recebidos: API key, Basic Auth (usuário e senha), Bearer token ou segredo HMAC. **Regenerate Credentials** troca o token ou segredo gerado e retorna o novo valor.

### Request

- **Get Many** filtra por endpoint, status (`success`, `error`, `pending`, `timeout`), método HTTP, código de resposta e intervalo de datas, ordenando dos mais novos ou dos mais antigos primeiro.
- **Get Deliveries** retorna cada tentativa de forwarding de um request, com seu código de status, duração, erro e corpo da resposta.
- **Redeliver** envia novamente um request armazenado para todos os forwarding targets do seu endpoint, para um forwarding target ou para uma URL pública personalizada.

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

> [!IMPORTANT]
> O WebhookCatcher precisa conseguir acessar a sua instância do n8n. Defina `WEBHOOK_URL` no n8n com a URL pública dela. Para o n8n em `localhost`, use o Polling Trigger.

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
- **Onboarding de clientes**: Form Trigger → Auth Method: Create → Endpoint: Create → Forwarding Target: Create → enviar a URL e as credenciais ao cliente.

## Solução de problemas

| Problema | Solução |
| :--- | :--- |
| `401 Unauthenticated` | O token está incorreto, expirou ou foi excluído. Crie um novo. |
| `403 Your active plan does not support API access` | A equipe do token precisa do plano Pro, Team ou Business. |
| `403 This API token does not have the "…" permission` | Edite as permissões do token em WebhookCatcher → API Tokens. |
| `422` com erros de campo | O node exibe a mensagem de validação de cada campo. Confira os valores que você envia. |
| O Trigger nunca dispara | O n8n não é público, `WEBHOOK_URL` não está definida ou o endpoint rejeita o webhook antes de encaminhá-lo (verifique a autenticação dele). Experimente o Polling Trigger. |
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
docs/                                   Translated READMEs and images
```

## Recursos

- [WebhookCatcher](https://webhookcatcher.com)
- [Documentação de community nodes do n8n](https://docs.n8n.io/integrations/#community-nodes)
- [Reportar um problema](https://github.com/WebhookCatcher/WebhookCatcher-Node/issues)
- Suporte: [support@webhookcatcher.com](mailto:support@webhookcatcher.com)

## Licença

[MIT](../LICENSE.md)
