# void-cast

A minimal real-time web app where thoughts become floating words on an infinite canvas.

Users type short messages that appear, animate, and drift across a shared space. Everyone sees the same evolving "void".


![React](https://img.shields.io/badge/react-Vite-61DAFB)
![D3](https://img.shields.io/badge/viz-D3.js-F9A03C)
![Fastify](https://img.shields.io/badge/backend-Fastify-000000)
![PostgreSQL](https://img.shields.io/badge/db-PostgreSQL-4169E1)
![Docker](https://img.shields.io/badge/docker-compose-2496ED)
![SSE](https://img.shields.io/badge/realtime-SSE-orange)
![License](https://img.shields.io/badge/license-AGPL--3.0-green)

---

## ✨ Features

- Real-time updates via Server-Sent Events (SSE)
- Infinite canvas with zoom & pan
- Animated word drift (time-based movement)
- New message animation (center → shrink → drift)
- Deterministic positioning (same layout for all users)
- Share link — captures current view position, copies `/c/hash` URL
- Random position jump button
- Rate limiting (10 casts/minute per IP)
- Auto-closing SSE on idle (page visibility + inactivity detection)
- In-memory write queue with batch inserts and burst protection
- Content disclaimer modal
- Mobile responsive layout

---

## 🛠 Tech Stack

**Frontend** — React + Vite, D3.js

**Backend** — Fastify, Drizzle ORM

**Database** — PostgreSQL (Docker)

**Realtime** — SSE

---

## 🚀 Getting Started

```bash
# install deps
npm install

# start everything (client + server)
npm run dev
```

Make sure PostgreSQL is running (via docker-compose).

---

## ⚙️ Config

All configuration is in `.env`. Includes API + DB config, text limits, animation tuning, and UI labels.

---

## 📦 Project Structure

```
client/   → frontend (React + Vite)
server/   → backend (Fastify + Drizzle)
```

---

## 📄 License

- Code: AGPL-3.0
- Design/Concept: CC BY-NC 4.0