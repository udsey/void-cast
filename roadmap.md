## 🚀 void-cast --- Implementation Roadmap

### 🔴 **LAUNCH BLOCK (Must Have)**
- [ ] Remove obsolete drift variables from `.env`
- [ ] Consolidate deterministic functions
- [ ] Database index optimization `(createdAt)`
- [ ] Share link button with copy to clipboard (captures current view position, updates URL, copies /c/hash)
- [ ] Basic rate limiting (per IP, 10 casts/minute)
- [ ] Content disclaimer link in Nav (opens modal with content warning)
- [ ] Database auto-cleanup (keep last 5000 casts)

---

### 🟠 **STABILITY BLOCK**
- [ ] Mobile responsive layout
- [ ] Error boundaries with graceful fallbacks
- [ ] SSE reconnection with exponential backoff
- [ ] Input validation edge cases
- [ ] Backend health checks

---

### 🟡 **POLISH BLOCK**
- [ ] ABOUT.md content (philosophy, rules, credits, disclaimer)
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

### 🔵 **NICE TO HAVE BLOCK**
- [ ] Sound effects (subtle, optional)
- [ ] Keyboard shortcuts — Enter to post, Esc to clear input, arrow keys to pan


---

**Which block do you want to start with?**
