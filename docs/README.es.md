<p align="center">
  <a href="https://webhookcatcher.com">
    <img src="https://raw.githubusercontent.com/WebhookCatcher/WebhookCatcher-Node/main/docs/images/logo.png" alt="WebhookCatcher" width="120" height="120">
  </a>
</p>

<h1 align="center">WebhookCatcher for n8n</h1>

<p align="center">
  Captura, inspecciona, protege y reenvía webhooks con <a href="https://webhookcatcher.com">WebhookCatcher</a> y reacciona a ellos en tus workflows de <a href="https://n8n.io">n8n</a>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@webhookcatcher/n8n-nodes-webhookcatcher"><img src="https://img.shields.io/npm/v/@webhookcatcher/n8n-nodes-webhookcatcher.svg" alt="npm version"></a>
  <a href="../LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT license"></a>
  <a href="https://docs.n8n.io/integrations/community-nodes/"><img src="https://img.shields.io/badge/n8n-community%20node-ff6d5a.svg" alt="n8n community node"></a>
</p>

<p align="center">
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/README.md">English</a> ·
  <b>Español</b> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.de.md">Deutsch</a> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.fr.md">Français</a> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.pt.md">Português</a> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.ja.md">日本語</a> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.ru.md">Русский</a> ·
  <a href="https://github.com/WebhookCatcher/WebhookCatcher-Node/blob/main/docs/README.zh.md">中文</a>
</p>

---

Este paquete agrega tres nodes a n8n:

| Node | Qué hace |
| :--- | :--- |
| **WebhookCatcher** | Administra endpoints, forwarding targets, auth methods y requests de webhooks, consulta el uso y las analíticas de tu cuenta, y reentrega requests. Los AI Agents de n8n también pueden usarlo como herramienta. |
| **WebhookCatcher Trigger** | Inicia un workflow en tiempo real cada vez que un endpoint recibe un webhook. Necesita una instancia de n8n accesible desde internet. |
| **WebhookCatcher Polling Trigger** | Inicia un workflow cuando se almacenan nuevos requests. Funciona con n8n en localhost o detrás de un firewall. |

## Contenido

