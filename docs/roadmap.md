## 🚀 void-cast --- Implementation Roadmap

### 🔴 **LAUNCH BLOCK (Must Have)**
  #### Formatting
  - [ ] Remove obsolete drift variables from `.env`
  - [ ] Consolidate deterministic functions
  #### Database
  - [ ] Database index optimization `(createdAt)`
  - [ ] Database auto-cleanup (keep last 5000 casts)
  - [ ] In-memory queue for database writes (batch inserts, burst protection)
  #### Functionality
  - [X] Share link button with copy to clipboard (captures current view position, updates URL, copies /c/hash)
  - [X] Update position button (to move to random place)
  - [X] Support button
  #### Sequrity
  - [X] Basic rate limiting (per IP, 10 casts/minute)
  - [X] Content disclaimer link in Nav (opens modal with content warning)
  - [ ] Close SSE on idle connection (page visibility API + user inactivity)
  #### Polish
  - [X] Basic mobile responsive layout
  - [X] ABOUT.md content (philosophy, rules, credits, disclaimer)

---

### 🟠 **STABILITY BLOCK**
- [ ] Mobile responsive layout
- [ ] Error boundaries with graceful fallbacks
- [ ] SSE reconnection with exponential backoff
- [ ] Input validation edge cases
- [ ] Backend health checks

---

### 🟡 **POLISH BLOCK**
- [ ] Nav hover states (visual feedback on mouse over)
- [ ] Smooth animations (fade/slide for modals, UI elements)


---

### 🟢 **GROWTH BLOCK**
- [ ] Identical message clustering + real-time merging — same text gravitates together, new matches join existing cluster
- [ ] Weighted size — larger clusters scale up based on message count
- [ ] Fading messages — older messages gradually fade out (age-based opacity)
- [ ] Optional name/signature — user can attach name to cast (optional field)
- [ ] Optional color picker — user chooses text color for their casts (overrides default white)


---

**Which block do you want to start with?**
