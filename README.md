# agenda

Un agenda/calendrier en ligne qui permet aux utilisateurs de créer, modifier, supprimer des événements, et de les partager avec d'autres utilisateurs.

## Launch project

### (Precondition)

- Copy `.env.example` as `.env` file (still at project root)

### Simplified launch, using docker (application usage)

- Run docker containers : `docker compose up -d`

Additional information:

- DB is prefilled with
  - 1 event on Fri, 13rd December 2024
  - 1 admin
    - admin@test.fr:test123!
  - 3 users
    - user1@test.fr:test123!
    - user2@test.fr:test123!
    - user3@test.fr:test123!
- Access application by going to [http://localhost:5173](http://localhost:5173)
- Swagger available at [http://localhost:3000/api](http://localhost:3000/api)

### Launch for development

- Run Front : `pnpm dev:ui` or `make ui`
- Run Back/API : `pnpm dev:api` or `make api` -> Swagger : http://localhost:3000/api
- Run Back/Auth microservice : `pnpm dev:auth` or `make auth`
- Run Back/JobRunner microservice : `pnpm dev:jobrunner` or `make jobrunner`
- Run Back/proto watcher (to automatically generate .ts files from .proto ones) : `pnpm watch:proto` or `make proto`
- Run Global/Lint : `make lint`

_Note_ : Back/API is entrypoint to access Auth or Jobrunner microservices, so it needs to be up too!

### Tests

Unit tests are present in this repository
To run them, execute  `docker compose -f docker-compose.dev.yml up -d && pnpm --filter api run test` or `make tests`

## Port used

### When running Simplified mode

Only Ui, API (for swagger) and mail (web) are available from your device

| Service  | Port(s) |
|----------|---------|
| Front/UI | 5173    |
| Back/api | 3000    |
| maildev  | 8081    |

### Exhaustive list when running from pnpm and docker compose for dev purpose

| Service              | Port(s) |
|----------------------|---------|
| Front/UI             | 5173    |
| Back/api             | 3000    |
| Back/auth            | 3001    |
| Back/notification    | 3004    |
| Postgres             | 5432    |
| Postgres (DB for UT) | 5434    |
| Redis                | 6379    |
| Web RedisInsight     | 5540    |
| maildev              | 25/8081 |
| adminer              | 8082    |

## How to install Make to use Makefile

### Windows

`choco install make`

### Linux

`sudo apt-get install make`

## pakages/proto

"protoc" need to be installed on your machine to generate the types files from proto files.

## Github workfkows

- [Lint](.github/workflows/lint.yml)

### Run GitHub pipeline locally

Install [act](https://nektosact.com/) and run `act pull_request` in the root of the project.
