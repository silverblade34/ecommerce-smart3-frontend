# --- Etapa 1: Build ---
FROM node:20-alpine AS builder

# Instalar pnpm global
RUN npm install -g pnpm

WORKDIR /app

# Copiar archivos principales
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar el resto del proyecto
COPY . .

# Build de Next.js
RUN pnpm build

# --- Etapa 2: Run ---
FROM node:20-alpine AS runner
RUN npm install -g pnpm

WORKDIR /app
ENV NODE_ENV=production

# Copiar lo necesario
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["pnpm", "start"]