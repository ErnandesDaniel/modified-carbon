# 1. Среда выполнения (Base)
FROM node:22-alpine AS base
# Включаем corepack
RUN corepack enable
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 2. Установка зависимостей (Deps)
FROM base AS deps
# Сначала копируем только файлы манифеста
COPY package.json pnpm-lock.yaml* ./
# Corepack скачивает нужную версию pnpm (10.13.1) из package.json
RUN corepack prepare --activate
# Устанавливаем зависимости
RUN pnpm i --frozen-lockfile

# 3. Сборка (Builder)
FROM base AS builder
WORKDIR /app
# Забираем установленные модули из предыдущего этапа
COPY --from=deps /app/node_modules ./node_modules
# Копируем исходный код
COPY . .
# Отключаем телеметрию и собираем standalone
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

# 4. Финальный образ (Runner)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Настройка безопасности (non-root user)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем только необходимые файлы для работы standalone сервера
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Запуск скомпилированного Node.js сервера
CMD ["node", "server.js"]