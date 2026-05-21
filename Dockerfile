# ============================================================
# AeroJSON – Multi-Stage Docker Build
# Stage 1: Build React frontend with Vite
# Stage 2: Lean Node.js runtime serving dist/ via Express
# ============================================================

# ── Stage 1: Builder ─────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first to leverage layer caching
COPY package.json package-lock.json ./

# Install ALL deps (including devDeps needed for Vite build)
RUN npm ci

# Copy source code
COPY . .

# Build the React app into /app/dist
RUN npm run build


# ── Stage 2: Runtime ─────────────────────────────────────────
FROM node:20-alpine AS runtime

WORKDIR /app

# Copy only production-relevant files from builder
COPY package.json package-lock.json ./

# Install production deps only (express, cors)
RUN npm ci --omit=dev

# Copy the compiled React assets from the builder stage
COPY --from=builder /app/dist ./dist

# Copy the Express server entry point
COPY server.js ./

# Expose the port the Express server listens on
EXPOSE 5000

# Environment variable (can be overridden at runtime)
ENV PORT=5000
ENV NODE_ENV=production

# Start the Express server
CMD ["node", "server.js"]
