.PHONY: all help install build watch dev lint lint-fix format release clean

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

clean:
	rm -rf dist
