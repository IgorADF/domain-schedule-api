# Base stage - install dependencies
FROM node:20-alpine AS base

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production dependencies stage
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# API stage
FROM node:20-alpine AS api

WORKDIR /app

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy built files
COPY --from=base /app/dist ./dist
COPY package*.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3000

CMD ["npm", "run", "start:api"]

# Queue consumer stage
FROM node:20-alpine AS queue

WORKDIR /app

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy built files
COPY --from=base /app/dist ./dist
COPY package*.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

CMD ["npm", "run", "start:queue"]

# Jobs/Cron stage
FROM node:20-alpine AS jobs

WORKDIR /app

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy built files
COPY --from=base /app/dist ./dist
COPY package*.json ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

CMD ["npm", "run", "start:jobs"]
