# Foodies — Backend

REST API фінального проєкту **Foodies** (курс Node.js + командна робота з React-клієнтом).

| | |
| --- | --- |
| **API** | https://foodies-backend-bklu.onrender.com/api |
| **Swagger** | https://foodies-backend-bklu.onrender.com/api-docs/ |
| **Health** | `GET /api/health` |
| **Frontend live** | https://lilianalukash.github.io/Foodies/ |
| **Frontend repo** | [LilianaLukash/Foodies](https://github.com/LilianaLukash/Foodies) |
| **Figma** | [Foodies](https://www.figma.com/design/TKl7kDNvwtz62RsuWNnQ5E/Foodies) |

## Що реалізовано (відповідність ТЗ)

| Ticket | Опис |
| --- | --- |
| **BE-1** | Express + TS, Postgres (Prisma), CORS, Helmet, централізований error handler, Swagger |
| **BE-2** | Auth: register / login / logout / refresh, JWT middleware |
| **BE-2.1** | Auth-конфіг через env (`JWT_SECRET`, TTL токенів) |
| **BE-3** | Довідники: categories, areas, ingredients, testimonials |
| **BE-4** | Пошук / фільтрація рецептів + пагінація |
| **BE-5** | Деталі рецепта, popular (за кількістю favorites) |
| **BE-6** | Створення / видалення / own recipes (+ PATCH edit) |
| **BE-7** | Favorites: add / remove / list |
| **BE-8** | Профіль поточного та іншого користувача, avatar |
| **BE-9** | Followers / following, follow / unfollow |

Seed даних: JSON/CSV з матеріалів курсу (див. посилання внизу) → `prisma/seed-data/` + `npm run prisma:seed`.

> БД: **PostgreSQL + Prisma** (SQL-шлях ТЗ). MongoDB-колекції з Drive використані як джерело даних для seed, не як runtime DB.

## Стек

| Технологія | Призначення |
| --- | --- |
| Express 5 + TypeScript | HTTP API |
| Prisma 7 + PostgreSQL | ORM / БД |
| JWT + bcryptjs | auth + хеш паролів |
| Zod | валідація |
| Multer + Cloudinary | avatar / recipe images |
| swagger-jsdoc + swagger-ui-express | документація ендпоінтів |
| Winston + Morgan | логи |
| Helmet + CORS | базова безпека |
| Docker Compose | локальний Postgres 16 |

## Вимоги

- Node.js **24** (Render/CI) або **22+**
- npm
- Docker **або** власний PostgreSQL
- Cloudinary — для upload зображень

## Швидкий старт

### 1. Env і залежності

```bash
npm install
cp .env.example .env
```

### 2. Postgres (Docker)

```bash
docker compose up -d
```

Порт за замовчуванням: **55432** (див. `.env.example`).

### 3. Міграції та seed

```bash
npm run prisma:generate
npm run prisma:migrate
```

У `.env` для логіну seed-користувачів:

```env
SEED_USER_PASSWORD=12345678
```

```bash
npm run prisma:seed
```

Без `SEED_USER_PASSWORD` seed ставить невідомий пароль.

| Email (після seed) | Password |
| --- | --- |
| `goit@gmail.com` | `SEED_USER_PASSWORD` |
| `user@gmail.com` | те саме |
| `larry@gmail.com` | те саме |

### 4. Запуск

```bash
npm run dev
```

| URL | |
| --- | --- |
| http://localhost:3000 | API |
| http://localhost:3000/api-docs/ | Swagger |
| `GET /api/health` | healthcheck |

Усі бізнес-роути: префікс **`/api`**.

## Змінні середовища

Шаблон: [`.env.example`](./.env.example) (аналог `.env.template` з критеріїв допуску).

| Змінна | Навіщо |
| --- | --- |
| `DATABASE_URL` | Postgres для Prisma |
| `APP_URL` | базовий URL |
| `PORT` | порт API (`3000`) |
| `JWT_SECRET` | підпис JWT |
| `ACCESS_TOKEN_DURATION_MINUTES` | TTL access |
| `REFRESH_TOKEN_DURATION_DAYS` | TTL refresh |
| `CLOUDINARY_CLOUD_NAME` / `API_KEY` / `API_SECRET` | upload |
| `SEED_USER_PASSWORD` | пароль seed-юзерів (опційно) |
| `POSTGRES_*` | docker-compose |

Секрети лише в `.env` / панелі Render — не в git.

## Скрипти

```bash
npm run dev              # tsx watch
npm run build            # prisma generate + tsc
npm start                # node dist/server.js
npm run typecheck        # tsc --noEmit
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run prisma:studio
```

## Структура

```
src/
  app.ts / server.ts
  config/          # auth env, cloudinary, logger, swagger
  routes/          # Express + OpenAPI comments
  controllers/
  services/
  repositories/
  middlewares/     # auth, validate, upload, recipeOwner, errorHandler
  errors/
  lib/prisma.ts
  utils/
prisma/
  schema/          # User, Session, Recipe, Category, Area, Ingredient, Testimonial
  migrations/
  seed.ts
  seed-data/       # JSON з матеріалів курсу
docker-compose.yml
render.yaml
```

## Ендпоінти за ТЗ

Повні схеми тіл запитів/відповідей — у **Swagger**. Нижче — відповідність обовʼязковому ТЗ.

### `/auth`

| ТЗ | Method · Path | Доступ |
| --- | --- | --- |
| Реєстрація | `POST /api/auth/register` | public |
| Логін | `POST /api/auth/login` | public |
| Прошарок авторизації | JWT middleware (`Authorization: Bearer`) | — |
| Logout | `POST /api/auth/logout` | private |
| *(додатково)* Refresh | `POST /api/auth/refresh` | public + refreshToken |

### `/users`

| ТЗ | Method · Path | Доступ |
| --- | --- | --- |
| Поточний користувач (avatar, name, email, #recipes, #favorites, #followers, #following) | `GET /api/users/me` | private |
| Інший користувач (avatar, name, email, #recipes, #followers) | `GET /api/users/:id` | private |
| Оновити avatar | `PATCH /api/users/me/avatar` | private (multipart `avatar`) |
| Підписники | `GET /api/users/:id/followers` · також `/users/me/followers` | private |
| Підписки | `GET /api/users/:id/following` · також `/users/me/following` | private |
| Підписатись | `POST /api/users/:id/follow` | private |
| Відписатись | `DELETE /api/users/:id/follow` | private |
| *(alias)* subscribe | `POST\|DELETE /api/users/:id/subscribe` | private |

### `/categories` · `/areas` · `/ingredients` · `/testimonials`

| ТЗ | Method · Path | Доступ |
| --- | --- | --- |
| Список категорій | `GET /api/categories` | public |
| Список регіонів (areas) | `GET /api/areas` | public |
| Список інгредієнтів | `GET /api/ingredients` | public |
| Список відгуків | `GET /api/testimonials` | public |
| *(додатково)* відгуки юзера | `GET /api/testimonials/:userId` | public |

### `/recipes`

| ТЗ | Method · Path | Доступ |
| --- | --- | --- |
| Пошук за category / ingredient / area + пагінація | `GET /api/recipes?category&ingredient&area&page&limit` | public |
| Деталі за id | `GET /api/recipes/:id` | public |
| Popular (за кількістю favorites) | `GET /api/recipes/popular` | public |
| Створити власний | `POST /api/recipes` | private (FormData) |
| Видалити власний | `DELETE /api/recipes/:id` | private (owner) |
| Власні рецепти | `GET /api/recipes/own` | private |
| Додати в favorites | `POST /api/recipes/:id/favorite` | private |
| Прибрати з favorites | `DELETE /api/recipes/:id/favorite` | private |
| Список favorites | `GET /api/recipes/favorites` | private |
| *(додатково)* Edit | `PATCH /api/recipes/:id` | private (owner) |
| *(додатково)* Рецепти юзера | `GET /api/recipes/user/:id` | private |

Фільтри списку — за **id** сутностей:

```
GET /api/recipes?category=<id>&ingredient=<id>&area=<id>&page=1&limit=12
```

### Favorites (alias-роути)

`GET|POST|DELETE /api/favorites[/:recipeId]` — дублюють логіку favorites для зручності клієнта.

## Auth (коротко)

1. `register` / `login` → `accessToken`, `refreshToken`, `user`
2. Protected: `Authorization: Bearer <accessToken>`
3. `POST /auth/refresh` → новий access
4. `logout` інвалідує session у БД

TTL задається env (`ACCESS_TOKEN_DURATION_MINUTES`, `REFRESH_TOKEN_DURATION_DAYS`).

## Upload

- Avatar: `PATCH /users/me/avatar`, поле `avatar`
- Recipe: `POST` / `PATCH /recipes`, поле `mainImage`
- Зберігання: **Cloudinary**

Без валідних Cloudinary-ключів upload локально не працює.

## Моделі (Prisma)

- **User**, **Session**
- **Recipe**, **RecipeIngredient**
- **Category**, **Area**, **Ingredient**, **Testimonial**

Файли: `prisma/schema/`.

## Deploy (Render)

Конфіг: [`render.yaml`](./render.yaml)

1. Build: `npm ci` → `prisma generate` → `migrate deploy` → `seed` → `build`
2. Start: `npm start`
3. Env: `DATABASE_URL`, `JWT_SECRET`, Cloudinary, опційно `SEED_USER_PASSWORD`, `NODE_VERSION`

Live docs: https://foodies-backend-bklu.onrender.com/api-docs/

> Free Render може «засинати» після простою — перший запит після паузи буває повільним.

## CI

[`.github/workflows/ci.yml`](./.github/workflows/ci.yml) — на push/PR у `main` і `dev`: `npm ci` → `npm run typecheck`.

Робочі гілки після merge видаляються; залишаються `main` / `dev`.

## Критерії допуску (backend)

- [x] Сервер + CORS + централізована обробка помилок
- [x] БД ініціалізована, підключена, seed з матеріалів курсу
- [x] Увесь обовʼязковий функціонал `/auth` `/users` `/categories` `/areas` `/ingredients` `/testimonials` `/recipes`
- [x] Swagger-документація ендпоінтів
- [x] Секрети в `.env`, шаблон `.env.example`
- [x] Deploy на **Render**
- [x] Код-ревʼю за процесом команди / менторів

## Матеріали для наповнення БД (з ТЗ)

- MongoDB JSON: https://drive.google.com/file/d/1qaJTbOMQq-7w4omz1sjDxa5qrVhyOyvU/view?usp=sharing
- SQL / CSV: https://drive.google.com/drive/folders/18PA4F-uMFJYNz50L21KV0KipcT-cpPcs?usp=drive_link

У проєкті дані лежать у `prisma/seed-data/` і сіються через `npm run prisma:seed`.

## Підключення фронтенду

```env
VITE_API_URL=http://localhost:3000/api
VITE_USE_MOCK=false
```

Production:

```env
VITE_API_URL=https://foodies-backend-bklu.onrender.com/api
```

Деталі UI: [frontend README](https://github.com/LilianaLukash/Foodies/blob/main/frontend/README.md).

## Корисні посилання

- [Frontend live](https://lilianalukash.github.io/Foodies/)
- [Frontend README](https://github.com/LilianaLukash/Foodies/blob/main/frontend/README.md)
- [Swagger](https://foodies-backend-bklu.onrender.com/api-docs/)
- [Figma](https://www.figma.com/design/TKl7kDNvwtz62RsuWNnQ5E/Foodies)
