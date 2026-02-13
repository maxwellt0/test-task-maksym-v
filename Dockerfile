# Build stage
FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
RUN npm prune --production

# Production stage
FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/db ./db

# Expose the port SvelteKit will run on
EXPOSE 3000

ENV NODE_ENV=production
ENV HOST=0.0.0.0

# Command to run migrations and then the app
# Note: In a real prod environment, you might want to run migrations separately.
# For this tool, we'll run them on startup for simplicity.
CMD ["sh", "-c", "npm run db:migrate && node build"]
