FROM node:18-alpine

# Copy main workspace files for dependency resolution
COPY package.json ./
COPY pnpm-workspace.yaml ./

# Copy packages and apps
COPY packages/ /packages
COPY apps/api /apps/api

# Install pnpm globally
RUN npm install -g pnpm

# Install all dependencies in the root directory to set up the entire workspace
RUN pnpm install

# Set the working directory to the API folder and build the application
WORKDIR /apps/api
RUN pnpm run build

EXPOSE 3000

# Start the application
CMD ["pnpm", "start:prod"]
