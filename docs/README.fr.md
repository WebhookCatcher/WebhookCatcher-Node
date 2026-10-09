<p align="center">
  <a href="https://webhookcatcher.com">
    <img src="https://raw.githubusercontent.com/WebhookCatcher/WebhookCatcher-Node/main/docs/images/logo.png" alt="WebhookCatcher" width="120" height="120">
  </a>
</p>

<h1 align="center">WebhookCatcher for n8n</h1>

<p align="center">
  Capturez, inspectez, sécurisez et transférez des webhooks avec <a href="https://webhookcatcher.com">WebhookCatcher</a>, et réagissez-y dans vos workflows <a href="https://n8n.io">n8n</a>.
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
  <b>Français</b> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.pt.md">Português</a> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.ja.md">日本語</a> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.ru.md">Русский</a> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.zh.md">中文</a>
</p>

---

Ce package ajoute quatre nodes à n8n :

| Node | Ce qu'il fait |
| :--- | :--- |
| **WebhookCatcher** | Gère les endpoints, les forwarding targets, les auth methods et les requests de webhook, lit l'usage et les analytics de votre compte, et redélivre des requests. Les n8n AI Agents peuvent aussi l'utiliser comme outil. |
| **WebhookCatcher Trigger** | Démarre un workflow en temps réel chaque fois qu'un endpoint reçoit un webhook. Nécessite une instance n8n accessible depuis Internet. |
| **WebhookCatcher Polling Trigger** | Démarre un workflow quand de nouvelles requests sont stockées. Fonctionne avec n8n sur localhost ou derrière un pare-feu. |
| **WebhookCatcher Event Trigger** | Démarre un workflow quand WebhookCatcher déclenche une alerte : une livraison en échec, une request limitée par le rate limit, un événement de sécurité ou une alerte d'utilisation. |

## Sommaire

