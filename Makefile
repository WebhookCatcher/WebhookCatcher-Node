.PHONY: all help install build watch dev lint lint-fix format release publish publish-dry-run clean

all: build

help:
	@echo "WebhookCatcher n8n nodes"
	@echo ""
	@echo "  make install   Install dependencies"
	@echo "  make dev       Start n8n with the nodes loaded and rebuild on change"
	@echo "  make build     Compile TypeScript and copy the icons into dist/"
	@echo "  make watch     Recompile on change without starting n8n"
	@echo "  make lint      Check the code with the n8n community node rules"
	@echo "  make lint-fix  Fix the issues that can be fixed automatically"
	@echo "  make format    Format the code with Prettier"
	@echo "  make release   Bump the version, update the changelog, tag and push"
	@echo "  make publish   Manually publish to npm (reads NPM_TOKEN from .env if set)"
	@echo "  make publish-dry-run  Simulate the npm publish without uploading"
	@echo "  make clean     Remove dist/"

install:
	npm install

build:
	npm run build

watch:
	npm run build:watch

dev:
	npm run dev

lint:
	npm run lint

lint-fix:
	npm run lint:fix

format:
	npm run format

release:
	npm run release

publish:
	@set -a; [ -f .env ] && . ./.env; set +a; \
	if [ -n "$$NPM_TOKEN" ]; then \
		echo "Publishing using NPM_TOKEN from .env..."; \
		npm publish --access public --//registry.npmjs.org/:_authToken=$$NPM_TOKEN; \
	else \
		echo "NPM_TOKEN not found in .env, using local npm credentials..."; \
		npm publish --access public; \
	fi

publish-dry-run:
	@npm publish --dry-run --access public

clean:
	rm -rf dist
