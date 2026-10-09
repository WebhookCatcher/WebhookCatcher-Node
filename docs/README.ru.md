<p align="center">
  <a href="https://webhookcatcher.com">
    <img src="https://raw.githubusercontent.com/WebhookCatcher/WebhookCatcher-Node/main/docs/images/logo.png" alt="WebhookCatcher" width="120" height="120">
  </a>
</p>

<h1 align="center">WebhookCatcher для n8n</h1>

<p align="center">
  Принимайте, проверяйте, защищайте и пересылайте webhooks с помощью <a href="https://webhookcatcher.com">WebhookCatcher</a> и реагируйте на них в ваших workflows <a href="https://n8n.io">n8n</a>.
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
  <b>Русский</b> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.zh.md">中文</a>
</p>

---

Этот пакет добавляет в n8n четыре nodes:

| Node | Что делает |
| :--- | :--- |
| **WebhookCatcher** | Управляет endpoints, forwarding targets, auth methods и webhook requests, показывает использование аккаунта и аналитику, повторно доставляет requests. n8n AI Agents также могут использовать его как инструмент. |
| **WebhookCatcher Trigger** | Запускает workflow в реальном времени каждый раз, когда endpoint получает webhook. Требует экземпляр n8n, доступный из интернета. |
| **WebhookCatcher Polling Trigger** | Запускает workflow, когда сохраняются новые requests. Работает с n8n на localhost или за межсетевым экраном. |
| **WebhookCatcher Event Trigger** | Запускает workflow, когда WebhookCatcher создаёт оповещение: неудачная доставка, request, отклонённый по rate limit, событие безопасности или предупреждение об использовании. |

## Содержание

