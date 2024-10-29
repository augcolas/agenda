.PHONY : ui
ui:
	@echo "start ui"
	@pnpm run dev:ui

.PHONY : api
api:
	@echo "start api"
	@pnpm run dev:api

.PHONY: up
up:
	docker compose up -d

.PHONY: down
down:
	docker compose down

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