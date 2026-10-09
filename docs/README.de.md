<p align="center">
  <a href="https://webhookcatcher.com">
    <img src="https://raw.githubusercontent.com/WebhookCatcher/WebhookCatcher-Node/main/docs/images/logo.png" alt="WebhookCatcher" width="120" height="120">
  </a>
</p>

<h1 align="center">WebhookCatcher for n8n</h1>

<p align="center">
  Fange webhooks mit <a href="https://webhookcatcher.com">WebhookCatcher</a> ab, prüfe, sichere und leite sie weiter, und reagiere in deinen <a href="https://n8n.io">n8n</a> workflows darauf.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@webhookcatcher/n8n-nodes-webhookcatcher"><img src="https://img.shields.io/npm/v/@webhookcatcher/n8n-nodes-webhookcatcher.svg" alt="npm version"></a>
  <a href="../LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT license"></a>
  <a href="https://docs.n8n.io/integrations/community-nodes/"><img src="https://img.shields.io/badge/n8n-community%20node-ff6d5a.svg" alt="n8n community node"></a>
</p>

<p align="center">
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/README.md">English</a> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.es.md">Español</a> ·
  <b>Deutsch</b> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.fr.md">Français</a> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.pt.md">Português</a> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.ja.md">日本語</a> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.ru.md">Русский</a> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.zh.md">中文</a>
</p>

---

Dieses Paket fügt n8n vier nodes hinzu:

| Node | Was er tut |
| :--- | :--- |
| **WebhookCatcher** | Verwaltet endpoints, forwarding targets, auth methods und webhook requests, liest die Nutzung und die Analytics deines Accounts und stellt requests erneut zu. n8n AI Agents können ihn auch als Tool verwenden. |
| **WebhookCatcher Trigger** | Startet einen workflow in Echtzeit, sobald ein endpoint einen webhook erhält. Erfordert eine n8n-Instanz, die aus dem Internet erreichbar ist. |
| **WebhookCatcher Polling Trigger** | Startet einen workflow, wenn neue requests gespeichert werden. Funktioniert mit n8n auf localhost oder hinter einer Firewall. |
| **WebhookCatcher Event Trigger** | Startet einen workflow, wenn WebhookCatcher einen Alarm auslöst: eine fehlgeschlagene Zustellung, ein durch Rate Limit begrenzter request, ein Sicherheitsereignis oder eine Nutzungswarnung. |

## Inhalt

