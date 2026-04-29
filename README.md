# void-cast
<p align="center">
  <img src="https://github.com/user-attachments/assets/2e601844-ca3d-4c3d-9c25-58af787e40db" width="33%" />
  <img src="https://github.com/user-attachments/assets/6fe46ebe-8844-4616-802e-4b9f3ddf661c" width="33%" />
  <img src="https://github.com/user-attachments/assets/98e2a3f0-d2ac-42ea-944a-d3a0cf8b5b04" width="33%" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/react-Vite-61DAFB" />&nbsp;
  <img src="https://img.shields.io/badge/viz-D3.js-F9A03C" />&nbsp;
  <img src="https://img.shields.io/badge/backend-Fastify-000000" />&nbsp;
  <img src="https://img.shields.io/badge/db-PostgreSQL-4169E1" />&nbsp;
  <img src="https://img.shields.io/badge/docker-compose-2496ED" />&nbsp;
  <img src="https://img.shields.io/badge/realtime-SSE-orange" />&nbsp;
  <img src="https://img.shields.io/badge/license-AGPL--3.0-green" />
</p>

## ✨ Features

- Real-time updates via Server-Sent Events (SSE)
- Infinite canvas with pan
- Animated word drift (time-based movement)
- New message animation (center → shrink → drift)
- Deterministic positioning (same layout for all users)
- Share link — captures current view position, copies URL
- Random position jump button
- Rate limiting (10 casts/minute per IP)
- Auto-closing SSE on idle (page visibility + inactivity detection)
- In-memory write queue with batch inserts and burst protection
- Mobile responsive layout

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
