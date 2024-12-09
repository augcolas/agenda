FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /agenda
WORKDIR /agenda
RUN pnpm install


FROM base AS api
WORKDIR /agenda/apps/api
RUN pnpm run build

EXPOSE 3000
CMD ["pnpm", "start"]