- [Installation](#installation)
- [Identifiants](#identifiants)
- [Permissions du token](#permissions-du-token)
- [Node WebhookCatcher](#node-webhookcatcher)
- [WebhookCatcher Trigger](#webhookcatcher-trigger)
- [WebhookCatcher Polling Trigger](#webhookcatcher-polling-trigger)
- [WebhookCatcher Event Trigger](#webhookcatcher-event-trigger)
- [Quel trigger utiliser ?](#quel-trigger-utiliser-)
- [Exemples de workflows](#exemples-de-workflows)
- [Dépannage](#dépannage)
- [Développement](#développement)
- [Ressources](#ressources)

## Installation

### Depuis l'éditeur n8n (recommandé)

1. Ouvrez **Settings → Community Nodes**.
2. Cliquez sur **Install**.
3. Saisissez `@webhookcatcher/n8n-nodes-webhookcatcher` et confirmez.
4. Cherchez **WebhookCatcher** dans le panneau des nodes.

Consultez le [guide des community nodes n8n](https://docs.n8n.io/integrations/community-nodes/installation/) pour plus de détails.

### Installation manuelle (n8n auto-hébergé)

```bash
cd ~/.n8n/nodes
npm install @webhookcatcher/n8n-nodes-webhookcatcher
```

Redémarrez n8n après l'installation. Avec Docker, exécutez la commande dans le conteneur (dans `/home/node/.n8n/nodes`), puis redémarrez le conteneur.

## Identifiants

Les nodes s'authentifient avec un **API token** WebhookCatcher.

> [!NOTE]
> L'accès à l'API est disponible avec les offres **Pro**, **Team** et **Business**. Les requests faites avec le token d'une équipe sans accès à l'API sont rejetées avec `403`.

1. Connectez-vous à [WebhookCatcher](https://webhookcatcher.com).
2. Ouvrez le menu de votre profil → **API Tokens**.
3. Saisissez un nom (par exemple `n8n`) et sélectionnez les [permissions](#permissions-du-token) dont vos workflows ont besoin.
4. Copiez le token. Il n'est affiché qu'une seule fois.
5. Dans n8n, créez un identifiant **WebhookCatcher API** :

| Champ | Valeur |
| :--- | :--- |
| **API Token** | Le token que vous venez de créer. |
| **Base URL** | `https://webhookcatcher.com/api/v1`. Ne la modifiez que pour une instance WebhookCatcher auto-hébergée. |

n8n teste l'identifiant en appelant `GET /account`. Le token doit donc avoir au moins la permission `account:read`.

Un token appartient à l'équipe qui était active lors de sa création. Chaque node qui utilise l'identifiant travaille avec les endpoints et les requests de cette équipe.

## Permissions du token

Donnez à chaque token uniquement les permissions dont ses workflows ont besoin.

| Permission | Autorise |
| :--- | :--- |
| `account:read` | Compte, offre, usage et analytics. Requise pour tester l'identifiant. |
| `endpoints:read` | Lister et lire les endpoints. Utilisée par chaque liste déroulante d'endpoints. |
| `endpoints:write` | Créer, modifier et supprimer des endpoints. |
| `forwarding-targets:read` | Lister et lire les forwarding targets. |
| `forwarding-targets:write` | Créer, modifier et supprimer des forwarding targets. |
| `auth-methods:read` | Lister et lire les auth methods. |
| `auth-methods:write` | Créer, modifier, supprimer et régénérer des auth methods. |
| `requests:read` | Lister et lire les requests de webhook et leurs livraisons de forwarding. |
| `requests:redeliver` | Redélivrer (rejouer) des requests de webhook, une par une ou en lot. |
| `requests:delete` | Supprimer des requests de webhook, une par une ou en lot. |
| `events:read` | Lire les abonnements aux événements d'alerte. |
| `events:write` | Créer, modifier et supprimer des abonnements aux événements d'alerte. |
| `cli:tunnel` | Utilisée par le CLI WebhookCatcher. Inutile dans n8n. |

Permissions utilisées par chaque node :

| Node / opération | Permissions |
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

Les tokens créés avant l'existence de ces permissions continuent de fonctionner : `read` autorise chaque permission `:read`, `write` autorise la création, la modification et la suppression, et `*` autorise tout.

Quand une permission manque à un token, l'API répond `403` avec `This API token does not have the "<permission>" permission.` et le node affiche ce message.

## Node WebhookCatcher

| Resource | Operations |
| :--- | :--- |
| **Account** | Get (équipe, offre, fonctionnalités, usage mensuel et détails du token) · Get Analytics (plage de dates) |
| **Endpoint** | Create · Get · Get Many · Update · Delete |
| **Forwarding Target** | Create · Get · Get Many · Update · Delete |
| **Auth Method** | Create · Get · Get Many · Update · Delete · Regenerate Credentials |
| **Request** | Get · Get Many · Get Deliveries · Redeliver · Redeliver Many · Delete · Delete Many |

### Endpoint

- **Create** prend un nom, un chemin, la méthode HTTP acceptée et l'authentification (`None`, `API Key`, `Basic Auth`, `Bearer Token` ou `HMAC`) avec l'auth method qui la valide. Champs supplémentaires : description, état actif et limite de débit.
- **Update** n'envoie que les champs que vous définissez. Le reste de l'endpoint ne change pas.
- **Get Many** prend en charge **Return All** ou un **Limit**, et filtre par état actif.
- **Response Status Code**, **Response Body** et **Response Headers** définissent ce que l'expéditeur reçoit quand un webhook est accepté (par défaut `200` avec un body JSON). Le body peut renvoyer des valeurs de la request avec les placeholders `{{body.*}}`, `{{query.*}}` et `{{header.*}}`, par exemple `{{body.challenge}}` pour la vérification d'URL de Slack. Sans header `Content-Type`, les bodies JSON sont envoyés en `application/json` et tout le reste en `text/plain`.

### Forwarding Target

Transfère chaque request qu'un endpoint accepte vers une autre URL. Options : méthode HTTP, authentification de la destination, headers personnalisés, nouvelles tentatives automatiques, état actif, description et **filtres de payload** (ne transférer que si un champ du payload correspond à une condition).

La destination doit être une URL publique. Les adresses privées, de loopback et link-local sont rejetées pour empêcher le SSRF.

Lorsque le target a une auth method, WebhookCatcher authentifie chaque request transféré avec elle : `X-API-KEY` pour les API keys, `Authorization: Bearer …` ou `Authorization: Basic …`, ou `X-Timestamp` et `X-Signature` pour HMAC (`hash_hmac('sha256', timestamp + body, secret)` sur le body exact envoyé). Si l'auth method est inactive ou expirée, la livraison échoue au lieu d'être envoyée sans identifiants. Choisissez `None` dans **Authentication** pour la retirer.

### Auth Method

Crée les identifiants que les endpoints utilisent pour valider les webhooks entrants : API key, Basic Auth (nom d'utilisateur et mot de passe), Bearer token ou secret HMAC. **Regenerate Credentials** renouvelle le token ou le secret généré et renvoie la nouvelle valeur.

### Request

- **Get Many** filtre par endpoint, statut (`success`, `error`, `pending`, `timeout`), méthode HTTP, code de réponse et plage de dates, trié du plus récent au plus ancien ou inversement.
- **Get Deliveries** renvoie chaque tentative de forwarding d'une request avec son code de statut, sa durée, son erreur et le corps de la réponse.
- **Redeliver** renvoie une request stockée à tous les forwarding targets de son endpoint, à un seul forwarding target, ou à une URL publique personnalisée.
- **Redeliver Many** renvoie toutes les requests qui correspondent aux filtres (ou à une liste d'IDs de requests), de la plus ancienne à la plus récente, aux forwarding targets de leur endpoint ou à un seul forwarding target. Le node avance lot par lot (100 requests par appel) jusqu'à ce que toutes soient en file d'attente, et renvoie les IDs des requests redélivrées.
- **Delete** supprime une request avec ses tentatives de transfert. **Delete Many** supprime toutes les requests qui correspondent aux filtres ou à une liste d'IDs de requests. Au moins un filtre est requis, pour qu'un workflow ne puisse jamais vider tout le journal par erreur.
- Chaque request contient `body` (analysé) et `raw_body` : les octets exacts reçus, pour le XML, le texte brut ou les payloads signés. `raw_body` vaut `null` lorsqu'il est identique à `body` encodé en JSON.

### Utilisation comme outil d'AI Agent

Le node WebhookCatcher est marqué `usableAsTool`. Attachez-le à un **AI Agent** n8n pour que l'agent puisse lister les endpoints, inspecter les requests en échec ou les redélivrer.

## WebhookCatcher Trigger

Démarre le workflow dès qu'un endpoint accepte un webhook.

1. Ajoutez le node **WebhookCatcher Trigger** et sélectionnez l'endpoint.
2. Activez le workflow, ou cliquez sur **Listen for test event**.

À l'activation, le node crée un forwarding target sur cet endpoint. Il pointe vers l'URL du webhook n8n et envoie un header `X-WebhookCatcher-Secret` aléatoire. n8n rejette avec `401` tout appel sans ce secret. Le forwarding target est supprimé quand le workflow est désactivé. Les URL de test et de production ont chacune leur propre forwarding target.

Sortie :

```json
{
  "body": { "event": "invoice.paid", "id": "in_123" },
  "query": {},
  "headers": { "content-type": "application/json", "user-agent": "Stripe/1.0" },
  "receivedAt": "2026-10-08T15:04:05.000Z"
}
```

Désactivez **Options → Include Headers** pour ne sortir que le body et la query.

Activez **Options → Include Raw Body** pour obtenir aussi `rawBody`, le body exactement tel qu'il a été reçu. WebhookCatcher transfère les octets et le `Content-Type` d'origine : les webhooks XML, de formulaire et en texte brut arrivent sans modification.

> [!IMPORTANT]
> WebhookCatcher doit pouvoir joindre votre instance n8n. Définissez `WEBHOOK_URL` dans n8n avec son URL publique. Pour n8n sur `localhost`, utilisez le Polling Trigger.

## WebhookCatcher Event Trigger

Démarre le workflow quand WebhookCatcher déclenche une alerte. Sélectionnez les événements dans **Events** :

| Événement | Envoyé quand |
| :--- | :--- |
| **Delivery Failed** (`webhook_failed`) | Un webhook n'a pas pu être livré à un forwarding target après toutes ses tentatives. |
| **Rate Limited** (`rate_limited`) | Un endpoint a rejeté des requests qui dépassaient son rate limit. |
| **Security Event** (`security_events`) | Une request a été rejetée pour des identifiants manquants ou invalides, une auth method a été créée, modifiée, régénérée ou supprimée, ou un endpoint a été supprimé. |
| **Monthly Usage Warning** (`monthly_usage_warning`) | L'équipe a utilisé 80 % de son quota mensuel de webhooks, puis à nouveau à 100 %. |
| **Test Alert** (`test`) | Vous cliquez sur **Send Test Alert** dans la page **Alerts** de WebhookCatcher. |

Les événements de rate limit et d'identifiants rejetés sont envoyés au plus une fois toutes les 5 minutes par endpoint : une rafale de requests rejetées ne démarre qu'une exécution.

À l'activation, le node crée un abonnement aux événements qui pointe vers l'URL du webhook n8n. WebhookCatcher signe chaque événement avec `X-WebhookCatcher-Signature` (`HMAC-SHA256(secret, X-WebhookCatcher-Timestamp + body)`). n8n rejette avec `401` les événements dont la signature est invalide ou qui datent de plus de 5 minutes. L'abonnement est supprimé quand le workflow est désactivé.

Sortie :

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

`data` pour les autres événements : `endpoint_id`, `endpoint_name`, `endpoint_path`, `status_code`, `error`, `method` et `ip` pour les requests limitées par le rate limit ou non autorisées, `action`, `auth_method_id`, `auth_type`, `endpoint_id` et `user` pour les modifications d'auth methods et d'endpoints, et `used`, `limit`, `percentage`, `threshold` et `month` pour les alertes d'utilisation.

Ce sont les mêmes événements que ceux que vous pouvez recevoir par e-mail, Slack ou Discord. L'event trigger ne dépend pas de ces paramètres d'alerte.

> [!IMPORTANT]
> WebhookCatcher doit pouvoir joindre votre instance n8n. Définissez `WEBHOOK_URL` dans n8n avec son URL publique.

## WebhookCatcher Polling Trigger

Vérifie auprès de WebhookCatcher la présence de nouvelles requests selon l'intervalle de polling que vous choisissez (chaque minute, chaque heure, …).

- **Endpoint** : un endpoint, ou vide pour tous les endpoints.
- **Filters → Status** : par exemple uniquement les requests `error`, pour être averti des webhooks rejetés.

À la première activation, le node part de la request la plus récente et ne rejoue pas l'historique. Chaque polling émet les requests reçues depuis le polling précédent, de la plus ancienne à la plus récente, jusqu'à 500 par polling. Les requests restantes sont émises au polling suivant.

Une exécution de test manuelle renvoie la dernière request afin que vous puissiez mapper ses champs.

## Quel trigger utiliser ?

| | WebhookCatcher Trigger | WebhookCatcher Polling Trigger |
| :--- | :--- | :--- |
| Latence | Temps réel | Intervalle de polling |
| n8n sur localhost ou un réseau privé | ❌ | ✅ |
| Sortie | Body, query et headers d'origine | Request stockée (body, headers, statut, code de réponse, durée, …) |
| Requests rejetées | Non reçues, seules les requests acceptées sont transférées | Reçues, utilisez le filtre de statut |
| Crée des ressources dans WebhookCatcher | Un forwarding target tant qu'il est actif | Aucune |

## Exemples de workflows

- **Stripe → Slack** : WebhookCatcher Trigger sur votre endpoint Stripe → IF `body.type` vaut `invoice.payment_failed` → message Slack.
- **Alerte sur les webhooks rejetés** : Polling Trigger avec **Status = Error** → e-mail ou message Slack avec l'endpoint, le code de réponse et l'erreur.
- **Réessayer les forwards en échec** : Schedule Trigger → Request: Get Many (statut `error`, dernière heure) → Request: Get Deliveries → Request: Redeliver.
- **Rapport d'usage quotidien** : Schedule Trigger → Account: Get et Get Analytics → Google Sheets.
- **Incident sur les livraisons en échec** : Event Trigger (Delivery Failed) → PagerDuty ou Slack → Request: Redeliver une fois la destination rétablie.
- **Alerte d'utilisation** : Event Trigger (Monthly Usage Warning) → e-mail au propriétaire du compte.
- **Rétention des données** : Schedule Trigger (quotidien) → Request: Delete Many (Received Before : il y a 30 jours).
- **Vérification d'une app Slack** : Endpoint: Create avec **Response Body** `{{body.challenge}}`.
- **Intégration d'un client** : Form Trigger → Auth Method: Create → Endpoint: Create → Forwarding Target: Create → envoi de l'URL et des identifiants au client.

## Dépannage

| Problème | Solution |
| :--- | :--- |
| `401 Unauthenticated` | Le token est incorrect, expiré ou supprimé. Créez-en un nouveau. |
| `403 Your active plan does not support API access` | L'équipe du token doit avoir l'offre Pro, Team ou Business. |
| `403 This API token does not have the "…" permission` | Modifiez les permissions du token dans WebhookCatcher → API Tokens. |
| `422` avec des erreurs de champ | Le node affiche le message de validation de chaque champ. Vérifiez les valeurs que vous envoyez. |
| Le Trigger ne se déclenche jamais | n8n n'est pas public, `WEBHOOK_URL` n'est pas défini, ou l'endpoint rejette le webhook avant de le transférer (vérifiez son authentification). Essayez le Polling Trigger. |
| L'Event Trigger ne se déclenche jamais | n8n n'est pas public ou `WEBHOOK_URL` n'est pas défini. Cliquez sur **Send Test Alert** dans la page Alerts de WebhookCatcher pour le vérifier. |
| `URLs pointing to private or internal networks are not allowed.` | Les forwarding targets et les redélivrances ne peuvent pas utiliser d'adresses privées ou locales. |
| Les listes déroulantes sont vides | Le token a besoin de la permission `:read` correspondante. |

## Développement

Prérequis : Node.js 20.19 ou supérieur et npm.

```bash
git clone https://github.com/WebhookCatcher/WebhookCatcher-Node.git
cd WebhookCatcher-Node
npm install
npm run dev
```

`npm run dev` compile les nodes, les recompile à chaque modification et démarre un n8n local sur <http://localhost:5678> avec le package chargé.

| Script npm | make | Description |
| :--- | :--- | :--- |
| `npm run dev` | `make dev` | Démarre n8n avec les nodes chargés et recompile à chaque modification. |
| `npm run build` | `make build` | Compile TypeScript et copie les icônes dans `dist/`. |
| `npm run build:watch` | `make watch` | Recompile à chaque modification sans démarrer n8n. |
| `npm run lint` | `make lint` | Vérifie le code avec les règles des community nodes n8n. |
| `npm run lint:fix` | `make lint-fix` | Corrige les problèmes qui peuvent l'être automatiquement. |
| `npm run format` | `make format` | Formate le code avec Prettier. |
| `npm run release` | `make release` | Incrémente la version, met à jour le changelog, crée le tag et pousse. |

### Publication

Le [workflow Publish](../.github/workflows/publish.yml) publie chaque release sur npm avec une attestation de provenance, que n8n exige pour les community nodes. Exécutez `npm run release` en local : il lance le lint, compile, incrémente la version, crée le tag et le pousse, puis le workflow publie le package.

Configurez **Trusted Publishing** npm pour `WebhookCatcher/WebhookCatcher-Node` avec le workflow `publish.yml`, ou ajoutez un secret de dépôt `NPM_TOKEN`.

### Structure du projet

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

## Ressources

- [WebhookCatcher](https://webhookcatcher.com)
- [Documentation des community nodes n8n](https://docs.n8n.io/integrations/#community-nodes)
- [Signaler un problème](https://github.com/WebhookCatcher/WebhookCatcher-Node/issues)
- Support : [support@webhookcatcher.com](mailto:support@webhookcatcher.com)

## Licence

[MIT](../LICENSE.md)