- [Instalación](#instalación)
- [Credenciales](#credenciales)
- [Permisos del token](#permisos-del-token)
- [Node WebhookCatcher](#node-webhookcatcher)
- [WebhookCatcher Trigger](#webhookcatcher-trigger)
- [WebhookCatcher Polling Trigger](#webhookcatcher-polling-trigger)
- [¿Qué trigger debo usar?](#qué-trigger-debo-usar)
- [Workflows de ejemplo](#workflows-de-ejemplo)
- [Solución de problemas](#solución-de-problemas)
- [Desarrollo](#desarrollo)
- [Recursos](#recursos)

## Instalación

### Desde el editor de n8n (recomendado)

1. Abre **Settings → Community Nodes**.
2. Haz clic en **Install**.
3. Escribe `@webhookcatcher/n8n-nodes-webhookcatcher` y confirma.
4. Busca **WebhookCatcher** en el panel de nodes.

Consulta la [guía de community nodes de n8n](https://docs.n8n.io/integrations/community-nodes/installation/) para más detalles.

### Instalación manual (n8n autoalojado)

```bash
cd ~/.n8n/nodes
npm install @webhookcatcher/n8n-nodes-webhookcatcher
```

Reinicia n8n después de instalar. Con Docker, ejecuta el comando dentro del contenedor (en `/home/node/.n8n/nodes`) y reinicia el contenedor.

## Credenciales

Los nodes se autentican con un **API token** de WebhookCatcher.

> [!NOTE]
> El acceso a la API está disponible en los planes **Pro**, **Team** y **Business**. Los requests hechos con el token de un equipo sin acceso a la API se rechazan con `403`.

1. Inicia sesión en [WebhookCatcher](https://webhookcatcher.com).
2. Abre el menú de tu perfil → **API Tokens**.
3. Escribe un nombre (por ejemplo `n8n`) y selecciona los [permisos](#permisos-del-token) que necesitan tus workflows.
4. Copia el token. Solo se muestra una vez.
5. En n8n, crea una credencial **WebhookCatcher API**:

| Campo | Valor |
| :--- | :--- |
| **API Token** | El token que acabas de crear. |
| **Base URL** | `https://webhookcatcher.com/api/v1`. Cámbiala solo si usas una instancia de WebhookCatcher autoalojada. |

n8n prueba la credencial llamando a `GET /account`, así que el token necesita al menos el permiso `account:read`.

Un token pertenece al equipo que estaba activo cuando lo creaste. Todos los nodes que usan la credencial trabajan con los endpoints y requests de ese equipo.

## Permisos del token

Dale a cada token solo los permisos que necesitan sus workflows.

| Permiso | Permite |
| :--- | :--- |
| `account:read` | Cuenta, plan, uso y analíticas. Es obligatorio para probar la credencial. |
| `endpoints:read` | Listar y leer endpoints. Lo usan todos los menús desplegables de endpoints. |
| `endpoints:write` | Crear, actualizar y eliminar endpoints. |
| `forwarding-targets:read` | Listar y leer forwarding targets. |
| `forwarding-targets:write` | Crear, actualizar y eliminar forwarding targets. |
| `auth-methods:read` | Listar y leer auth methods. |
| `auth-methods:write` | Crear, actualizar, eliminar y regenerar auth methods. |
| `requests:read` | Listar y leer requests de webhooks y sus entregas de forwarding. |
| `requests:redeliver` | Reentregar (reproducir) requests de webhooks. |
| `cli:tunnel` | Lo usa el CLI de WebhookCatcher. No se necesita en n8n. |

Permisos que usa cada node:

| Node / operación | Permisos |
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

Los tokens creados antes de que existieran estos permisos siguen funcionando: `read` permite todos los permisos `:read`, `write` permite crear, actualizar y eliminar, y `*` permite todo.

Cuando a un token le falta un permiso, la API responde `403` con `This API token does not have the "<permission>" permission.` y el node muestra ese mensaje.

## Node WebhookCatcher

| Resource | Operations |
| :--- | :--- |
| **Account** | Get (team, plan, features, monthly usage and token details) · Get Analytics (date range) |
| **Endpoint** | Create · Get · Get Many · Update · Delete |
| **Forwarding Target** | Create · Get · Get Many · Update · Delete |
| **Auth Method** | Create · Get · Get Many · Update · Delete · Regenerate Credentials |
| **Request** | Get · Get Many · Get Deliveries · Redeliver |

### Endpoint

- **Create** recibe un nombre, una ruta, el método HTTP aceptado y la autenticación (`None`, `API Key`, `Basic Auth`, `Bearer Token` o `HMAC`) con el auth method que la valida. Campos adicionales: descripción, estado activo y límite de frecuencia.
- **Update** envía solo los campos que configuras. El resto del endpoint se queda como está.
- **Get Many** admite **Return All** o un **Limit**, y filtra por estado activo.

### Forwarding Target

Reenvía a otra URL cada request que acepta un endpoint. Opciones: método HTTP, autenticación para el destino, headers personalizados, reintentos automáticos, estado activo, descripción y **filtros de payload** (reenvía solo cuando un campo del payload cumple una condición).

El destino debe ser una URL pública. Las direcciones privadas, de loopback y link-local se rechazan para evitar SSRF.

Cuando el target tiene un auth method, WebhookCatcher autentica cada request reenviado con él: `X-API-KEY` para API keys, `Authorization: Bearer …` o `Authorization: Basic …`, o `X-Timestamp` y `X-Signature` para HMAC (`hash_hmac('sha256', timestamp + body, secret)` sobre el body exacto que se envía). Si el auth method está inactivo o vencido, la entrega falla en lugar de enviarse sin credenciales. Elige `None` en **Authentication** para quitarlo.

### Auth Method

Crea las credenciales que usan los endpoints para validar los webhooks entrantes: API key, Basic Auth (usuario y contraseña), token Bearer o secreto HMAC. **Regenerate Credentials** rota el token o secreto generado y devuelve el nuevo valor.

### Request

- **Get Many** filtra por endpoint, estado (`success`, `error`, `pending`, `timeout`), método HTTP, código de respuesta y rango de fechas, ordenados del más nuevo al más antiguo o al revés.
- **Get Deliveries** devuelve cada intento de forwarding de un request con su código de estado, duración, error y cuerpo de la respuesta.
- **Redeliver** vuelve a enviar un request almacenado a todos los forwarding targets de su endpoint, a un forwarding target o a una URL pública personalizada.
- Cada request incluye `body` (parseado) y `raw_body`: los bytes exactos recibidos, para XML, texto plano o payloads firmados. `raw_body` es `null` cuando es idéntico a `body` codificado como JSON.

### Úsalo como herramienta de un AI Agent

El node WebhookCatcher está marcado como `usableAsTool`. Conéctalo a un **AI Agent** de n8n para que el agente liste endpoints, inspeccione requests fallidos o los reentregue.

## WebhookCatcher Trigger

Inicia el workflow en cuanto un endpoint acepta un webhook.

1. Agrega el node **WebhookCatcher Trigger** y selecciona el endpoint.
2. Activa el workflow o haz clic en **Listen for test event**.

Al activarse, el node crea un forwarding target en ese endpoint. Apunta a la URL del webhook de n8n y envía un header `X-WebhookCatcher-Secret` aleatorio. n8n rechaza con `401` cualquier llamada sin ese secreto. El forwarding target se elimina cuando se desactiva el workflow. Las URLs de prueba y de producción usan forwarding targets distintos.

Salida:

```json
{
  "body": { "event": "invoice.paid", "id": "in_123" },
  "query": {},
  "headers": { "content-type": "application/json", "user-agent": "Stripe/1.0" },
  "receivedAt": "2026-10-08T15:04:05.000Z"
}
```

Desactiva **Options → Include Headers** para obtener solo el body y el query.

Activa **Options → Include Raw Body** para incluir también `rawBody`, el body exactamente como se recibió. WebhookCatcher reenvía los bytes y el `Content-Type` originales, así que los webhooks XML, de formulario y de texto plano llegan sin cambios.

> [!IMPORTANT]
> WebhookCatcher debe poder llegar a tu instancia de n8n. Configura `WEBHOOK_URL` en n8n con su URL pública. Si n8n corre en `localhost`, usa el Polling Trigger.

## WebhookCatcher Polling Trigger

Consulta WebhookCatcher en busca de nuevos requests con el intervalo de polling que elijas (cada minuto, cada hora, …).

- **Endpoint**: un endpoint, o vacío para todos los endpoints.
- **Filters → Status**: por ejemplo, solo requests con `error`, para recibir avisos de webhooks rechazados.

En la primera activación, el node parte del request más reciente y no reproduce el historial. Cada consulta emite los requests recibidos desde la consulta anterior, del más antiguo al más nuevo, hasta 500 por consulta. Los requests restantes se emiten en la siguiente.

Una ejecución de prueba manual devuelve el último request para que puedas mapear sus campos.

## ¿Qué trigger debo usar?

| | WebhookCatcher Trigger | WebhookCatcher Polling Trigger |
| :--- | :--- | :--- |
| Latencia | Tiempo real | Intervalo de polling |
| n8n en localhost o en una red privada | ❌ | ✅ |
| Salida | Body, query y headers originales | Request almacenado (body, headers, estado, código de respuesta, duración, …) |
| Requests rechazados | No se reciben, solo se reenvían los requests aceptados | Se reciben, usa el filtro de estado |
| Crea recursos en WebhookCatcher | Un forwarding target mientras está activo | Ninguno |

## Workflows de ejemplo

- **Stripe → Slack**: WebhookCatcher Trigger en tu endpoint de Stripe → IF `body.type` es `invoice.payment_failed` → mensaje de Slack.
- **Alerta de webhooks rechazados**: Polling Trigger con **Status = Error** → correo o mensaje de Slack con el endpoint, el código de respuesta y el error.
- **Reintentar forwards fallidos**: Schedule Trigger → Request: Get Many (estado `error`, última hora) → Request: Get Deliveries → Request: Redeliver.
- **Reporte diario de uso**: Schedule Trigger → Account: Get y Get Analytics → Google Sheets.
- **Onboarding de clientes**: Form Trigger → Auth Method: Create → Endpoint: Create → Forwarding Target: Create → enviar la URL y las credenciales al cliente.

## Solución de problemas

| Problema | Solución |
| :--- | :--- |
| `401 Unauthenticated` | El token es incorrecto, expiró o se eliminó. Crea uno nuevo. |
| `403 Your active plan does not support API access` | El equipo del token necesita el plan Pro, Team o Business. |
| `403 This API token does not have the "…" permission` | Edita los permisos del token en WebhookCatcher → API Tokens. |
| `422` con errores de campos | El node muestra el mensaje de validación de cada campo. Revisa los valores que envías. |
| El Trigger nunca se dispara | n8n no es público, `WEBHOOK_URL` no está configurada, o el endpoint rechaza el webhook antes de reenviarlo (revisa su autenticación). Prueba el Polling Trigger. |
| `URLs pointing to private or internal networks are not allowed.` | Los forwarding targets y las reentregas no pueden usar direcciones privadas ni locales. |
| Los menús desplegables están vacíos | El token necesita el permiso `:read` correspondiente. |

## Desarrollo

Requisitos: Node.js 20.19 o superior y npm.

```bash
git clone https://github.com/WebhookCatcher/WebhookCatcher-Node.git
cd WebhookCatcher-Node
npm install
npm run dev
```

`npm run dev` compila los nodes, los recompila al detectar cambios e inicia un n8n local en <http://localhost:5678> con el paquete cargado.

| Script de npm | make | Descripción |
| :--- | :--- | :--- |
| `npm run dev` | `make dev` | Inicia n8n con los nodes cargados y recompila al detectar cambios. |
| `npm run build` | `make build` | Compila TypeScript y copia los íconos en `dist/`. |
| `npm run build:watch` | `make watch` | Recompila al detectar cambios sin iniciar n8n. |
| `npm run lint` | `make lint` | Revisa el código con las reglas de n8n para community nodes. |
| `npm run lint:fix` | `make lint-fix` | Corrige los problemas que se pueden arreglar automáticamente. |
| `npm run format` | `make format` | Da formato al código con Prettier. |
| `npm run release` | `make release` | Sube la versión, actualiza el changelog, crea el tag y hace push. |

### Publicación de versiones

El [workflow de publicación](../.github/workflows/publish.yml) publica cada versión en npm con una declaración de procedencia, que n8n exige para los community nodes. Ejecuta `npm run release` en local: hace lint, compila, sube la versión, crea el tag y lo envía, y el workflow publica el paquete.

Configura **Trusted Publishing** de npm para `WebhookCatcher/WebhookCatcher-Node` con el workflow `publish.yml`, o agrega un secreto de repositorio `NPM_TOKEN`.

### Estructura del proyecto

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
- [Documentación de community nodes de n8n](https://docs.n8n.io/integrations/#community-nodes)
- [Reportar un problema](https://github.com/WebhookCatcher/WebhookCatcher-Node/issues)
- Soporte: [support@webhookcatcher.com](mailto:support@webhookcatcher.com)

## Licencia

[MIT](../LICENSE.md)
