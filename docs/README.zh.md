<p align="center">
  <a href="https://webhookcatcher.com">
    <img src="https://raw.githubusercontent.com/WebhookCatcher/WebhookCatcher-Node/main/docs/images/logo.png" alt="WebhookCatcher" width="120" height="120">
  </a>
</p>

<h1 align="center">WebhookCatcher for n8n</h1>

<p align="center">
  使用 <a href="https://webhookcatcher.com">WebhookCatcher</a> 捕获、检查、保护并转发 webhooks，并在你的 <a href="https://n8n.io">n8n</a> workflows 中对其做出响应。
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
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.pt.md">Português</a> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.ja.md">日本語</a> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.ru.md">Русский</a> ·
  <b>中文</b>
</p>

---

此软件包为 n8n 添加了三个 nodes：

| Node | 功能 |
| :--- | :--- |
| **WebhookCatcher** | 管理 endpoints、forwarding targets、auth methods 和 webhook requests，查看账户用量和分析数据，并重新投递 requests。n8n AI Agents 也可以将其用作工具。 |
| **WebhookCatcher Trigger** | 每当 endpoint 收到 webhook 时，实时启动 workflow。需要一个可从互联网访问的 n8n 实例。 |
| **WebhookCatcher Polling Trigger** | 在存储了新的 requests 时启动 workflow。适用于运行在 localhost 或防火墙之后的 n8n。 |

## 目录

