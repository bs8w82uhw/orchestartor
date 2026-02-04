.PHONY: help install build-dev build-dist dev test

help:
	@echo "Available targets:"
	@echo "  make install     - Install npm dependencies"
	@echo "  make build-dev   - Build assets for local development"
	@echo "  make build-dist  - Build production assets"
	@echo "  make dev         - Build dev assets and run debug server"
	@echo "  make test        - Run full test suite"

install:
	npm install

build-dev:
	npm run build:dev

build-dist:
	npm run build:dist

dev:
	npm run dev

test:
	npm test
