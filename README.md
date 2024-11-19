# agenda

Un agenda/calendrier en ligne qui permet aux utilisateurs de créer, modifier, supprimer des événements, et de les partager avec d'autres utilisateurs.

## Launch project

From project root:

- Create a .env file from .env.example
- Run docker containers : `docker compose --env-file .env -f docker-compose.dev.yml up -d`

- Run front : `pnpm --filter ui dev`
- Run Back/API : `pnpm --filter api start:dev`
- Run Back/Auth microservice : `pnpm --filter auth start:dev`

## Port used

- Front/UI : 4200
- Back/api : 3000
- Back/auth : 3001
- Back/notification : 3004
