<p align="center">
  <a href="https://webhookcatcher.com">
    <img src="https://raw.githubusercontent.com/WebhookCatcher/WebhookCatcher-Node/main/docs/images/logo.png" alt="WebhookCatcher" width="120" height="120">
  </a>
</p>

<h1 align="center">WebhookCatcher for n8n</h1>

<p align="center">
  Catch, inspect, secure and forward webhooks with <a href="https://webhookcatcher.com">WebhookCatcher</a>, and react to them in your <a href="https://n8n.io">n8n</a> workflows.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@webhookcatcher/n8n-nodes-webhookcatcher"><img src="https://img.shields.io/npm/v/@webhookcatcher/n8n-nodes-webhookcatcher.svg" alt="npm version"></a>
  <a href="LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT license"></a>
  <a href="https://docs.n8n.io/integrations/community-nodes/"><img src="https://img.shields.io/badge/n8n-community%20node-ff6d5a.svg" alt="n8n community node"></a>
</p>

<p align="center">
  <b>English</b> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.es.md">Español</a> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.de.md">Deutsch</a> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.fr.md">Français</a> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.pt.md">Português</a> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.ja.md">日本語</a> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.ru.md">Русский</a> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.zh.md">中文</a>
</p>

---

This package adds three nodes to n8n:

| Node | What it does |
| :--- | :--- |
| **WebhookCatcher** | Manage endpoints, forwarding targets, auth methods and webhook requests, read your account usage and analytics, and redeliver requests. n8n AI Agents can also use it as a tool. |
| **WebhookCatcher Trigger** | Starts a workflow in real time each time an endpoint receives a webhook. Needs an n8n instance reachable from the internet. |
| **WebhookCatcher Polling Trigger** | Starts a workflow when new requests are stored. Works with n8n on localhost or behind a firewall. |

## Contents

