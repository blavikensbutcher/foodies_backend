# Foodies backend

Node.js API для командного проєкту Foodies.

**API (Render):** https://foodies-backend-bklu.onrender.com/api  
**Swagger:** https://foodies-backend-bklu.onrender.com/api-docs/  
**Frontend:** https://lilianalukash.github.io/Foodies/  
**Репозиторій фронту:** https://github.com/LilianaLukash/Foodies

## Стек

- Express 5 + TypeScript
- Prisma + PostgreSQL
- JWT (access + refresh)
- Zod validation
- Multer + Cloudinary (avatar / recipe images)
- Swagger UI (`/api-docs`)
- Winston + Morgan logging

## Швидкий старт (локально)

### 1. Залежності

```bash
npm install
cp .env.example .env
```

### 2. PostgreSQL (Docker)

```bash
docker compose up -d
```

За замовчуванням БД слухає порт **55432** (див. `.env.example`).

### 3. Міграції та seed

```bash
npm run prisma:generate
npm run prisma:migrate
```

Щоб seed-користувачі могли логінитися, у `.env` задай:

```
SEED_USER_PASSWORD=12345678
```

Потім:

```bash
npm run prisma:seed
```

Без `SEED_USER_PASSWORD` seed поставить невідомий пароль (акаунти з seed не відкриються).

Демо після seed (якщо пароль заданий):

- email: `goit@gmail.com`
- password: значення `SEED_USER_PASSWORD`

### 4. Запуск API

```bash
npm run dev
```

Сервер: `http://localhost:3000`  
Swagger: `http://localhost:3000/api-docs/`  
Health: `GET http://localhost:3000/api/health`  
Усі бізнес-роути — з префіксом `/api`.

## Змінні середовища

Див. `.env.example`:

| Змінна | Навіщо |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (Prisma) |
| `PORT` | Порт API (за замовчуванням `3000`) |
| `JWT_SECRET` | Підпис JWT |
| `ACCESS_TOKEN_DURATION_MINUTES` | TTL access token |
| `REFRESH_TOKEN_DURATION_DAYS` | TTL refresh token |
| `CLOUDINARY_CLOUD_NAME` / `API_KEY` / `API_SECRET` | Завантаження фото |
| `SEED_USER_PASSWORD` | Пароль для seed-користувачів (опційно) |
| `POSTGRES_*` | Налаштування локального контейнера Postgres |

Для upload аватарів/фото рецептів локально потрібні валідні Cloudinary-ключі.

## Скрипти

```bash
npm run dev             # tsx watch
npm run build           # prisma generate + tsc
npm start               # production (node dist/server.js)
npm run typecheck       # tsc --noEmit
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run prisma:studio
```

## Структура

```
src/
  config/         # auth, cloudinary, logger, swagger
  controllerss/
  middlewares/    # auth, validate, upload, errorHandler
  repositories/
  routes/         # Express routers + OpenAPI comments
  services/
  utils/
prisma/
  schema/         # Prisma schema
  seed.ts
  seed-data/      # JSON для seed
```

## Основні групи API

Усі ендпоінти під префіксом `/api`. Повний контракт — у Swagger.

- **Auth** — register / login / refresh / logout
- **Users** — current user, profile, avatar, followers / following, follow
- **Catalog** — categories, areas, ingredients, testimonials
- **Recipes** — list (фільтри за **id**), popular, CRUD, favorites, own / by user

Фільтри списку рецептів:

```
GET /api/recipes?category=<categoryId>&ingredient=<ingredientId>&area=<areaId>&page=1&limit=12
```

## Deploy (Render)

Конфіг: `render.yaml`.

Типовий flow на Render:

1. Build: `npm ci` → `prisma generate` → `migrate deploy` → `seed` → `build`
2. Start: `npm start`
3. Env: `DATABASE_URL`, `JWT_SECRET`, Cloudinary, за бажанням `SEED_USER_PASSWORD`

Live API: https://foodies-backend-bklu.onrender.com/api-docs/

## Корисні посилання

- Frontend README: https://github.com/LilianaLukash/Foodies/blob/main/frontend/README.md
- Figma: https://www.figma.com/design/TKl7kDNvwtz62RsuWNnQ5E/Foodies