- [Установка](#установка)
- [Учётные данные](#учётные-данные)
- [Разрешения token](#разрешения-token)
- [Node WebhookCatcher](#node-webhookcatcher)
- [WebhookCatcher Trigger](#webhookcatcher-trigger)
- [WebhookCatcher Polling Trigger](#webhookcatcher-polling-trigger)
- [WebhookCatcher Event Trigger](#webhookcatcher-event-trigger)
- [Какой trigger выбрать?](#какой-trigger-выбрать)
- [Примеры workflows](#примеры-workflows)
- [Решение проблем](#решение-проблем)
- [Разработка](#разработка)
- [Ресурсы](#ресурсы)

## Установка

### Из редактора n8n (рекомендуется)

1. Откройте **Settings → Community Nodes**.
2. Нажмите **Install**.
3. Введите `@webhookcatcher/n8n-nodes-webhookcatcher` и подтвердите.
4. Найдите **WebhookCatcher** на панели nodes.

Подробности смотрите в [руководстве n8n по community nodes](https://docs.n8n.io/integrations/community-nodes/installation/).

### Ручная установка (self-hosted n8n)

```bash
cd ~/.n8n/nodes
npm install @webhookcatcher/n8n-nodes-webhookcatcher
```

После установки перезапустите n8n. В Docker выполните команду внутри контейнера (в `/home/node/.n8n/nodes`) и перезапустите контейнер.

## Учётные данные

Nodes аутентифицируются с помощью **API token** WebhookCatcher.

> [!NOTE]
> Доступ к API есть на планах **Pro**, **Team** и **Business**. Requests с token команды без доступа к API отклоняются с кодом `403`.

1. Войдите в [WebhookCatcher](https://webhookcatcher.com).
2. Откройте меню профиля → **API Tokens**.
3. Введите имя (например, `n8n`) и выберите [разрешения](#разрешения-token), которые нужны вашим workflows.
4. Скопируйте token. Он показывается только один раз.
5. В n8n создайте credential **WebhookCatcher API**:

| Поле | Значение |
| :--- | :--- |
| **API Token** | Только что созданный token. |
| **Base URL** | `https://webhookcatcher.com/api/v1`. Меняйте его только для self-hosted экземпляра WebhookCatcher. |

n8n проверяет credential вызовом `GET /account`, поэтому token должен иметь как минимум разрешение `account:read`.

Token принадлежит команде, которая была активна при его создании. Каждый node, использующий этот credential, работает с endpoints и requests этой команды.

## Разрешения token

Давайте каждому token только те разрешения, которые нужны его workflows.

| Разрешение | Что позволяет |
| :--- | :--- |
| `account:read` | Аккаунт, план, использование и аналитика. Необходимо для проверки credential. |
| `endpoints:read` | Список и чтение endpoints. Используется во всех выпадающих списках endpoints. |
| `endpoints:write` | Создание, обновление и удаление endpoints. |
| `forwarding-targets:read` | Список и чтение forwarding targets. |
| `forwarding-targets:write` | Создание, обновление и удаление forwarding targets. |
| `auth-methods:read` | Список и чтение auth methods. |
| `auth-methods:write` | Создание, обновление, удаление и перегенерация auth methods. |
| `requests:read` | Список и чтение webhook requests и их доставок через forwarding. |
| `requests:redeliver` | Повторная доставка (replay) webhook requests по одному или пакетно. |
| `requests:delete` | Удаление webhook requests по одному или пакетно. |
| `events:read` | Чтение подписок на события оповещений. |
| `events:write` | Создание, изменение и удаление подписок на события оповещений. |
| `cli:tunnel` | Используется WebhookCatcher CLI. В n8n не нужно. |

Разрешения, которые используются каждым node:

| Node / операция | Разрешения |
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

Tokens, созданные до появления этих разрешений, продолжают работать: `read` разрешает все `:read`, `write` разрешает создание, обновление и удаление, а `*` разрешает всё.

Если у token нет нужного разрешения, API отвечает `403` и сообщением `This API token does not have the "<permission>" permission.`, а node показывает это сообщение.

## Node WebhookCatcher

| Resource | Операции |
| :--- | :--- |
| **Account** | Get (команда, план, возможности, ежемесячное использование и данные token) · Get Analytics (диапазон дат) |
| **Endpoint** | Create · Get · Get Many · Update · Delete |
| **Forwarding Target** | Create · Get · Get Many · Update · Delete |
| **Auth Method** | Create · Get · Get Many · Update · Delete · Regenerate Credentials |
| **Request** | Get · Get Many · Get Deliveries · Redeliver · Redeliver Many · Delete · Delete Many |

### Endpoint

- **Create** принимает имя, путь, допустимый HTTP-метод и аутентификацию (`None`, `API Key`, `Basic Auth`, `Bearer Token` или `HMAC`) вместе с auth method, который её проверяет. Дополнительные поля: описание, состояние активности и лимит частоты requests.
- **Update** отправляет только заданные вами поля. Остальные настройки endpoint не меняются.
- **Get Many** поддерживает **Return All** или **Limit** и фильтрует по состоянию активности.
- **Response Status Code**, **Response Body** и **Response Headers** задают, что получит отправитель, когда webhook принят (по умолчанию `200` с JSON body). Body может возвращать значения из request с помощью placeholders `{{body.*}}`, `{{query.*}}` и `{{header.*}}`, например `{{body.challenge}}` для проверки URL в Slack. Без header `Content-Type` JSON bodies отправляются как `application/json`, а всё остальное как `text/plain`.

### Forwarding Target

Пересылает на другой URL каждый request, который принимает endpoint. Параметры: HTTP-метод, аутентификация для адресата, собственные headers, автоматические повторы, состояние активности, описание и **payload filters** (пересылать, только если поле payload соответствует условию).

Адресат должен быть публичным URL. Частные, loopback и link-local адреса отклоняются для защиты от SSRF.

Если у target есть auth method, WebhookCatcher аутентифицирует им каждый пересылаемый request: `X-API-KEY` для API keys, `Authorization: Bearer …` или `Authorization: Basic …`, либо `X-Timestamp` и `X-Signature` для HMAC (`hash_hmac('sha256', timestamp + body, secret)` по точному отправляемому body). Если auth method неактивен или истёк, доставка завершается ошибкой, а не отправляется без учётных данных. Чтобы убрать его, выберите `None` в **Authentication**.

### Auth Method

Создаёт учётные данные, которыми endpoints проверяют входящие webhooks: API key, Basic Auth (имя пользователя и пароль), Bearer token или секрет HMAC. **Regenerate Credentials** заменяет сгенерированный token или секрет и возвращает новое значение.

### Request

- **Get Many** фильтрует по endpoint, статусу (`success`, `error`, `pending`, `timeout`), HTTP-методу, коду ответа и диапазону дат. Сортировка: сначала новые или сначала старые.
- **Get Deliveries** возвращает все попытки forwarding для request: код статуса, длительность, ошибку и тело ответа.
- **Redeliver** повторно отправляет сохранённый request на все forwarding targets его endpoint, на один forwarding target или на указанный публичный URL.
- **Redeliver Many** повторно отправляет все requests, подходящие под фильтры (или список ID requests), начиная со старых, на forwarding targets их endpoint или на один forwarding target. Node обрабатывает их пакет за пакетом (100 requests за вызов), пока все не будут поставлены в очередь, и возвращает ID повторно доставленных requests.
- **Delete** удаляет request вместе с его попытками пересылки. **Delete Many** удаляет все requests, подходящие под фильтры или список ID requests. Нужен хотя бы один фильтр, чтобы workflow никогда не очистил весь журнал по ошибке.
- Каждый request содержит `body` (разобранный) и `raw_body`: точные полученные байты для XML, простого текста или подписанных payload. `raw_body` равен `null`, если он совпадает с `body` в виде JSON.

### Использование как инструмента AI Agent

Node WebhookCatcher помечен как `usableAsTool`. Подключите его к n8n **AI Agent**, и агент сможет получать список endpoints, изучать неудачные requests или доставлять их повторно.

## WebhookCatcher Trigger

Запускает workflow, как только endpoint принимает webhook.

1. Добавьте node **WebhookCatcher Trigger** и выберите endpoint.
2. Активируйте workflow или нажмите **Listen for test event**.

При активации node создаёт на этом endpoint forwarding target. Он указывает на URL webhook n8n и отправляет случайный header `X-WebhookCatcher-Secret`. n8n отклоняет с кодом `401` любой вызов без этого секрета. Forwarding target удаляется при деактивации workflow. Для тестового и рабочего URL создаются отдельные forwarding targets.

Результат:

```json
{
  "body": { "event": "invoice.paid", "id": "in_123" },
  "query": {},
  "headers": { "content-type": "application/json", "user-agent": "Stripe/1.0" },
  "receivedAt": "2026-10-08T15:04:05.000Z"
}
```

Отключите **Options → Include Headers**, чтобы получать только body и query.

Включите **Options → Include Raw Body**, чтобы также выводить `rawBody` — body в точности как он был получен. WebhookCatcher пересылает исходные байты и `Content-Type`, поэтому XML, формы и webhooks с простым текстом приходят без изменений.

> [!IMPORTANT]
> WebhookCatcher должен иметь доступ к вашему экземпляру n8n. Задайте в n8n переменную `WEBHOOK_URL` с его публичным URL. Для n8n на `localhost` используйте Polling Trigger.

## WebhookCatcher Event Trigger

Запускает workflow, когда WebhookCatcher создаёт оповещение. Выберите события в **Events**:

| Событие | Когда отправляется |
| :--- | :--- |
| **Delivery Failed** (`webhook_failed`) | Webhook не удалось доставить на forwarding target после всех попыток. |
| **Rate Limited** (`rate_limited`) | Endpoint отклонил requests, превысившие его rate limit. |
| **Security Event** (`security_events`) | Request отклонён из-за отсутствующих или неверных учётных данных, auth method создан, изменён, перегенерирован или удалён, или endpoint удалён. |
| **Monthly Usage Warning** (`monthly_usage_warning`) | Команда использовала 80% месячной квоты webhooks, и ещё раз при 100%. |
| **Test Alert** (`test`) | Вы нажимаете **Send Test Alert** на странице **Alerts** в WebhookCatcher. |

События rate limit и отклонённых учётных данных отправляются не чаще одного раза в 5 минут для каждого endpoint, поэтому всплеск отклонённых requests запускает одно выполнение.

При активации node создаёт подписку на события, указывающую на URL webhook в n8n. WebhookCatcher подписывает каждое событие заголовком `X-WebhookCatcher-Signature` (`HMAC-SHA256(secret, X-WebhookCatcher-Timestamp + body)`). n8n отклоняет с `401` события с неверной подписью или старше 5 минут. Подписка удаляется при деактивации workflow.

Результат:

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

`data` для остальных событий: `endpoint_id`, `endpoint_name`, `endpoint_path`, `status_code`, `error`, `method` и `ip` для requests, отклонённых по rate limit или без авторизации, `action`, `auth_method_id`, `auth_type`, `endpoint_id` и `user` для изменений auth methods и endpoints, и `used`, `limit`, `percentage`, `threshold` и `month` для предупреждений об использовании.

Это те же события, которые можно получать по email, в Slack или Discord. Event trigger не зависит от этих настроек оповещений.

> [!IMPORTANT]
> WebhookCatcher должен иметь доступ к вашему экземпляру n8n. Задайте в n8n переменную `WEBHOOK_URL` с его публичным URL.

## WebhookCatcher Polling Trigger

Проверяет WebhookCatcher на наличие новых requests с выбранным вами интервалом polling (каждую минуту, каждый час и т. д.).

- **Endpoint**: один endpoint или пусто для всех endpoints.
- **Filters → Status**: например, только requests со статусом `error`, чтобы получать уведомления об отклонённых webhooks.

При первой активации node начинает с самого нового request и не воспроизводит историю. Каждый poll выдаёт requests, полученные с предыдущего poll, сначала самые старые, до 500 за poll. Оставшиеся requests выдаются в следующем poll.

Ручной тестовый запуск возвращает последний request, чтобы вы могли сопоставить его поля.

## Какой trigger выбрать?

| | WebhookCatcher Trigger | WebhookCatcher Polling Trigger |
| :--- | :--- | :--- |
| Задержка | Реальное время | Интервал polling |
| n8n на localhost или в частной сети | ❌ | ✅ |
| Результат | Исходные body, query и headers | Сохранённый request (body, headers, статус, код ответа, длительность, …) |
| Отклонённые requests | Не приходят, пересылаются только принятые requests | Приходят, используйте фильтр по статусу |
| Создаёт ресурсы в WebhookCatcher | Forwarding target на время активности | Нет |

## Примеры workflows

- **Stripe → Slack**: WebhookCatcher Trigger на вашем endpoint Stripe → IF `body.type` равно `invoice.payment_failed` → сообщение в Slack.
- **Оповещение об отклонённых webhooks**: Polling Trigger с **Status = Error** → письмо или сообщение в Slack с endpoint, кодом ответа и ошибкой.
- **Повтор неудачных пересылок**: Schedule Trigger → Request: Get Many (статус `error`, последний час) → Request: Get Deliveries → Request: Redeliver.
- **Ежедневный отчёт об использовании**: Schedule Trigger → Account: Get и Get Analytics → Google Sheets.
- **Инцидент при неудачных доставках**: Event Trigger (Delivery Failed) → PagerDuty или Slack → Request: Redeliver, когда получатель снова доступен.
- **Оповещение об использовании**: Event Trigger (Monthly Usage Warning) → письмо владельцу аккаунта.
- **Хранение данных**: Schedule Trigger (ежедневно) → Request: Delete Many (Received Before: 30 дней назад).
- **Проверка приложения Slack**: Endpoint: Create с **Response Body** `{{body.challenge}}`.
- **Подключение клиента**: Form Trigger → Auth Method: Create → Endpoint: Create → Forwarding Target: Create → отправка URL и учётных данных клиенту.

## Решение проблем

| Проблема | Решение |
| :--- | :--- |
| `401 Unauthenticated` | Token неверный, просрочен или удалён. Создайте новый. |
| `403 Your active plan does not support API access` | Команде token нужен план Pro, Team или Business. |
| `403 This API token does not have the "…" permission` | Измените разрешения token в WebhookCatcher → API Tokens. |
| `422` с ошибками полей | Node показывает сообщение проверки для каждого поля. Проверьте отправляемые значения. |
| Trigger никогда не срабатывает | n8n не публичный, не задан `WEBHOOK_URL` или endpoint отклоняет webhook до пересылки (проверьте его аутентификацию). Попробуйте Polling Trigger. |
| Event Trigger не срабатывает | n8n не доступен публично или не задан `WEBHOOK_URL`. Нажмите **Send Test Alert** на странице Alerts в WebhookCatcher, чтобы проверить. |
| `URLs pointing to private or internal networks are not allowed.` | Forwarding targets и повторные доставки не могут использовать частные или локальные адреса. |
| Выпадающие списки пусты | Token нужно соответствующее разрешение `:read`. |

## Разработка

Требования: Node.js 20.19 или новее и npm.

```bash
git clone https://github.com/WebhookCatcher/WebhookCatcher-Node.git
cd WebhookCatcher-Node
npm install
npm run dev
```

`npm run dev` собирает nodes, пересобирает их при изменениях и запускает локальный n8n по адресу <http://localhost:5678> с загруженным пакетом.

| Скрипт npm | make | Описание |
| :--- | :--- | :--- |
| `npm run dev` | `make dev` | Запускает n8n с загруженными nodes и пересборкой при изменениях. |
| `npm run build` | `make build` | Компилирует TypeScript и копирует иконки в `dist/`. |
| `npm run build:watch` | `make watch` | Перекомпилирует при изменениях без запуска n8n. |
| `npm run lint` | `make lint` | Проверяет код по правилам n8n для community nodes. |
| `npm run lint:fix` | `make lint-fix` | Исправляет проблемы, которые можно исправить автоматически. |
| `npm run format` | `make format` | Форматирует код с помощью Prettier. |
| `npm run release` | `make release` | Повышает версию, обновляет changelog, ставит тег и делает push. |

### Выпуск релиза

[Workflow Publish](../.github/workflows/publish.yml) публикует каждый релиз в npm с подтверждением происхождения (provenance), которое n8n требует для community nodes. Запустите `npm run release` локально: он выполняет lint и сборку, повышает версию, создаёт тег и отправляет его, а workflow публикует пакет.

Настройте npm **Trusted Publishing** для `WebhookCatcher/WebhookCatcher-Node` с workflow `publish.yml` или добавьте секрет репозитория `NPM_TOKEN`.

### Структура проекта

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

## Ресурсы

- [WebhookCatcher](https://webhookcatcher.com)
- [Документация n8n по community nodes](https://docs.n8n.io/integrations/#community-nodes)
- [Сообщить о проблеме](https://github.com/WebhookCatcher/WebhookCatcher-Node/issues)
- Поддержка: [support@webhookcatcher.com](mailto:support@webhookcatcher.com)

## Лицензия

[MIT](../LICENSE.md)