- [Installation](#installation)
- [Credentials](#credentials)
- [Token permissions](#token-permissions)
- [WebhookCatcher node](#webhookcatcher-node)
- [WebhookCatcher Trigger](#webhookcatcher-trigger)
- [WebhookCatcher Polling Trigger](#webhookcatcher-polling-trigger)
- [Which trigger should I use?](#which-trigger-should-i-use)
- [Example workflows](#example-workflows)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [Resources](#resources)

## Installation

### From the n8n editor (recommended)

1. Open **Settings → Community Nodes**.
2. Click **Install**.
3. Enter `@webhookcatcher/n8n-nodes-webhookcatcher` and confirm.
4. Search for **WebhookCatcher** in the nodes panel.

See the [n8n community nodes guide](https://docs.n8n.io/integrations/community-nodes/installation/) for more details.

### Manual installation (self-hosted n8n)

```bash
cd ~/.n8n/nodes
npm install @webhookcatcher/n8n-nodes-webhookcatcher
```

Restart n8n after installing. With Docker, run the command inside the container (in `/home/node/.n8n/nodes`) and restart the container.

## Credentials

The nodes authenticate with a WebhookCatcher **API token**.

> [!NOTE]
> API access is available on the **Pro**, **Team** and **Business** plans. Requests made with a token of a team without API access are rejected with `403`.

1. Sign in to [WebhookCatcher](https://webhookcatcher.com).
2. Open your profile menu → **API Tokens**.
3. Enter a name (for example `n8n`) and select the [permissions](#token-permissions) your workflows need.
4. Copy the token. It is shown only once.
5. In n8n, create a **WebhookCatcher API** credential:

| Field | Value |
| :--- | :--- |
| **API Token** | The token you just created. |
| **Base URL** | `https://webhookcatcher.com/api/v1`. Change it only for a self-hosted WebhookCatcher instance. |

n8n tests the credential by calling `GET /account`, so the token needs at least the `account:read` permission.

A token belongs to the team that was active when it was created. Every node that uses the credential works with that team's endpoints and requests.

## Token permissions

Give each token only the permissions its workflows need.

| Permission | Allows |
| :--- | :--- |
| `account:read` | Account, plan, usage and analytics. Required to test the credential. |
| `endpoints:read` | List and read endpoints. Used by every endpoint dropdown. |
| `endpoints:write` | Create, update and delete endpoints. |
| `forwarding-targets:read` | List and read forwarding targets. |
| `forwarding-targets:write` | Create, update and delete forwarding targets. |
| `auth-methods:read` | List and read auth methods. |
| `auth-methods:write` | Create, update, delete and regenerate auth methods. |
| `requests:read` | List and read webhook requests and their forwarding deliveries. |
| `requests:redeliver` | Redeliver (replay) webhook requests. |
| `cli:tunnel` | Used by the WebhookCatcher CLI. Not needed in n8n. |

Permissions used by each node:

| Node / operation | Permissions |
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

Tokens created before these permissions existed keep working: `read` allows every `:read` permission, `write` allows create, update and delete, and `*` allows everything.

When a token lacks a permission, the API answers `403` with `This API token does not have the "<permission>" permission.` and the node shows that message.

## WebhookCatcher node

| Resource | Operations |
| :--- | :--- |
| **Account** | Get (team, plan, features, monthly usage and token details) · Get Analytics (date range) |
| **Endpoint** | Create · Get · Get Many · Update · Delete |
| **Forwarding Target** | Create · Get · Get Many · Update · Delete |
| **Auth Method** | Create · Get · Get Many · Update · Delete · Regenerate Credentials |
| **Request** | Get · Get Many · Get Deliveries · Redeliver |

### Endpoint

- **Create** takes a name, a path, the accepted HTTP method and the authentication (`None`, `API Key`, `Basic Auth`, `Bearer Token` or `HMAC`) with the auth method that validates it. Additional fields: description, active state and rate limit.
- **Update** sends only the fields you set. The rest of the endpoint stays as it is.
- **Get Many** supports **Return All** or a **Limit**, and filters by active state.

### Forwarding Target

Forwards every request that an endpoint accepts to another URL. Options: HTTP method, authentication for the destination, custom headers, automatic retries, active state, description and **payload filters** (forward only when a field of the payload matches a condition).

The destination must be a public URL. Private, loopback and link-local addresses are rejected to prevent SSRF.

When the target has an auth method, WebhookCatcher authenticates each forwarded request with it: `X-API-KEY` for API keys, `Authorization: Bearer …` or `Authorization: Basic …`, or `X-Timestamp` and `X-Signature` for HMAC (`hash_hmac('sha256', timestamp + body, secret)` over the exact body sent). If the auth method is inactive or expired, the delivery fails instead of being sent without credentials. Set **Authentication** to `None` to remove it.

### Auth Method

Creates the credentials that endpoints use to validate incoming webhooks: API key, Basic Auth (username and password), Bearer token or HMAC secret. **Regenerate Credentials** rotates the generated token or secret and returns the new value.

### Request

- **Get Many** filters by endpoint, status (`success`, `error`, `pending`, `timeout`), HTTP method, response code and date range, sorted newest or oldest first.
- **Get Deliveries** returns every forwarding attempt of a request with its status code, duration, error and response body.
- **Redeliver** sends a stored request again to all forwarding targets of its endpoint, to one forwarding target, or to a custom public URL.
- Every request includes `body` (parsed) and `raw_body`: the exact bytes received, for XML, plain text or signed payloads. `raw_body` is `null` when it is identical to `body` encoded as JSON.

### Use as an AI Agent tool

The WebhookCatcher node is marked as `usableAsTool`. Attach it to an n8n **AI Agent** to let the agent list endpoints, inspect failed requests or redeliver them.

## WebhookCatcher Trigger

Starts the workflow as soon as an endpoint accepts a webhook.

1. Add the **WebhookCatcher Trigger** node and select the endpoint.
2. Activate the workflow, or click **Listen for test event**.

On activation the node creates a forwarding target on that endpoint. It points to the n8n webhook URL and sends a random `X-WebhookCatcher-Secret` header. n8n rejects any call without that secret with `401`. The forwarding target is deleted when the workflow is deactivated. Test and production URLs get separate forwarding targets.

Output:

```json
{
  "body": { "event": "invoice.paid", "id": "in_123" },
  "query": {},
  "headers": { "content-type": "application/json", "user-agent": "Stripe/1.0" },
  "receivedAt": "2026-10-08T15:04:05.000Z"
}
```

Turn off **Options → Include Headers** to output only the body and query.

Turn on **Options → Include Raw Body** to also output `rawBody`, the body exactly as it was received. WebhookCatcher forwards the original bytes and `Content-Type`, so XML, form and plain text webhooks arrive unchanged.

> [!IMPORTANT]
> WebhookCatcher must be able to reach your n8n instance. Set `WEBHOOK_URL` in n8n to its public URL. For n8n on `localhost`, use the Polling Trigger.

## WebhookCatcher Polling Trigger

Checks WebhookCatcher for new requests on the poll interval you choose (every minute, every hour, …).

- **Endpoint**: one endpoint, or empty for all endpoints.
- **Filters → Status**: for example only `error` requests, to get notified about rejected webhooks.

On first activation the node starts from the newest request and does not replay the history. Each poll emits the requests received since the previous poll, oldest first, up to 500 per poll. Any remaining requests are emitted in the next poll.

A manual test run returns the latest request so you can map its fields.

## Which trigger should I use?

| | WebhookCatcher Trigger | WebhookCatcher Polling Trigger |
| :--- | :--- | :--- |
| Latency | Real time | Poll interval |
| n8n on localhost or a private network | ❌ | ✅ |
| Output | Original body, query and headers | Stored request (body, headers, status, response code, duration, …) |
| Rejected requests | Not received, only accepted requests are forwarded | Received, use the status filter |
| Creates resources in WebhookCatcher | A forwarding target while active | None |

## Example workflows

- **Stripe → Slack**: WebhookCatcher Trigger on your Stripe endpoint → IF `body.type` is `invoice.payment_failed` → Slack message.
- **Alert on rejected webhooks**: Polling Trigger with **Status = Error** → email or Slack message with the endpoint, response code and error.
- **Retry failed forwards**: Schedule Trigger → Request: Get Many (status `error`, last hour) → Request: Get Deliveries → Request: Redeliver.
- **Daily usage report**: Schedule Trigger → Account: Get and Get Analytics → Google Sheets.
- **Customer onboarding**: Form Trigger → Auth Method: Create → Endpoint: Create → Forwarding Target: Create → send the URL and credentials to the customer.

## Troubleshooting

| Problem | Solution |
| :--- | :--- |
| `401 Unauthenticated` | The token is wrong, expired or deleted. Create a new one. |
| `403 Your active plan does not support API access` | The token's team needs the Pro, Team or Business plan. |
| `403 This API token does not have the "…" permission` | Edit the token permissions in WebhookCatcher → API Tokens. |
| `422` with field errors | The node shows the validation message of each field. Check the values you send. |
| The Trigger never fires | n8n is not public, `WEBHOOK_URL` is not set, or the endpoint rejects the webhook before forwarding it (check its authentication). Try the Polling Trigger. |
| `URLs pointing to private or internal networks are not allowed.` | Forwarding targets and redeliveries cannot use private or local addresses. |
| Dropdowns are empty | The token needs the matching `:read` permission. |

## Development

Requirements: Node.js 20.19 or later and npm.

```bash
git clone https://github.com/WebhookCatcher/WebhookCatcher-Node.git
cd WebhookCatcher-Node
npm install
npm run dev
```

`npm run dev` builds the nodes, rebuilds them on change and starts a local n8n at <http://localhost:5678> with the package loaded.

| npm script | make | Description |
| :--- | :--- | :--- |
| `npm run dev` | `make dev` | Start n8n with the nodes loaded and rebuild on change. |
| `npm run build` | `make build` | Compile TypeScript and copy the icons into `dist/`. |
| `npm run build:watch` | `make watch` | Recompile on change without starting n8n. |
| `npm run lint` | `make lint` | Check the code with the n8n community node rules. |
| `npm run lint:fix` | `make lint-fix` | Fix the issues that can be fixed automatically. |
| `npm run format` | `make format` | Format the code with Prettier. |
| `npm run release` | `make release` | Bump the version, update the changelog, tag and push. |

### Releasing

The [Publish workflow](.github/workflows/publish.yml) publishes each release to npm with a provenance statement, which n8n requires for community nodes. Run `npm run release` locally: it lints, builds, bumps the version, creates the tag and pushes it, and the workflow publishes the package.

Set up npm **Trusted Publishing** for `WebhookCatcher/WebhookCatcher-Node` with the `publish.yml` workflow, or add an `NPM_TOKEN` repository secret.

### Project structure

```text
credentials/
  WebhookCatcherApi.credentials.ts      API token and base URL
nodes/
  WebhookCatcher/                       Action node, shared API helpers and descriptions
  WebhookCatcherTrigger/                Real-time trigger (forwarding target + secret header)
  WebhookCatcherPollingTrigger/         Polling trigger (cursor on request ids)
docs/                                   Translated READMEs and images
```

## Resources

- [WebhookCatcher](https://webhookcatcher.com)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Report an issue](https://github.com/WebhookCatcher/WebhookCatcher-Node/issues)
- Support: [support@webhookcatcher.com](mailto:support@webhookcatcher.com)

## License

[MIT](LICENSE.md)