- [Installation](#installation)
- [Credentials](#credentials)
- [Token-Berechtigungen](#token-berechtigungen)
- [WebhookCatcher node](#webhookcatcher-node)
- [WebhookCatcher Trigger](#webhookcatcher-trigger)
- [WebhookCatcher Polling Trigger](#webhookcatcher-polling-trigger)
- [WebhookCatcher Event Trigger](#webhookcatcher-event-trigger)
- [Welchen Trigger soll ich verwenden?](#welchen-trigger-soll-ich-verwenden)
- [Beispiel-workflows](#beispiel-workflows)
- [Fehlerbehebung](#fehlerbehebung)
- [Entwicklung](#entwicklung)
- [Ressourcen](#ressourcen)

## Installation

### Über den n8n-Editor (empfohlen)

1. Öffne **Settings → Community Nodes**.
2. Klicke auf **Install**.
3. Gib `@webhookcatcher/n8n-nodes-webhookcatcher` ein und bestätige.
4. Suche im nodes-Panel nach **WebhookCatcher**.

Mehr Details findest du im [n8n community nodes guide](https://docs.n8n.io/integrations/community-nodes/installation/).

### Manuelle Installation (selbst gehostetes n8n)

```bash
cd ~/.n8n/nodes
npm install @webhookcatcher/n8n-nodes-webhookcatcher
```

Starte n8n nach der Installation neu. Mit Docker führst du den Befehl im Container aus (in `/home/node/.n8n/nodes`) und startest den Container neu.

## Credentials

Die nodes authentifizieren sich mit einem WebhookCatcher **API token**.

> [!NOTE]
> Der API-Zugriff ist in den Plänen **Pro**, **Team** und **Business** verfügbar. requests mit einem token eines Teams ohne API-Zugriff werden mit `403` abgelehnt.

1. Melde dich bei [WebhookCatcher](https://webhookcatcher.com) an.
2. Öffne dein Profilmenü → **API Tokens**.
3. Gib einen Namen ein (zum Beispiel `n8n`) und wähle die [Berechtigungen](#token-berechtigungen), die deine workflows brauchen.
4. Kopiere den token. Er wird nur einmal angezeigt.
5. Erstelle in n8n eine **WebhookCatcher API** credential:

| Field | Value |
| :--- | :--- |
| **API Token** | Der token, den du gerade erstellt hast. |
| **Base URL** | `https://webhookcatcher.com/api/v1`. Ändere sie nur für eine selbst gehostete WebhookCatcher-Instanz. |

n8n testet die credential mit einem Aufruf von `GET /account`. Der token braucht also mindestens die Berechtigung `account:read`.

Ein token gehört zu dem Team, das beim Erstellen aktiv war. Jeder node, der die credential verwendet, arbeitet mit den endpoints und requests dieses Teams.

## Token-Berechtigungen

Gib jedem token nur die Berechtigungen, die seine workflows brauchen.

| Permission | Allows |
| :--- | :--- |
| `account:read` | Account, Plan, Nutzung und Analytics. Erforderlich, um die credential zu testen. |
| `endpoints:read` | endpoints auflisten und lesen. Wird von jedem endpoint-Dropdown verwendet. |
| `endpoints:write` | endpoints erstellen, aktualisieren und löschen. |
| `forwarding-targets:read` | forwarding targets auflisten und lesen. |
| `forwarding-targets:write` | forwarding targets erstellen, aktualisieren und löschen. |
| `auth-methods:read` | auth methods auflisten und lesen. |
| `auth-methods:write` | auth methods erstellen, aktualisieren, löschen und neu generieren. |
| `requests:read` | webhook requests und ihre forwarding deliveries auflisten und lesen. |
| `requests:redeliver` | webhook requests erneut zustellen (Replay), einzeln oder gesammelt. |
| `requests:delete` | webhook requests löschen, einzeln oder gesammelt. |
| `events:read` | Abonnements für Alert-Events lesen. |
| `events:write` | Abonnements für Alert-Events erstellen, ändern und löschen. |
| `cli:tunnel` | Wird vom WebhookCatcher CLI verwendet. In n8n nicht nötig. |

Berechtigungen, die jeder node verwendet:

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
| Request → Redeliver, Redeliver Many | `requests:redeliver` |
| Request → Delete, Delete Many | `requests:delete` |
| WebhookCatcher Trigger | `endpoints:read`, `forwarding-targets:read`, `forwarding-targets:write` |
| WebhookCatcher Polling Trigger | `endpoints:read`, `requests:read` |
| WebhookCatcher Event Trigger | `events:read`, `events:write` |

Tokens, die vor diesen Berechtigungen erstellt wurden, funktionieren weiter: `read` erlaubt jede `:read`-Berechtigung, `write` erlaubt Erstellen, Aktualisieren und Löschen, und `*` erlaubt alles.

Fehlt einem token eine Berechtigung, antwortet die API mit `403` und `This API token does not have the "<permission>" permission.`. Der node zeigt diese Meldung an.

## WebhookCatcher node

| Resource | Operations |
| :--- | :--- |
| **Account** | Get (Team, Plan, Funktionen, monatliche Nutzung und token-Details) · Get Analytics (Zeitraum) |
| **Endpoint** | Create · Get · Get Many · Update · Delete |
| **Forwarding Target** | Create · Get · Get Many · Update · Delete |
| **Auth Method** | Create · Get · Get Many · Update · Delete · Regenerate Credentials |
| **Request** | Get · Get Many · Get Deliveries · Redeliver · Redeliver Many · Delete · Delete Many |

### Endpoint

- **Create** erwartet einen Namen, einen Pfad, die akzeptierte HTTP-Methode und die Authentifizierung (`None`, `API Key`, `Basic Auth`, `Bearer Token` oder `HMAC`) mit der auth method, die sie validiert. Zusätzliche Felder: Beschreibung, aktiver Status und rate limit.
- **Update** sendet nur die Felder, die du setzt. Der Rest des endpoints bleibt unverändert.
- **Get Many** unterstützt **Return All** oder ein **Limit** und filtert nach aktivem Status.
- **Response Status Code**, **Response Body** und **Response Headers** legen fest, was der Absender zurückbekommt, wenn ein webhook angenommen wird (standardmäßig `200` mit einem JSON-Body). Der Body kann mit den Platzhaltern `{{body.*}}`, `{{query.*}}` und `{{header.*}}` Werte des requests zurückgeben, zum Beispiel `{{body.challenge}}` für die URL-Verifizierung von Slack. Ohne `Content-Type`-header werden JSON-Bodies als `application/json` und alles andere als `text/plain` gesendet.

### Forwarding Target

Leitet jeden request, den ein endpoint akzeptiert, an eine andere URL weiter. Optionen: HTTP-Methode, Authentifizierung für das Ziel, eigene headers, automatische Wiederholungen, aktiver Status, Beschreibung und **payload filters** (nur weiterleiten, wenn ein Feld des payload eine Bedingung erfüllt).

Das Ziel muss eine öffentliche URL sein. Private, Loopback- und Link-Local-Adressen werden abgelehnt, um SSRF zu verhindern.

Hat das Target eine auth method, authentifiziert WebhookCatcher jeden weitergeleiteten request damit: `X-API-KEY` für API keys, `Authorization: Bearer …` oder `Authorization: Basic …`, oder `X-Timestamp` und `X-Signature` für HMAC (`hash_hmac('sha256', timestamp + body, secret)` über den exakt gesendeten body). Ist die auth method inaktiv oder abgelaufen, schlägt die Zustellung fehl, statt ohne Zugangsdaten gesendet zu werden. Setze **Authentication** auf `None`, um sie zu entfernen.

### Auth Method

Erstellt die Zugangsdaten, mit denen endpoints eingehende webhooks validieren: API key, Basic Auth (Benutzername und Passwort), Bearer token oder HMAC secret. **Regenerate Credentials** erneuert den generierten token oder das generierte secret und gibt den neuen Wert zurück.

### Request

- **Get Many** filtert nach endpoint, Status (`success`, `error`, `pending`, `timeout`), HTTP-Methode, Antwortcode und Zeitraum, sortiert mit den neuesten oder den ältesten zuerst.
- **Get Deliveries** gibt jeden Weiterleitungsversuch eines requests zurück, mit Statuscode, Dauer, Fehler und Antwort-body.
- **Redeliver** sendet einen gespeicherten request erneut an alle forwarding targets seines endpoints, an ein einzelnes forwarding target oder an eine eigene öffentliche URL.
- **Redeliver Many** sendet alle requests, die den Filtern (oder einer Liste von request-IDs) entsprechen, erneut, die ältesten zuerst, an die forwarding targets ihres endpoints oder an ein forwarding target. Der node arbeitet Batch für Batch (100 requests pro Aufruf), bis alle eingereiht sind, und gibt die IDs der erneut zugestellten requests zurück.
- **Delete** entfernt einen request samt seinen Weiterleitungsversuchen. **Delete Many** entfernt alle requests, die den Filtern oder einer Liste von request-IDs entsprechen. Mindestens ein Filter ist erforderlich, damit ein workflow nie versehentlich das gesamte Log leert.
- Jeder request enthält `body` (geparst) und `raw_body`: die exakt empfangenen Bytes, für XML, Klartext oder signierte payloads. `raw_body` ist `null`, wenn er mit `body` als JSON identisch ist.

### Als AI Agent Tool verwenden

Der WebhookCatcher node ist als `usableAsTool` markiert. Hänge ihn an einen n8n **AI Agent**, damit der Agent endpoints auflisten, fehlgeschlagene requests prüfen oder erneut zustellen kann.

## WebhookCatcher Trigger

Startet den workflow, sobald ein endpoint einen webhook akzeptiert.

1. Füge den node **WebhookCatcher Trigger** hinzu und wähle den endpoint.
2. Aktiviere den workflow oder klicke auf **Listen for test event**.

Bei der Aktivierung erstellt der node ein forwarding target auf diesem endpoint. Es zeigt auf die n8n webhook URL und sendet einen zufälligen header `X-WebhookCatcher-Secret`. n8n lehnt jeden Aufruf ohne dieses secret mit `401` ab. Das forwarding target wird gelöscht, wenn du den workflow deaktivierst. Test- und Produktions-URLs erhalten getrennte forwarding targets.

Ausgabe:

```json
{
  "body": { "event": "invoice.paid", "id": "in_123" },
  "query": {},
  "headers": { "content-type": "application/json", "user-agent": "Stripe/1.0" },
  "receivedAt": "2026-10-08T15:04:05.000Z"
}
```

Deaktiviere **Options → Include Headers**, um nur body und query auszugeben.

Aktiviere **Options → Include Raw Body**, um zusätzlich `rawBody` auszugeben, den body genau so, wie er empfangen wurde. WebhookCatcher leitet die Originalbytes und den originalen `Content-Type` weiter, sodass XML-, Formular- und Klartext-webhooks unverändert ankommen.

> [!IMPORTANT]
> WebhookCatcher muss deine n8n-Instanz erreichen können. Setze `WEBHOOK_URL` in n8n auf die öffentliche URL. Für n8n auf `localhost` nutze den Polling Trigger.

## WebhookCatcher Event Trigger

Startet den workflow, wenn WebhookCatcher einen Alarm auslöst. Wähle die Events unter **Events** aus:

| Event | Wird gesendet, wenn |
| :--- | :--- |
| **Delivery Failed** (`webhook_failed`) | ein webhook nach allen Versuchen nicht an ein forwarding target zugestellt werden konnte. |
| **Rate Limited** (`rate_limited`) | ein endpoint requests abgelehnt hat, die sein Rate Limit überschritten haben. |
| **Security Event** (`security_events`) | ein request wegen fehlender oder ungültiger Zugangsdaten abgelehnt wurde, eine auth method erstellt, geändert, neu generiert oder gelöscht wurde oder ein endpoint gelöscht wurde. |
| **Monthly Usage Warning** (`monthly_usage_warning`) | das Team 80 % seines monatlichen webhook-Kontingents verbraucht hat, und erneut bei 100 %. |
| **Test Alert** (`test`) | du auf der Seite **Alerts** von WebhookCatcher auf **Send Test Alert** klickst. |

Rate-Limit-Events und Events zu abgelehnten Zugangsdaten werden höchstens einmal alle 5 Minuten pro endpoint gesendet, sodass eine Welle abgelehnter requests nur eine Ausführung startet.

Bei der Aktivierung erstellt der node ein Event-Abonnement, das auf die n8n-webhook-URL zeigt. WebhookCatcher signiert jedes Event mit `X-WebhookCatcher-Signature` (`HMAC-SHA256(secret, X-WebhookCatcher-Timestamp + body)`). n8n lehnt Events mit ungültiger Signatur oder die älter als 5 Minuten sind mit `401` ab. Das Abonnement wird gelöscht, wenn der workflow deaktiviert wird.

Ausgabe:

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

`data` für die anderen Events: `endpoint_id`, `endpoint_name`, `endpoint_path`, `status_code`, `error`, `method` und `ip` für durch Rate Limit begrenzte und nicht autorisierte requests, `action`, `auth_method_id`, `auth_type`, `endpoint_id` und `user` für Änderungen an auth methods und endpoints sowie `used`, `limit`, `percentage`, `threshold` und `month` für Nutzungswarnungen.

Es sind dieselben Events, die du per E-Mail, Slack oder Discord erhalten kannst. Der Event Trigger hängt nicht von diesen Alarm-Einstellungen ab.

> [!IMPORTANT]
> WebhookCatcher muss deine n8n-Instanz erreichen können. Setze `WEBHOOK_URL` in n8n auf die öffentliche URL.

## WebhookCatcher Polling Trigger

Prüft WebhookCatcher im gewählten Polling-Intervall auf neue requests (jede Minute, jede Stunde, …).

- **Endpoint**: ein endpoint oder leer für alle endpoints.
- **Filters → Status**: zum Beispiel nur `error` requests, um bei abgelehnten webhooks benachrichtigt zu werden.

Bei der ersten Aktivierung startet der node beim neuesten request und spielt den Verlauf nicht erneut ab. Jeder Poll gibt die requests aus, die seit dem vorherigen Poll eingegangen sind, die ältesten zuerst, bis zu 500 pro Poll. Übrige requests folgen im nächsten Poll.

Ein manueller Testlauf gibt den neuesten request zurück, damit du seine Felder zuordnen kannst.

## Welchen Trigger soll ich verwenden?

| | WebhookCatcher Trigger | WebhookCatcher Polling Trigger |
| :--- | :--- | :--- |
| Latenz | Echtzeit | Polling-Intervall |
| n8n auf localhost oder in einem privaten Netzwerk | ❌ | ✅ |
| Ausgabe | Ursprünglicher body, query und headers | Gespeicherter request (body, headers, Status, Antwortcode, Dauer, …) |
| Abgelehnte requests | Nicht empfangen, nur akzeptierte requests werden weitergeleitet | Empfangen, nutze den Status-Filter |
| Erstellt Ressourcen in WebhookCatcher | Ein forwarding target, solange er aktiv ist | Keine |

## Beispiel-workflows

- **Stripe → Slack**: WebhookCatcher Trigger auf deinem Stripe-endpoint → IF `body.type` ist `invoice.payment_failed` → Slack-Nachricht.
- **Alarm bei abgelehnten webhooks**: Polling Trigger mit **Status = Error** → E-Mail oder Slack-Nachricht mit endpoint, Antwortcode und Fehler.
- **Fehlgeschlagene Weiterleitungen wiederholen**: Schedule Trigger → Request: Get Many (Status `error`, letzte Stunde) → Request: Get Deliveries → Request: Redeliver.
- **Täglicher Nutzungsbericht**: Schedule Trigger → Account: Get und Get Analytics → Google Sheets.
- **Incident bei fehlgeschlagenen Zustellungen**: Event Trigger (Delivery Failed) → PagerDuty oder Slack → Request: Redeliver, sobald das Ziel wieder erreichbar ist.
- **Nutzungsalarm**: Event Trigger (Monthly Usage Warning) → E-Mail an den Account-Inhaber.
- **Datenaufbewahrung**: Schedule Trigger (täglich) → Request: Delete Many (Received Before: vor 30 Tagen).
- **Verifizierung einer Slack-App**: Endpoint: Create mit **Response Body** `{{body.challenge}}`.
- **Kunden-Onboarding**: Form Trigger → Auth Method: Create → Endpoint: Create → Forwarding Target: Create → URL und Zugangsdaten an den Kunden senden.

## Fehlerbehebung

| Problem | Solution |
| :--- | :--- |
| `401 Unauthenticated` | Der token ist falsch, abgelaufen oder gelöscht. Erstelle einen neuen. |
| `403 Your active plan does not support API access` | Das Team des tokens braucht den Plan Pro, Team oder Business. |
| `403 This API token does not have the "…" permission` | Bearbeite die token-Berechtigungen in WebhookCatcher → API Tokens. |
| `422` mit Feldfehlern | Der node zeigt die Validierungsmeldung jedes Felds an. Prüfe die Werte, die du sendest. |
| Der Trigger wird nie ausgelöst | n8n ist nicht öffentlich, `WEBHOOK_URL` ist nicht gesetzt oder der endpoint lehnt den webhook ab, bevor er ihn weiterleitet (prüfe seine Authentifizierung). Probiere den Polling Trigger. |
| Der Event Trigger wird nie ausgelöst | n8n ist nicht öffentlich oder `WEBHOOK_URL` ist nicht gesetzt. Klicke auf der Seite Alerts von WebhookCatcher auf **Send Test Alert**, um es zu prüfen. |
| `URLs pointing to private or internal networks are not allowed.` | forwarding targets und erneute Zustellungen dürfen keine privaten oder lokalen Adressen verwenden. |
| Dropdowns sind leer | Der token braucht die passende `:read`-Berechtigung. |

## Entwicklung

Voraussetzungen: Node.js 20.19 oder neuer und npm.

```bash
git clone https://github.com/WebhookCatcher/WebhookCatcher-Node.git
cd WebhookCatcher-Node
npm install
npm run dev
```

`npm run dev` baut die nodes, baut sie bei Änderungen neu und startet ein lokales n8n unter <http://localhost:5678> mit geladenem Paket.

| npm script | make | Description |
| :--- | :--- | :--- |
| `npm run dev` | `make dev` | Startet n8n mit den geladenen nodes und baut bei Änderungen neu. |
| `npm run build` | `make build` | Kompiliert TypeScript und kopiert die Icons nach `dist/`. |
| `npm run build:watch` | `make watch` | Kompiliert bei Änderungen neu, ohne n8n zu starten. |
| `npm run lint` | `make lint` | Prüft den Code mit den n8n community node Regeln. |
| `npm run lint:fix` | `make lint-fix` | Behebt die Probleme, die sich automatisch beheben lassen. |
| `npm run format` | `make format` | Formatiert den Code mit Prettier. |
| `npm run release` | `make release` | Erhöht die Version, aktualisiert das Changelog, setzt den Tag und pusht. |

### Release erstellen

Der [Publish workflow](../.github/workflows/publish.yml) veröffentlicht jedes Release auf npm mit einer Provenance-Bestätigung, die n8n für community nodes verlangt. Führe `npm run release` lokal aus: Es führt lint und build aus, erhöht die Version, erstellt den Tag und pusht ihn, und der workflow veröffentlicht das Paket.

Richte npm **Trusted Publishing** für `WebhookCatcher/WebhookCatcher-Node` mit dem workflow `publish.yml` ein oder füge ein Repository-Secret `NPM_TOKEN` hinzu.

### Projektstruktur

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

## Ressourcen

- [WebhookCatcher](https://webhookcatcher.com)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Report an issue](https://github.com/WebhookCatcher/WebhookCatcher-Node/issues)
- Support: [support@webhookcatcher.com](mailto:support@webhookcatcher.com)

## Lizenz

[MIT](../LICENSE.md)
