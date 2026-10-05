# Shelfile API

A household food-waste tracking API built with Express 5, TypeScript, MongoDB (Mongoose) and JWT auth. Runs on [Bun](https://bun.com).

## Setup

```bash
bun install
cp .env.example .env   # then fill in your own values
bun run dev
```

The server starts on `http://localhost:3000` by default.

## Environment variables

| Variable     | Description                          |
| ------------ | ------------------------------------ |
| `PORT`       | Port the server listens on           |
| `MONGO_URI`  | MongoDB connection string            |
| `JWT_SECRET` | Secret used to sign/verify JWTs      |

`.env` is gitignored — only `.env.example` is committed.

## Auth

`POST /api/auth/register` and `POST /api/auth/login` are public. Everything else requires a token:

```
Authorization: Bearer <token>
```

Tokens expire after 7 days.

## Routes

| Method | Endpoint                  | Auth | Description                          |
| ------ | ------------------------- | ---- | ------------------------------------ |
| GET    | `/`                       | –    | Health check                         |
| POST   | `/api/auth/register`      | –    | Create an account                    |
| POST   | `/api/auth/login`         | –    | Log in, get a JWT                    |
| GET    | `/api/auth/me`            | ✔    | Current user profile                 |
| POST   | `/api/households`         | ✔    | Create a household (you become admin)|
| POST   | `/api/households/join`    | ✔    | Join via invite code                 |
| GET    | `/api/households/me`      | ✔    | Your household, with members filled  |
| POST   | `/api/items`              | ✔    | Add an item to your household       |
| GET    | `/api/items`              | ✔    | List items (`?status=`, `?category=`)|
| GET    | `/api/items/:id`          | ✔    | Get one item                         |
| PATCH  | `/api/items/:id`          | ✔    | Update an item                       |
| DELETE | `/api/items/:id`          | ✔    | Delete an item                       |

## Domain rules

- A user belongs to **at most one** household. Create one or join one before adding items.
- Item `category` is one of `produce`, `dairy`, `meat`, `pantry`, `frozen`, `other`.
- Item `status` is one of `fresh`, `expiring-soon`, `expired`, `used`, `wasted`.
- If you omit `status` on create and pass an `expiryDate`, it's derived: past → `expired`, within 3 days → `expiring-soon`, otherwise `fresh`.
- `wasteScore` (0–100) is recalculated on every item create/update/delete as `wasted items / total items * 100`. Higher means more waste. It's returned alongside item responses and stored on the household.

Every item query is scoped to the caller's household, so one household can't read or modify another's items.

## Example

```bash
# register and log in
curl -X POST localhost:3000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Alice","email":"alice@example.com","password":"secret123"}'

curl -X POST localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"alice@example.com","password":"secret123"}'
# -> { "token": "eyJ..." }

# create a household, then add an item
curl -X POST localhost:3000/api/households \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Flat 4B"}'
# -> { "household": { "inviteCode": "935XM9", ... } }

curl -X POST localhost:3000/api/items \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Milk","category":"dairy","expiryDate":"2026-10-02"}'
# -> { "item": { "status": "expiring-soon", ... }, "wasteScore": 0 }
```

## Project layout

```
src/
  config/db.ts          # mongoose connection
  controllers/          # request handlers
  middleware/           # auth middleware
  models/               # User, Household, Item schemas + barrel
  routes/               # express routers
  types/                # shared interfaces + express augmentation
  utils/                # invite code generation, waste score
  index.ts              # express app
  server.ts             # entrypoint: loads env, connects db, listens
```

## Scripts

```bash
bun run dev        # start with hot reload
bun run start      # start normally
bun run typecheck  # tsc --noEmit
```

## Note on mongoose

The project targets `mongoose@^8`. mongoose 9 pulls in mongodb driver 7.x, which calls
`v8.isBuildingSnapshot()` — unimplemented in Bun as of 1.3.10, so the driver crashes on import.
