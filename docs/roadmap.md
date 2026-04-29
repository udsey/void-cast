## 🚀 void-cast --- Implementation Roadmap

### 🔴 **LAUNCH BLOCK (Must Have)**
- [ ] Fix live update of casts
- [ ] Add cooldown for message sending (?)
- [ ] PG cron job for records delete
- [ ] Moblie responsice layout

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
- [ ] Consolidate deterministic functions


---

### 🟢 **GROWTH BLOCK**
- [ ] Identical message clustering + real-time merging — same text gravitates together, new matches join existing cluster
- [ ] Weighted size — larger clusters scale up based on message count
- [ ] Fading messages — older messages gradually fade out (age-based opacity)
- [ ] Optional name/signature — user can attach name to cast (optional field)
- [ ] Optional color picker — user chooses text color for their casts (overrides default white)