- [安装](#安装)
- [凭据](#凭据)
- [Token 权限](#token-权限)
- [WebhookCatcher node](#webhookcatcher-node)
- [WebhookCatcher Trigger](#webhookcatcher-trigger)
- [WebhookCatcher Polling Trigger](#webhookcatcher-polling-trigger)
- [我该使用哪个 trigger？](#我该使用哪个-trigger)
- [示例 workflows](#示例-workflows)
- [故障排查](#故障排查)
- [开发](#开发)
- [资源](#资源)

## 安装

### 通过 n8n 编辑器安装（推荐）

1. 打开 **Settings → Community Nodes**。
2. 点击 **Install**。
3. 输入 `@webhookcatcher/n8n-nodes-webhookcatcher` 并确认。
4. 在 nodes 面板中搜索 **WebhookCatcher**。

更多详情请参阅 [n8n community nodes 指南](https://docs.n8n.io/integrations/community-nodes/installation/)。

### 手动安装（自托管 n8n）

```bash
cd ~/.n8n/nodes
npm install @webhookcatcher/n8n-nodes-webhookcatcher
```

安装后请重启 n8n。使用 Docker 时，请在容器内（`/home/node/.n8n/nodes` 目录中）运行该命令，然后重启容器。

## 凭据

这些 nodes 使用 WebhookCatcher 的 **API token** 进行身份验证。

> [!NOTE]
> API 访问适用于 **Pro**、**Team** 和 **Business** 套餐。使用没有 API 访问权限的团队的 token 发出的 requests 会被拒绝，并返回 `403`。

1. 登录 [WebhookCatcher](https://webhookcatcher.com)。
2. 打开你的个人资料菜单 → **API Tokens**。
3. 输入名称（例如 `n8n`），并选择 workflows 所需的[权限](#token-权限)。
4. 复制 token。它只会显示一次。
5. 在 n8n 中创建一个 **WebhookCatcher API** 凭据：

| 字段 | 值 |
| :--- | :--- |
| **API Token** | 你刚刚创建的 token。 |
| **Base URL** | `https://webhookcatcher.com/api/v1`。仅在使用自托管的 WebhookCatcher 实例时才需要修改。 |

n8n 通过调用 `GET /account` 来测试凭据，因此 token 至少需要 `account:read` 权限。

token 属于创建时处于活动状态的团队。所有使用该凭据的 node 都会操作该团队的 endpoints 和 requests。

## Token 权限

请只为每个 token 授予其 workflows 所需的权限。

| 权限 | 允许的操作 |
| :--- | :--- |
| `account:read` | 账户、套餐、用量和分析数据。测试凭据时需要。 |
| `endpoints:read` | 列出和读取 endpoints。所有 endpoint 下拉列表都会用到。 |
| `endpoints:write` | 创建、更新和删除 endpoints。 |
| `forwarding-targets:read` | 列出和读取 forwarding targets。 |
| `forwarding-targets:write` | 创建、更新和删除 forwarding targets。 |
| `auth-methods:read` | 列出和读取 auth methods。 |
| `auth-methods:write` | 创建、更新、删除和重新生成 auth methods。 |
| `requests:read` | 列出和读取 webhook requests 及其 forwarding 投递记录。 |
| `requests:redeliver` | 重新投递（重放）webhook requests。 |
| `cli:tunnel` | 供 WebhookCatcher CLI 使用。在 n8n 中不需要。 |

各 node 使用的权限：

| Node / 操作 | 权限 |
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

在这些权限出现之前创建的 token 仍然有效：`read` 包含所有 `:read` 权限，`write` 包含创建、更新和删除，`*` 包含所有权限。

当 token 缺少某项权限时，API 会返回 `403` 和 `This API token does not have the "<permission>" permission.`，node 会显示该消息。

## WebhookCatcher node

| Resource | Operations |
| :--- | :--- |
| **Account** | Get（团队、套餐、功能、月度用量和 token 详情） · Get Analytics（日期范围） |
| **Endpoint** | Create · Get · Get Many · Update · Delete |
| **Forwarding Target** | Create · Get · Get Many · Update · Delete |
| **Auth Method** | Create · Get · Get Many · Update · Delete · Regenerate Credentials |
| **Request** | Get · Get Many · Get Deliveries · Redeliver |

### Endpoint

- **Create** 需要填写名称、路径、接受的 HTTP 方法，以及身份验证方式（`None`、`API Key`、`Basic Auth`、`Bearer Token` 或 `HMAC`）和用于验证的 auth method。附加字段：描述、启用状态和速率限制。
- **Update** 只会发送你设置的字段，endpoint 的其余部分保持不变。
- **Get Many** 支持 **Return All** 或 **Limit**，并可按启用状态筛选。

### Forwarding Target

将 endpoint 接受的每个 request 转发到另一个 URL。选项：HTTP 方法、目标地址的身份验证、自定义 headers、自动重试、启用状态、描述，以及 **payload filters**（仅当 payload 的某个字段满足条件时才转发）。

目标地址必须是公共 URL。私有、环回和链路本地地址会被拒绝，以防止 SSRF。

### Auth Method

创建 endpoints 用于验证传入 webhooks 的凭据：API key、Basic Auth（用户名和密码）、Bearer token 或 HMAC 密钥。**Regenerate Credentials** 会轮换生成的 token 或密钥，并返回新的值。

### Request

- **Get Many** 可按 endpoint、状态（`success`、`error`、`pending`、`timeout`）、HTTP 方法、响应码和日期范围筛选，并按从新到旧或从旧到新排序。
- **Get Deliveries** 返回某个 request 的所有 forwarding 尝试，包括状态码、耗时、错误和响应正文。
- **Redeliver** 将已存储的 request 重新发送到其 endpoint 的所有 forwarding targets、某一个 forwarding target，或自定义的公共 URL。

### 用作 AI Agent 工具

WebhookCatcher node 被标记为 `usableAsTool`。将它连接到 n8n **AI Agent**，即可让 agent 列出 endpoints、检查失败的 requests 或重新投递它们。

## WebhookCatcher Trigger

只要 endpoint 接受了一个 webhook，就立即启动 workflow。

1. 添加 **WebhookCatcher Trigger** node 并选择 endpoint。
2. 激活 workflow，或点击 **Listen for test event**。

激活时，node 会在该 endpoint 上创建一个 forwarding target。它指向 n8n 的 webhook URL，并发送一个随机的 `X-WebhookCatcher-Secret` header。n8n 会拒绝任何不带该密钥的调用，并返回 `401`。停用 workflow 时，该 forwarding target 会被删除。测试 URL 和生产 URL 使用各自独立的 forwarding targets。

输出：

```json
{
  "body": { "event": "invoice.paid", "id": "in_123" },
  "query": {},
  "headers": { "content-type": "application/json", "user-agent": "Stripe/1.0" },
  "receivedAt": "2026-10-08T15:04:05.000Z"
}
```

关闭 **Options → Include Headers** 后，将只输出 body 和 query。

> [!IMPORTANT]
> WebhookCatcher 必须能够访问你的 n8n 实例。请在 n8n 中将 `WEBHOOK_URL` 设置为其公共 URL。如果 n8n 运行在 `localhost`，请使用 Polling Trigger。

## WebhookCatcher Polling Trigger

按你选择的 polling 间隔（每分钟、每小时等）检查 WebhookCatcher 中是否有新的 requests。

- **Endpoint**：选择一个 endpoint，留空则表示所有 endpoints。
- **Filters → Status**：例如只获取 `error` requests，以便在 webhooks 被拒绝时收到通知。

首次激活时，node 从最新的 request 开始，不会重放历史记录。每次 polling 会输出自上次 polling 以来收到的 requests，按从旧到新排序，每次最多 500 个。其余的 requests 会在下一次 polling 中输出。

手动测试运行会返回最新的 request，方便你映射其字段。

## 我该使用哪个 trigger？

| | WebhookCatcher Trigger | WebhookCatcher Polling Trigger |
| :--- | :--- | :--- |
| 延迟 | 实时 | polling 间隔 |
| n8n 运行在 localhost 或私有网络 | ❌ | ✅ |
| 输出 | 原始的 body、query 和 headers | 已存储的 request（body、headers、状态、响应码、耗时等） |
| 被拒绝的 requests | 收不到，只转发被接受的 requests | 可以收到，请使用状态筛选 |
| 在 WebhookCatcher 中创建资源 | 激活期间会创建一个 forwarding target | 无 |

## 示例 workflows

- **Stripe → Slack**：Stripe endpoint 上的 WebhookCatcher Trigger → IF `body.type` 为 `invoice.payment_failed` → 发送 Slack 消息。
- **被拒绝 webhooks 的告警**：**Status = Error** 的 Polling Trigger → 发送包含 endpoint、响应码和错误信息的邮件或 Slack 消息。
- **重试失败的转发**：Schedule Trigger → Request: Get Many（状态为 `error`，最近一小时） → Request: Get Deliveries → Request: Redeliver。
- **每日用量报告**：Schedule Trigger → Account: Get 和 Get Analytics → Google Sheets。
- **客户入驻**：Form Trigger → Auth Method: Create → Endpoint: Create → Forwarding Target: Create → 将 URL 和凭据发送给客户。

## 故障排查

| 问题 | 解决方法 |
| :--- | :--- |
| `401 Unauthenticated` | token 错误、已过期或已被删除。请创建一个新的。 |
| `403 Your active plan does not support API access` | token 所属团队需要 Pro、Team 或 Business 套餐。 |
| `403 This API token does not have the "…" permission` | 在 WebhookCatcher → API Tokens 中编辑 token 的权限。 |
| 带有字段错误的 `422` | node 会显示每个字段的验证消息。请检查你发送的值。 |
| Trigger 一直不触发 | n8n 不是公开可访问的、未设置 `WEBHOOK_URL`，或者 endpoint 在转发之前就拒绝了该 webhook（请检查其身份验证）。请尝试 Polling Trigger。 |
| `URLs pointing to private or internal networks are not allowed.` | Forwarding targets 和重新投递不能使用私有或本地地址。 |
| 下拉列表为空 | token 需要相应的 `:read` 权限。 |

## 开发

环境要求：Node.js 20.19 或更高版本以及 npm。

```bash
git clone https://github.com/WebhookCatcher/WebhookCatcher-Node.git
cd WebhookCatcher-Node
npm install
npm run dev
```

`npm run dev` 会构建 nodes，在文件变更时重新构建，并在 <http://localhost:5678> 启动一个加载了该软件包的本地 n8n。

| npm script | make | 说明 |
| :--- | :--- | :--- |
| `npm run dev` | `make dev` | 启动加载了 nodes 的 n8n，并在文件变更时重新构建。 |
| `npm run build` | `make build` | 编译 TypeScript，并将图标复制到 `dist/`。 |
| `npm run build:watch` | `make watch` | 在文件变更时重新编译，但不启动 n8n。 |
| `npm run lint` | `make lint` | 使用 n8n community node 规则检查代码。 |
| `npm run lint:fix` | `make lint-fix` | 修复可自动修复的问题。 |
| `npm run format` | `make format` | 使用 Prettier 格式化代码。 |
| `npm run release` | `make release` | 升级版本号、更新 changelog、打标签并推送。 |

### 发布

[Publish workflow](../.github/workflows/publish.yml) 会将每个版本连同 provenance 声明一起发布到 npm，这是 n8n 对 community nodes 的要求。请在本地运行 `npm run release`：它会执行 lint、构建、升级版本号、创建标签并推送，随后由该 workflow 发布软件包。

请为 `WebhookCatcher/WebhookCatcher-Node` 和 `publish.yml` workflow 设置 npm **Trusted Publishing**，或者添加 `NPM_TOKEN` 仓库 secret。

### 项目结构

```text
credentials/
  WebhookCatcherApi.credentials.ts      API token and base URL
nodes/
  WebhookCatcher/                       Action node, shared API helpers and descriptions
  WebhookCatcherTrigger/                Real-time trigger (forwarding target + secret header)
  WebhookCatcherPollingTrigger/         Polling trigger (cursor on request ids)
docs/                                   Translated READMEs and images
```

## 资源

- [WebhookCatcher](https://webhookcatcher.com)
- [n8n community nodes 文档](https://docs.n8n.io/integrations/#community-nodes)
- [报告问题](https://github.com/WebhookCatcher/WebhookCatcher-Node/issues)
- 支持：[support@webhookcatcher.com](mailto:support@webhookcatcher.com)

## 许可证

[MIT](../LICENSE.md)
