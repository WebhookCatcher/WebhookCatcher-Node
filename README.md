# @webhookcatcher/n8n-nodes-webhookcatcher

This is a custom community node for [n8n](https://n8n.io/) that allows you to directly interact with the **WebhookCatcher** API to manage endpoints, forwarding targets, request logs, and authentication methods dynamically in your automation workflows.

---

## 🚀 Available Commands

This project includes a `Makefile` and `package.json` scripts to streamline the development cycle. Below are the commands you can use:

### 🛠️ Using `make` (Recommended)

| Command | Description |
| :--- | :--- |
| `make install` | Installs all required Node.js dependencies for the project. |
| `make build` | Cleans the previous build (`dist`), compiles TypeScript to JavaScript, and copies icons/assets. |
| `make dev` | Runs the TypeScript compiler in watch mode (automatically recompiles upon saving changes). |
| `make lint` | Runs ESLint checks to ensure compliance with strict n8n code quality standards. |
| `make lint-fix` | Automatically fixes auto-solvable ESLint style and compliance violations. |
| `make format` | Automatically formats all source code files using Prettier. |
| `make clean` | Removes the compiled distribution directory (`dist`) completely. |
| `make link` | Creates a global symlink (`npm link`) for the node package on your machine. |

### 📦 Using NPM scripts alternatives

If you prefer not to use `make`, you can run the equivalent npm scripts:
* **Install dependencies**: `npm install`
* **Build project**: `npm run build`
* **Development mode (watch)**: `npm run dev`
* **Format code**: `npm run format`
* **Lint checks**: `npm run lint`
* **Autofix lint style**: `npm run lintfix`

---

## 🔌 How to Add This Node to n8n Locally

To load and test this node in your local n8n instance during development, follow one of the methods below.

> [!IMPORTANT]
> Always build the project first by running `make build` (or `npm run build`) to generate the required `/dist` directory.

### Method 1: Symbolic Linking (`npm link`) — *Recommended for active development*

This method links the local build to your global environment, reflecting changes instantly upon rebuilding and restarting n8n.

1. **Link the node globally:**
   From the root of this project (`/home/happones/Plugins/Node/webhookcatcher-node`), run:
   ```bash
   make build
   make link
   ```

2. **Link the node in n8n:**
   Navigate to your local n8n data directory (typically located at `~/.n8n/`).
   Create the `custom` directory if it does not exist, go inside, and link the package:
   ```bash
   mkdir -p ~/.n8n/custom
   cd ~/.n8n/custom
   npm link @webhookcatcher/n8n-nodes-webhookcatcher
   ```

3. **Start n8n:**
   Start your local n8n instance, and it will load the custom node automatically:
   ```bash
   n8n start
   ```

---

### Method 2: Direct Local Path Installation — *Most robust and bulletproof*

If you run into permission, global environment, or Node version issues with `npm link`, installing the node directly from its absolute local path is the most reliable option.

1. **Build the node first:**
   ```bash
   make build
   ```

2. **Install directly in the n8n custom directory:**
   ```bash
   mkdir -p ~/.n8n/custom
   cd ~/.n8n/custom
   npm install /home/happones/Plugins/Node/webhookcatcher-node
   ```

3. **Start n8n:**
   ```bash
   n8n start
   ```

---

### Method 3: Integrating with Docker / Docker Compose

Since Docker containers run in isolated environments, `npm link` cannot access host symlinks directly. You must mount the compiled directory as a volume.

1. **Build your node locally:**
   ```bash
   make build
   ```

2. **Configure your `docker-compose.yml` for n8n:**
   Mount the compiled `/dist` directory and the `package.json` file inside the container's custom nodes node_modules folder:

   ```yaml
   version: '3.8'
   services:
     n8n:
       image: n8nio/n8n:latest
       ports:
         - "5678:5678"
       environment:
         - N8N_ENCRYPTION_KEY=your_secret_encryption_key
       volumes:
         - ~/.n8n:/home/node/.n8n
         # Mount the built dist folder directly into custom/node_modules
         - /home/happones/Plugins/Node/webhookcatcher-node/dist:/home/node/.n8n/custom/node_modules/@webhookcatcher/n8n-nodes-webhookcatcher/dist
         # Mount the package.json so n8n can discover the custom package
         - /home/happones/Plugins/Node/webhookcatcher-node/package.json:/home/node/.n8n/custom/node_modules/@webhookcatcher/n8n-nodes-webhookcatcher/package.json
   ```

3. **Restart the Docker container:**
   ```bash
   docker compose down && docker compose up -d
   ```

---

## 🛠️ Supported Resources and Operations

This custom node exposes four main resources of WebhookCatcher:

### 1. **Endpoint**
* ➕ **Create**: Sets up a new webhook catcher endpoint with custom HTTP method, description, active state, and rate limits.
* 🔍 **Get**: Retrieves configuration details of a specific endpoint by ID.
* 📋 **Get Many**: Returns a list of all configured endpoints.
* ✏️ **Update**: Modifies fields of an endpoint (name, path, active status, rate limit, etc.).
* ❌ **Delete**: Permanently removes an endpoint.

### 2. **Forwarding Target**
* ➕ **Create**: Binds a forwarding target URL to an endpoint, defining HTTP method, authentication profiles, and state.
* 🔍 **Get**: Retrieves details of a specific forwarding target.
* 📋 **Get Many**: Lists all configured forwarding targets.
* ✏️ **Update**: Updates attributes of a forwarding target.
* ❌ **Delete**: Removes a forwarding target.

### 3. **Request Log**
* ➕ **Get**: Fetches details of a specific webhook request captured by WebhookCatcher (headers, body, query, IP, timestamp).
* 🔍 **Get Many**: Lists the history of all requests received by a specific endpoint.
* 📋 **Redeliver**: Triggers a manual or automatic replay/redelivery of a specific request back to its forwarding targets.

### 4. **Auth Method**
* ➕ **Create**: Configures a new authentication profile (`Basic Auth`, `Bearer Token`, or `Custom Header`) for secure webhook delivery.
* 🔍 **Get**: Retrieves details of a specific authentication method.
* 📋 **Get Many**: Lists all available authentication profiles.
* ✏️ **Update**: Modifies the fields of an authentication profile.
* ❌ **Delete**: Deletes an authentication profile.

---

## 🔑 Required Credentials

To connect the node with your WebhookCatcher service, configure the following credentials in n8n:

* **Base URL**: The base URL of the WebhookCatcher API (defaults to `http://localhost/api/v1` for local development).
* **API Token**: Your API security token generated in the WebhookCatcher platform. It will be sent automatically as an HTTP authorization header:
  ```http
  Authorization: Bearer <API Token>
  ```

---

## 📄 License

This n8n integration package is licensed under the [MIT License](LICENSE.md).
