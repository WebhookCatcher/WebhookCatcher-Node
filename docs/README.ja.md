<p align="center">
  <a href="https://webhookcatcher.com">
    <img src="https://raw.githubusercontent.com/WebhookCatcher/WebhookCatcher-Node/main/docs/images/logo.png" alt="WebhookCatcher" width="120" height="120">
  </a>
</p>

<h1 align="center">WebhookCatcher for n8n</h1>

<p align="center">
  <a href="https://webhookcatcher.com">WebhookCatcher</a> で webhook を受信、確認、保護、転送し、<a href="https://n8n.io">n8n</a> の workflow からそれらに反応できます。
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
  <b>日本語</b> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.ru.md">Русский</a> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.zh.md">中文</a>
</p>

---

このパッケージは n8n に 3 つの node を追加します。

| Node | 機能 |
| :--- | :--- |
| **WebhookCatcher** | endpoint、forwarding target、auth method、webhook request の管理、アカウントの使用状況と analytics の確認、request の再配信ができます。n8n の AI Agent からツールとして使うこともできます。 |
| **WebhookCatcher Trigger** | endpoint が webhook を受信するたびに、リアルタイムで workflow を開始します。インターネットから到達可能な n8n インスタンスが必要です。 |
| **WebhookCatcher Polling Trigger** | 新しい request が保存されたときに workflow を開始します。localhost やファイアウォールの内側にある n8n でも動作します。 |

## 目次

