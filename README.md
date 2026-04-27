# void-cast

A minimal real-time web app where thoughts become floating words on an
infinite canvas.

Users type short messages that appear, animate, and drift across a
shared space. Everyone sees the same evolving "void".

------------------------------------------------------------------------

## ✨ Features

-   Real-time updates via Server-Sent Events (SSE)
-   Infinite canvas with zoom & pan
-   Animated word drift
-   New message animation (center → shrink → drift)
-   Deterministic positioning (same layout for all users)

------------------------------------------------------------------------

## 🛠 Tech Stack

**Frontend** - React + Vite - D3.js

**Backend** - Fastify - Drizzle ORM

**Database** - PostgreSQL (Docker)

**Realtime** - SSE

------------------------------------------------------------------------

## 🚀 Getting Started

``` bash
# install deps
npm install

# start everything (client + server)
npm run dev
```

Make sure PostgreSQL is running (via docker-compose).

------------------------------------------------------------------------

## ⚙️ Config

All configuration is in `.env`.

Includes: - API + DB config - Text limits - Animation tuning - UI labels

------------------------------------------------------------------------

## 📦 Project Structure

    client/   → frontend (React + Vite)
    server/   → backend (Fastify + Drizzle)

------------------------------------------------------------------------

## ⚠️ Notes

-   Content is user-generated and unmoderated
-   Basic limits and protections are planned
-   Project is experimental / artistic

------------------------------------------------------------------------

## 📄 License

-   Code: AGPL-3.0
-   Design/Concept: CC BY-NC 4.0
