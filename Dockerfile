FROM node:24 AS builder
WORKDIR /app

# Install build dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    openssl ca-certificates python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

# Copy dependency files
COPY package.json yarn.lock ./
COPY apps/server/package.json apps/server/
COPY apps/client/package.json apps/client/
COPY packages/eslint-config/package.json packages/eslint-config/
COPY packages/typescript-config/package.json packages/typescript-config/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Migrate database (optional, depending on your setup)
RUN yarn db:migrate-prod

# Seed database (optional, depending on your setup)
RUN yarn db:seed

# Generate Prisma Client
RUN yarn db:generate

# Build both applications
RUN yarn build

# Production stage
# ============================================
FROM node:24-slim
ARG FRONTEND_PORT=5173
ARG BACKEND_PORT=3000
ENV NODE_ENV=production
ENV FRONTEND_PORT=${FRONTEND_PORT}
ENV BACKEND_PORT=${BACKEND_PORT}
WORKDIR /app

# Install nginx
RUN apt-get update && apt-get install -y --no-install-recommends nginx && rm -rf /var/lib/apt/lists/*

# Copy built artifacts and dependencies
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/server/dist /app/apps/server/dist
COPY --from=builder /app/apps/client/dist /app/apps/client/dist
COPY apps/server/package.json /app/apps/server/
COPY apps/client/package.json /app/apps/client/
COPY .env /app/.env

# Configure nginx to serve frontend and proxy API
COPY nginx.conf /etc/nginx/nginx.conf

# Create entrypoint script to run both services
RUN echo '#!/bin/bash\n\
set -e\n\
sed -i "s/listen 80;/listen $FRONTEND_PORT;/" /etc/nginx/nginx.conf\n\
nginx -g "daemon off;" &\n\
exec node /app/apps/server/dist/src/main\n\
' > /entrypoint.sh && chmod +x /entrypoint.sh

EXPOSE ${FRONTEND_PORT} ${BACKEND_PORT}
CMD ["/entrypoint.sh"]
