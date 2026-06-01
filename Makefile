.PHONY: build dev lint lint-fix format clean install link help

# Default target
all: build

# Display help information about targets
help:
	@echo "======================================================================"
	@echo "                  WebhookCatcher n8n Node Makefile                    "
	@echo "======================================================================"
	@echo "Available commands:"
	@echo "  make install   - Install all node modules and dependencies"
	@echo "  make build     - Clean dist, compile TypeScript, and bundle assets"
	@echo "  make dev       - Run TypeScript compiler in watch mode"
	@echo "  make lint      - Run ESLint checks (n8n strict compliance rules)"
	@echo "  make lint-fix  - Automatically fix ESLint check violations"
	@echo "  make format    - Format all files with Prettier"
	@echo "  make clean     - Remove all build distribution files (dist)"
	@echo "  make link      - Link this node locally so it is discoverable by n8n"
	@echo "======================================================================"

# Install node packages
install:
	npm install

# Build the custom node distribution files
build:
	npm run build

# Watch for file changes during development
dev:
	npm run dev

# Run ESLint compliance checks
lint:
	npm run lint

# Auto-fix lint violations where possible
lint-fix:
	npm run lintfix

# Format code with Prettier
format:
	npm run format

# Clean the build directory
clean:
	npx rimraf dist

# Link the node package locally so n8n can find and load it
link:
	npm link
