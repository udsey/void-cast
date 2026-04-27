# 🚀 void-cast --- TODO Roadmap

## 🔴 P0 --- Core Experience (do these first)

### 🌌 Spatial Behavior

-   [ ] Open canvas at **random coordinates**
-   [ ] Anchor new message to **user's current viewport center**
-   [ ] Ensure **deterministic positioning across sessions**\
    → same message = same coordinates for all users

### ⚡ Real-Time Consistency

-   [ ] Sync positioning logic server-side or shared util\
-   [ ] Prevent visual "jumping" when new users connect

------------------------------------------------------------------------

## 🟠 P1 --- Safety & Content Controls

### ⚠️ Content Safety

-   [ ] Add **content disclaimer modal**
-   [ ] Add **report / moderation strategy**

### 🔐 Abuse Prevention

-   [ ] Rate limit per IP/user
-   [ ] Prevent spam bursts

### 🚫 Restrictions

-   [ ] Block or sanitize **links (URLs)**
-   [ ] Detect **repeated messages**

------------------------------------------------------------------------

## 🟡 P2 --- Data & System Limits

### 🗄 Database Hygiene

-   [ ] Cap total records
-   [ ] Auto-delete old entries
-   [ ] Add index on `createdAt`

### 📊 Scaling Behavior

-   [ ] Decide history strategy (ephemeral vs persistent)

------------------------------------------------------------------------

## 🟢 P3 --- UI / UX Polish

### 🎨 Interface

-   [ ] Nav hover states
-   [ ] Input feedback improvements
-   [ ] Mobile responsiveness

### 🧭 Experience

-   [ ] Smooth initial zoom animation
-   [ ] Optional background styling

------------------------------------------------------------------------

## 🔵 P4 --- Content & Pages

-   [ ] Write `ABOUT.md`
-   [ ] Add Stats page
-   [ ] Add footer

------------------------------------------------------------------------

## 🟣 P5 --- Deployment & Infra

-   [ ] Dockerfile (server)
-   [ ] Dockerfile (client)
-   [ ] Deploy to Railway
-   [ ] Env validation on boot

------------------------------------------------------------------------

## 🟤 P6 --- Nice-to-Have

-   [ ] Weighted words
-   [ ] Fading messages
-   [ ] Search feature
-   [ ] User color identity

------------------------------------------------------------------------

## 🧠 Implementation Notes

### Deterministic Positioning

Use seeded randomness:

``` js
const seed = hash(cast.id);
const x = pseudoRandom(seed) * spread;
const y = pseudoRandom(seed + 1) * spread;
```

### Repeated Messages

-   Track count
-   Increase visual weight instead of blocking

### Record Limiting

``` sql
DELETE FROM casts
WHERE id IN (
  SELECT id FROM casts
  ORDER BY createdAt ASC
  LIMIT X
);
```

------------------------------------------------------------------------

## 🧭 Suggested Order

1.  Core spatial logic\
2.  Safety & restrictions\
3.  DB limits\
4.  UI polish\
5.  Deployment\
6.  Extras