- [インストール](#インストール)
- [認証情報](#認証情報)
- [token の権限](#token-の権限)
- [WebhookCatcher node](#webhookcatcher-node)
- [WebhookCatcher Trigger](#webhookcatcher-trigger)
- [WebhookCatcher Polling Trigger](#webhookcatcher-polling-trigger)
- [どちらの trigger を使うべきですか？](#どちらの-trigger-を使うべきですか)
- [workflow の例](#workflow-の例)
- [トラブルシューティング](#トラブルシューティング)
- [開発](#開発)
- [リソース](#リソース)

## インストール

### n8n エディターから(推奨)

1. **Settings → Community Nodes** を開きます。
2. **Install** をクリックします。
3. `@webhookcatcher/n8n-nodes-webhookcatcher` を入力して確定します。
4. node パネルで **WebhookCatcher** を検索します。

詳細は [n8n community nodes ガイド](https://docs.n8n.io/integrations/community-nodes/installation/)を参照してください。

### 手動インストール(セルフホストの n8n)

```bash
cd ~/.n8n/nodes
npm install @webhookcatcher/n8n-nodes-webhookcatcher
```

インストール後に n8n を再起動してください。Docker の場合は、コンテナ内(`/home/node/.n8n/nodes`)でコマンドを実行し、コンテナを再起動します。

## 認証情報

これらの node は WebhookCatcher の **API token** で認証します。

> [!NOTE]
> API へのアクセスは **Pro**、**Team**、**Business** プランで利用できます。API アクセスのないチームの token で行った request は `403` で拒否されます。

1. [WebhookCatcher](https://webhookcatcher.com) にサインインします。
2. プロフィールメニュー → **API Tokens** を開きます。
3. 名前(例: `n8n`)を入力し、workflow に必要な[権限](#token-の権限)を選択します。
4. token をコピーします。表示されるのは一度だけです。
5. n8n で **WebhookCatcher API** 認証情報を作成します。

| Field | 値 |
| :--- | :--- |
| **API Token** | 先ほど作成した token。 |
| **Base URL** | `https://webhookcatcher.com/api/v1`。セルフホストの WebhookCatcher インスタンスの場合のみ変更してください。 |

n8n は `GET /account` を呼び出して認証情報をテストするため、token には少なくとも `account:read` 権限が必要です。

token は、作成時にアクティブだったチームに属します。この認証情報を使うすべての node は、そのチームの endpoint と request を対象に動作します。

## token の権限

各 token には、workflow に必要な権限だけを付与してください。

| 権限 | 許可される操作 |
| :--- | :--- |
| `account:read` | アカウント、プラン、使用状況、analytics。認証情報のテストに必要です。 |
| `endpoints:read` | endpoint の一覧表示と取得。すべての endpoint ドロップダウンで使用されます。 |
| `endpoints:write` | endpoint の作成、更新、削除。 |
| `forwarding-targets:read` | forwarding target の一覧表示と取得。 |
| `forwarding-targets:write` | forwarding target の作成、更新、削除。 |
| `auth-methods:read` | auth method の一覧表示と取得。 |
| `auth-methods:write` | auth method の作成、更新、削除、再生成。 |
| `requests:read` | webhook request とその forwarding の配信結果の一覧表示と取得。 |
| `requests:redeliver` | webhook request の再配信(リプレイ)。 |
| `cli:tunnel` | WebhookCatcher CLI で使用されます。n8n では不要です。 |

各 node が使用する権限:

| Node / 操作 | 権限 |
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

これらの権限が導入される前に作成された token も引き続き使えます。`read` はすべての `:read` 権限を、`write` は作成、更新、削除を、`*` はすべてを許可します。

token に権限が不足している場合、API は `This API token does not have the "<permission>" permission.` という内容で `403` を返し、node にそのメッセージが表示されます。

## WebhookCatcher node

| Resource | Operations |
| :--- | :--- |
| **Account** | Get (チーム、プラン、機能、月間使用状況、token の詳細) · Get Analytics (日付範囲) |
| **Endpoint** | Create · Get · Get Many · Update · Delete |
| **Forwarding Target** | Create · Get · Get Many · Update · Delete |
| **Auth Method** | Create · Get · Get Many · Update · Delete · Regenerate Credentials |
| **Request** | Get · Get Many · Get Deliveries · Redeliver |

### Endpoint

- **Create** では、名前、パス、受け付ける HTTP メソッド、認証(`None`、`API Key`、`Basic Auth`、`Bearer Token`、`HMAC`)と、それを検証する auth method を指定します。追加フィールドとして、説明、有効状態、レート制限があります。
- **Update** は、設定したフィールドだけを送信します。endpoint のそれ以外の部分は変更されません。
- **Get Many** は **Return All** または **Limit** に対応し、有効状態で絞り込めます。

### Forwarding Target

endpoint が受け付けたすべての request を、別の URL に転送します。オプション: HTTP メソッド、転送先の認証、カスタム header、自動リトライ、有効状態、説明、**payload フィルター**(payload のフィールドが条件に一致する場合のみ転送)。

転送先は公開 URL である必要があります。SSRF を防ぐため、プライベートアドレス、ループバックアドレス、リンクローカルアドレスは拒否されます。

### Auth Method

endpoint が受信した webhook の検証に使う認証情報を作成します。API key、Basic Auth(ユーザー名とパスワード)、Bearer token、HMAC シークレットが使えます。**Regenerate Credentials** は、生成された token またはシークレットをローテーションし、新しい値を返します。

### Request

- **Get Many** は、endpoint、ステータス(`success`、`error`、`pending`、`timeout`)、HTTP メソッド、レスポンスコード、日付範囲で絞り込み、新しい順または古い順に並べ替えます。
- **Get Deliveries** は、request のすべての forwarding 試行を、ステータスコード、所要時間、エラー、レスポンス body とともに返します。
- **Redeliver** は、保存済みの request を、その endpoint のすべての forwarding target、いずれか 1 つの forwarding target、またはカスタムの公開 URL に再送します。

### AI Agent のツールとして使う

WebhookCatcher node には `usableAsTool` が設定されています。n8n の **AI Agent** に接続すると、エージェントが endpoint の一覧表示、失敗した request の確認、再配信を行えるようになります。

## WebhookCatcher Trigger

endpoint が webhook を受け付けると、すぐに workflow を開始します。

1. **WebhookCatcher Trigger** node を追加し、endpoint を選択します。
2. workflow を有効化するか、**Listen for test event** をクリックします。

有効化すると、node はその endpoint に forwarding target を作成します。この forwarding target は n8n の webhook URL を指し、ランダムな `X-WebhookCatcher-Secret` header を送信します。n8n はこのシークレットのない呼び出しをすべて `401` で拒否します。workflow を無効化すると、forwarding target は削除されます。テスト用 URL と本番用 URL では、別々の forwarding target が作成されます。

出力:

```json
{
  "body": { "event": "invoice.paid", "id": "in_123" },
  "query": {},
  "headers": { "content-type": "application/json", "user-agent": "Stripe/1.0" },
  "receivedAt": "2026-10-08T15:04:05.000Z"
}
```

**Options → Include Headers** をオフにすると、body と query のみが出力されます。

> [!IMPORTANT]
> WebhookCatcher から n8n インスタンスに到達できる必要があります。n8n の `WEBHOOK_URL` に公開 URL を設定してください。`localhost` 上の n8n では、Polling Trigger を使用してください。

## WebhookCatcher Polling Trigger

選択した polling 間隔(毎分、毎時など)で、WebhookCatcher に新しい request がないか確認します。

- **Endpoint**: 1 つの endpoint、または空欄ですべての endpoint。
- **Filters → Status**: たとえば `error` の request のみを対象にして、拒否された webhook の通知を受け取れます。

初回の有効化時、node は最新の request から開始し、過去の履歴は再生しません。各 polling では、前回の polling 以降に受信した request を古い順に、1 回あたり最大 500 件出力します。残りの request は次回の polling で出力されます。

手動のテスト実行では最新の request が返されるため、そのフィールドをマッピングできます。

## どちらの trigger を使うべきですか？

| | WebhookCatcher Trigger | WebhookCatcher Polling Trigger |
| :--- | :--- | :--- |
| レイテンシー | リアルタイム | polling 間隔 |
| localhost またはプライベートネットワーク上の n8n | ❌ | ✅ |
| 出力 | 元の body、query、header | 保存された request (body、header、ステータス、レスポンスコード、所要時間など) |
| 拒否された request | 受信されません。転送されるのは受け付けられた request のみです | 受信されます。ステータスフィルターを使用してください |
| WebhookCatcher 内にリソースを作成 | 有効な間は forwarding target | なし |

## workflow の例

- **Stripe → Slack**: Stripe の endpoint に WebhookCatcher Trigger → IF `body.type` が `invoice.payment_failed` → Slack メッセージ。
- **拒否された webhook のアラート**: **Status = Error** の Polling Trigger → endpoint、レスポンスコード、エラーを含むメールまたは Slack メッセージ。
- **失敗した転送の再試行**: Schedule Trigger → Request: Get Many (ステータス `error`、直近 1 時間) → Request: Get Deliveries → Request: Redeliver。
- **日次の使用状況レポート**: Schedule Trigger → Account: Get と Get Analytics → Google Sheets。
- **顧客のオンボーディング**: Form Trigger → Auth Method: Create → Endpoint: Create → Forwarding Target: Create → URL と認証情報を顧客に送信。

## トラブルシューティング

| 問題 | 解決方法 |
| :--- | :--- |
| `401 Unauthenticated` | token が誤っているか、期限切れまたは削除されています。新しい token を作成してください。 |
| `403 Your active plan does not support API access` | token のチームが Pro、Team、Business のいずれかのプランである必要があります。 |
| `403 This API token does not have the "…" permission` | WebhookCatcher → API Tokens で token の権限を編集してください。 |
| フィールドエラーを伴う `422` | node が各フィールドの検証メッセージを表示します。送信している値を確認してください。 |
| Trigger が発火しない | n8n が公開されていない、`WEBHOOK_URL` が未設定、または endpoint が転送前に webhook を拒否しています(その認証を確認してください)。Polling Trigger を試してください。 |
| `URLs pointing to private or internal networks are not allowed.` | forwarding target と再配信では、プライベートアドレスやローカルアドレスは使用できません。 |
| ドロップダウンが空 | token に対応する `:read` 権限が必要です。 |

## 開発

要件: Node.js 20.19 以降と npm。

```bash
git clone https://github.com/WebhookCatcher/WebhookCatcher-Node.git
cd WebhookCatcher-Node
npm install
npm run dev
```

`npm run dev` は node をビルドし、変更時に再ビルドして、パッケージを読み込んだローカルの n8n を <http://localhost:5678> で起動します。

| npm script | make | 説明 |
| :--- | :--- | :--- |
| `npm run dev` | `make dev` | node を読み込んだ n8n を起動し、変更時に再ビルドします。 |
| `npm run build` | `make build` | TypeScript をコンパイルし、アイコンを `dist/` にコピーします。 |
| `npm run build:watch` | `make watch` | n8n を起動せずに、変更時に再コンパイルします。 |
| `npm run lint` | `make lint` | n8n community node のルールでコードをチェックします。 |
| `npm run lint:fix` | `make lint-fix` | 自動修正できる問題を修正します。 |
| `npm run format` | `make format` | Prettier でコードをフォーマットします。 |
| `npm run release` | `make release` | バージョンを上げ、changelog を更新し、タグを付けて push します。 |

### リリース

[Publish workflow](../.github/workflows/publish.yml) は、n8n が community node に要求する provenance statement 付きで、各リリースを npm に公開します。ローカルで `npm run release` を実行すると、lint、ビルド、バージョンの更新、タグの作成と push が行われ、その後 workflow がパッケージを公開します。

`WebhookCatcher/WebhookCatcher-Node` に対して `publish.yml` workflow で npm の **Trusted Publishing** を設定するか、リポジトリのシークレットに `NPM_TOKEN` を追加してください。

### プロジェクト構成

```text
credentials/
  WebhookCatcherApi.credentials.ts      API token and base URL
nodes/
  WebhookCatcher/                       Action node, shared API helpers and descriptions
  WebhookCatcherTrigger/                Real-time trigger (forwarding target + secret header)
  WebhookCatcherPollingTrigger/         Polling trigger (cursor on request ids)
docs/                                   Translated READMEs and images
```

## リソース

- [WebhookCatcher](https://webhookcatcher.com)
- [n8n community nodes ドキュメント](https://docs.n8n.io/integrations/#community-nodes)
- [問題を報告する](https://github.com/WebhookCatcher/WebhookCatcher-Node/issues)
- サポート: [support@webhookcatcher.com](mailto:support@webhookcatcher.com)

## ライセンス

[MIT](../LICENSE.md)
