.PHONY : jobrunner
jobrunner:
	@echo "start jobrunner"
	@pnpm run dev:jobrunner

.PHONY : auth
auth:
	@echo "start auth"
	@pnpm run dev:auth

.PHONY : ui
ui:
	@echo "start ui"
	@pnpm run dev:ui

.PHONY : api
api:
	@echo "start api"
	@pnpm run dev:api

.PHONY : proto
proto:
	@echo "watch proto"
	@pnpm run watch:proto

.PHONY: up
up:
	docker compose -f ./docker-compose.dev.yml up -d

.PHONY: down
down:
	docker compose -f ./docker-compose.dev.yml down

.PHONY: stop
stop:
	docker compose -f ./docker-compose.dev.yml stop

.PHONY: install
install:
	npm install

.PHONY: reset
reset:
	docker stop $$(docker ps -a -q) \
	&& docker rm $$(docker ps -a -q) \
	&& docker rmi $$(docker images -q) \
	&& docker volume rm $$(docker volume ls -q) \
	&& docker system prune -a -f

.PHONY: lint
lint:
	@echo "linting"
	@echo "linting api"
	@pnpm --filter api run lint
	@echo "linting ui"
	@pnpm --filter ui run lint
	@echo "linting jobrunner"
	@pnpm --filter jobrunner run lint
	@echo "linting auth"
	@pnpm --filter auth run lint

.PHONY: tests
tests:
	@echo "testing"
	@pnpm --filter api run test

.PHONY: tests-coverage
tests-coverage:
	@echo "testing"
	@pnpm --filter api test:cov
