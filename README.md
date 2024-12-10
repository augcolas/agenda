# agenda

Un agenda/calendrier en ligne qui permet aux utilisateurs de créer, modifier, supprimer des événements, et de les partager avec d'autres utilisateurs.

## Launch project

From project root:

- Create a .env file from .env.example
- Run docker containers : `docker compose --env-file .env -f docker-compose.dev.yml up -d` or `make up`

- Run Front : `pnpm dev:ui` or `make ui`
- Run Back/API : `pnpm dev:api` or `make api` -> Swagger : http://localhost:3000/api
- Run Back/Auth microservice : `pnpm dev:auth` or `make auth`
- Run Back/JobRunner microservice : `pnpm dev:jobrunner` or `make jobrunner`
- Run Back/proto watcher : `pnpm watch:proto` or `make proto`
- Run Global/Lint : `make lint`

## Port used

| Service            | Port(s)    |
|--------------------|------------|
| Front/UI           | 4200       |
| Back/api           | 3000       |
| Back/auth          | 3001       |
| Back/notification  | 3004       |
| Postgres           | 5432       |
| Redis              | 6379       |
| Web RedisInsight   | 5540       |
| maildev            | 25/8081    |
| adminer            | 8082       |

## How to install Make to use Makefile

### Windows
`choco install make`

### Linux
`sudo apt-get install make`

## pakages/proto

"protoc" need to be installed on your machine to generate the types files from proto files.

## Github workfkows

- [Lint](.github/workflows/lint.yml)

### To test run in local :

Install [act](https://nektosact.com/) and run `act pull_request` in the root of the project.
