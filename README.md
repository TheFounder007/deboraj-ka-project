# NEO // AXIOM — Underground Streetwear & Sneaker Lab
**1st Year Web Development — Continuous Assessment (CA) Project 3: Alternative Frontend**

A high-contrast Neo-Brutalist & Cyber-Streetwear storefront frontend built with semantic **HTML5**, modern **CSS3 (Grid, Flexbox, Hard-Edge Positioning, Tokens)**, and vanilla **JavaScript (ES6+) with Web Audio API SFX**.

---

## 🎨 Contrast & Visual Identity Comparison

This is a completely different front-end design, tone, and product universe compared to the first storefront (*Atelier Éclat*):

| Dimension | Store 1 (*Atelier Éclat*) | Store 2 (*NEO // AXIOM*) |
| :--- | :--- | :--- |
| **Aesthetic Theme** | Quiet Luxury, Parisian Minimalism, Editorial Sophistication | Neo-Brutalist, Cyberpunk Streetwear, Industrial Techwear Lab |
| **Color System** | Silk Alabaster, Warm Camel, Tuscan Terracotta, Gold | Void Black (`#09090B`), Electric Acid Volt (`#D8FF00`), Cyber Crimson, Stark White |
| **Typography** | Editorial Serif (*Cormorant Garamond*) + Clean Sans | Monolithic Brutalist Display (*Syne*) + Monospace (*JetBrains Mono*) + Geometric Sans |
| **Product Universe** | Virgin Wool Trenches, Cashmere Knits, Silk Evening Slips | Modular 3-Layer Parkas, 520 GSM Heavy Hoodies, Platform Sneakers, Tactical Chest Rigs |
| **Card Treatment** | Soft drop shadows, gentle image zooms, refined lines | Hard-edge brutalist offset shadows (`4px 4px 0px`), corner tech brackets, dual-image scanline flash |
| **Special Features** | Lookbook journal, elegant slider drawers | Live drop countdown timer, synthesized Web Audio sound effects, rapid search tags |

---

## 📸 Core Brief Requirements Fulfilled

1. **Header & Brand Navigation**:
   - Glitch logo branding (`NEO // AXIOM [SYS_v2.8]`).
   - Tactical menu items with keyboard-style brackets: `[01] ALL DROPS`, `[02] NEW IN`, `[03] STREETWEAR`, `[04] SNEAKERS`, `[05] TACTICAL GEAR`, `[06] ARCHIVE (-30%)`, `[07] MANIFESTO`.
   - Control terminal with instant search HUD, synthesized Web Audio sound FX toggle, theme switcher, wishlist vault counter, and tactical stash bag badge.
2. **Promotional Hero Banner**:
   - Hero banner with coordinate HUD markers (`[LAT 35.6762° N // TOKYO]`), pulsing LED indicator, live telemetry stats, and promotional ticker with protocol code `AXIOM20`.
3. **16 Technical Product Cards**:
   - 16 distinct silhouettes across Outerwear, Hoodies, Cargos, Platform Sneakers, Runners, and Tactical Gear.
   - Dual-photo hover reveal showing secondary tech angles.
   - Real-time stock badges (`HOT DROP`, `LIMITED [80 PCS]`, `DROP // 08`, `SALE -25%`).
   - Technical specifications tag preview (GSM weight, Cordura® nylon, Vibram® soles).
4. **Category Organization & Filtering**:
   - Filter chips for *All Drops (16)*, *New In (6)*, *Streetwear (7)*, *Footwear (4)*, *Tactical Gear (5)*, and *Archive Sale (6)*.
   - Synchronized navigation linking.
5. **CSS Grid & Flexbox**:
   - Responsive CSS Grid matrix (4 columns desktop, 3 columns laptops, 2 columns tablets, 1 column mobile).
   - Toggleable 2-column Poster View mode.
6. **CSS Positioning**:
   - `position: absolute` for HUD badges, corner bracket accents, vault bookmark buttons, bottom action decks, and coordinate stamps.
   - `position: sticky` for navigation header.
   - `position: fixed` for slide-over drawers, modal dialogues, and toast notifications.
7. **Optional Enhancements**:
   - Dark Cyber vs Industrial Light mode toggle with CSS variables.
   - Dual-image hover transitions with scanline flash.
   - Slide-over Tactical Stash Bag (Cart) with free dispatch meter ($150), voucher codes (`AXIOM20`, `DROP10`), and quantity steppers.
   - Slide-over Wishlist Vault.
   - Quick Spec Modal with multi-angle gallery, spec sheet, and dimension guide.
   - Simulated Dispatch Checkout modal.
   - Field Test Dispatch Logs (Customer reviews).
   - Drop Manifesto editorial feature.
   - VIP Drop Pass newsletter registration.

---

## 🗂️ File Structure

```
streetwear-store/
├── index.html           # Neo-Brutalist HTML5 semantic markup & dialogs
├── css/
│   └── styles.css       # Acid Volt tokens, brutalist shadows, CSS Grid matrix
├── js/
│   ├── products.js      # 16 Streetwear & Sneaker catalog dataset
│   └── app.js           # Filtering, cart, wishlist, web audio SFX, countdown
└── README.md            # Comprehensive project documentation
```

---

## 🚀 How to Run

### Direct Browser Open:
```bash
open /Users/sakshammohalkar/.gemini/antigravity/scratch/streetwear-store/index.html
```

### Local HTTP Server:
```bash
cd /Users/sakshammohalkar/.gemini/antigravity/scratch/streetwear-store
python3 -m http.server 8081
```
Then visit `http://localhost:8081` in your browser.
