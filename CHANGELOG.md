# Changelog

## 0.2.0

### Added

- **WebhookCatcher Trigger**: starts workflows in real time. It creates a forwarding target that points to the n8n webhook URL, verifies a secret header and removes the forwarding target when the workflow is deactivated.
- **WebhookCatcher Polling Trigger**: starts workflows from new requests without exposing n8n to the internet. Filters by endpoint and status.
- **Account** resource: account, plan, usage and analytics.
- **Request** operations: Get Deliveries and Redeliver to all forwarding targets, one forwarding target or a custom URL. Get Many filters by endpoint, status, method, response code and date range.
- **Auth Method** operation: Regenerate Credentials.
- Forwarding targets support custom headers, automatic retries, payload filters and description.
- Return All and Limit on every Get Many operation.
- The WebhookCatcher node can be used as an AI Agent tool.
- Light and dark icons.
- WebhookCatcher Trigger option **Include Raw Body** outputs the body exactly as received.
- Requests include `raw_body` (exact bytes received) and forwarding targets include `auth_method_id`.

### Changed

- Migrated to `@n8n/node-cli` with strict mode, ESLint 9 flat config and npm provenance publishing.
- Credential renamed to **WebhookCatcher API** (`webhookCatcherApi`) and tested against `GET /account`. Existing credentials must be created again.
- Updates send only the fields you set (`PATCH`).
- API validation errors are shown field by field.

### Fixed

- Auth types now match the API values (`api_key`, `basic`, `bearer_token`, `hmac`, `none`).
- HTTP methods are sent in the format the API expects.
- Auth method credentials are sent inside `config`.
- The auth method of a forwarding target is now saved and used to authenticate forwarded requests (requires WebhookCatcher with forwarding auth support).
