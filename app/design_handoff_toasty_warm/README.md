# Handoff: ToastyBudget — "Toasty Warm" Visual Redesign

## Overview
Replace ToastyBudget's current generic dark + harsh-orange theme with a warm, cohesive "Toasty Warm" visual direction: cream background, deep-crust accent, pumpernickel text, and mono numerals. The goal is a financial app that feels calm and trustworthy while actually living up to its name — without inventing new product behavior. Keep all current flows, screens, and features; only change the visual language and a few layout details called out below.

## About the Design Files
The files in this bundle are **design references created in HTML** — interactive prototypes showing the intended look and behavior. They are **not production code to copy directly**. Your job is to **recreate these designs in ToastyBudget's existing codebase** (React + whatever the current stack is) using its established component patterns, routing, and data layer. If the codebase already has a theme file / CSS variables / Tailwind config, update *that* — don't introduce a parallel styling system.

Reference files are in `reference_html/`. Open `ToastyBudget Design.html` locally to explore all variations; the "Toasty Warm" direction (light + dark) is what ships.

## Fidelity
**High-fidelity.** Colors, type scale, spacing, border radii, and component structure are final. Pixel-match the **light-mode Hero Dashboard** (artboard labeled "Recommended · Toasty Warm · Light · Polished") — that is the north star. Other screens (Budget, Transactions, Add Transaction, Goals, Reports, Settings) follow the same token system and patterns; use them to extrapolate to any screen not explicitly shown.

---

## Design Tokens

### Colors — Light mode (default)

| Token              | Hex        | Use |
|--------------------|------------|-----|
| `--bg`             | `#FDF6EC`  | App background (cream) |
| `--surface`        | `#FFFCF5`  | Cards, sidebar, elevated panels |
| `--surface-2`      | `#F5ECDB`  | Sunken surfaces, progress-bar tracks, inputs |
| `--border`         | `#E8DAC0`  | Hairline dividers, card borders |
| `--text`           | `#2B1810`  | Primary text (pumpernickel) |
| `--text-dim`       | `#6B5340`  | Secondary text, labels |
| `--text-mute`      | `#9A826A`  | Tertiary text, uppercase eyebrows |
| `--accent`         | `#C94F1A`  | Primary accent (deep crust) — buttons, active nav, key numbers |
| `--accent-2`       | `#E8853A`  | Secondary accent (toast) — hero gradient end, charts |
| `--good`           | `#6B8E4E`  | Positive deltas, "on track" |
| `--warn`           | `#D97706`  | Over-budget warning |
| `--bad`            | `#A63A2A`  | Over-budget amount, destructive |

### Colors — Dark mode

| Token              | Hex        |
|--------------------|------------|
| `--bg`             | `#1A1108`  |
| `--surface`        | `#241810`  |
| `--surface-2`      | `#2E2015`  |
| `--border`         | `#3D2B1C`  |
| `--text`           | `#FDF6EC`  |
| `--text-dim`       | `#C4A888`  |
| `--text-mute`      | `#8A7258`  |
| `--accent`         | `#E8853A`  (toast glow — brighter than light mode's accent for legibility on dark) |
| `--accent-2`       | `#F5B871`  (butter) |
| `--good`           | `#A3C579`  |
| `--warn`           | `#F5B871`  |
| `--bad`            | `#E8735C`  |

### Typography

- **Sans** — **Inter** (Google Fonts, weights 400 / 500 / 600 / 700 / 800). Used for everything non-numeric.
- **Mono** — **JetBrains Mono** (Google Fonts, weights 400 / 500 / 600). Used for all dollar amounts, percentages, dates, and tabular data. Always apply `font-variant-numeric: tabular-nums; letter-spacing: -0.02em;` so numbers align column-wise.
- No serif. No other fonts.

Type scale (px):

| Role                  | Size | Weight | Notes |
|-----------------------|------|--------|-------|
| Hero number           | 44   | 700    | mono, tabular |
| Page title (H1)       | 22   | 700    | letter-spacing: -0.02em |
| Card title            | 14   | 700    | letter-spacing: -0.01em |
| Section title         | 13   | 700    | |
| Body                  | 12.5 | 400-500| |
| Secondary             | 12   | 400    | color: var(--text-dim) |
| Eyebrow / label       | 10–11| 600    | UPPERCASE, letter-spacing: 0.10em, color: var(--text-mute) |
| Micro                 | 10   | 500    | |

### Spacing & radii
- **Radius scale**: 4 (pills), 6 (input), 7 (button), 8–10 (card), 12–14 (hero cards).
- **Spacing**: 8/12/14/16/18/20/22/24 px — no arbitrary values. Standard card padding is `16–18px`.
- **Hairline borders**: always `1px solid var(--border)`, never thicker.
- No drop shadows in the Toasty Warm direction (keep it flat and warm).

### Iconography
- Stroke icons, **1.75px stroke**, `stroke-linecap: round`, `stroke-linejoin: round`, 24×24 viewBox, `currentColor`.
- Use Lucide (`lucide-react`) if not already installed — it matches this style exactly. Named mappings from the prototype → Lucide:
  - `grid` → `LayoutGrid`
  - `wallet` → `Wallet`
  - `arrows` → `ArrowLeftRight`
  - `bank` → `Landmark`
  - `target` → `Target`
  - `chart` → `BarChart3`
  - `gear` → `Settings`
  - `plus` → `Plus`
  - `search` → `Search`
  - `bread` → `Sandwich` (or a custom bread SVG — see `reference_html/tokens.jsx`)
  - `coffee` → `Coffee`
  - `home` → `Home`
  - `car` → `Car`
  - `film` → `Film`
  - `bag` → `ShoppingBag`
  - `flame` → `Flame`
  - `trend-up` → `TrendingUp`

### Logo mark
A stylized toast slice. SVG source in `reference_html/tokens.jsx` → `ToastMark`. In the sidebar, render inside a 28×28 rounded square with a subtle `linear-gradient(135deg, var(--accent-2), var(--accent))` background.

---

## Global App Shell

**Layout**: full-viewport flex row. Left sidebar (fixed 200px), right main column (flex:1, vertical flex).

### Sidebar (200px, `background: var(--surface)`, `border-right: 1px solid var(--border)`, padding 20px 14px)
1. **Logo row** — 28×28 gradient logo square + "ToastyBudget" (14px / 700 / letter-spacing -0.02em) + current month (9.5px / 500 / mute) stacked on the right.
2. **Nav items** — each 8×11 padded, 7px radius, 12.5px text, gap 10px between icon (15px) and label. Active state: `background: color-mix(in srgb, var(--accent) 12%, transparent)`, `color: var(--accent)`, weight 600. Inactive: `color: var(--text-dim)`, weight 500.
3. **"Daily pace" mini-card** — `background: var(--bg)`, `1px solid var(--border)`, radius 8, padding 12. Eyebrow "DAILY PACE" + big green mono number (18 / 700) + "Under by $12/day" sub + 4px progress bar.
4. **User row** (margin-top: auto) — 26px circle avatar with accent-2 background + name (12 / 600) + email (10 / mute).

Nav items (in order): Dashboard, Budget, Transactions, Accounts, Goals, Reports, Settings.

### Top bar (in main column)
- Padding `20px 28px`, `border-bottom: 1px solid var(--border)`.
- Left: eyebrow "WEDNESDAY, APRIL 23" + page title ("Good morning, Alex" on dashboard, or the page name elsewhere).
- Right row: search pill ("Search ⌘K"), month switcher (prev / month-label / next inside a bordered pill), primary "Add transaction" button.

---

## Screen: Dashboard (THE polished hero — pixel match this)

Below the top bar, padding 22px, gap 14px between sections.

### 1. Hero "Left to spend" card — the centerpiece
- Radius 14, padding `20px 24px`.
- `background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)`, text `#FFFCF5`.
- Subtle radial grain overlay at 90% 20%, 8% white opacity.
- 3-column grid (1.4fr / 1fr / 1fr), vertical hairlines between columns (`1px solid rgba(255,255,255,0.2)` as `border-left` with `padding-left: 24px` on columns 2 and 3).
- **Col 1**: eyebrow "LEFT TO SPEND IN APRIL" + `$1,132` (44px / 700 / mono) with `.40` rendered at 22px / opacity 0.7 + sub "20 days left · ~$56/day".
- **Col 2**: eyebrow "SPENT" + `$2,318` (22 / 700 / mono) + 5px white progress bar at 67% + "67% of $3,450 budget".
- **Col 3**: eyebrow "NET WORTH" + `$24,891` (22 / 700 / mono) + TrendingUp icon + "+$412 this week".

### 2. Two-column body (1.5fr / 1fr, gap 14)

**Left card — "Budget by category"** (`Card` component, padding 18):
- Header row: title (14 / 700) + sub "1 over · 5 on track" (11 / mute) + secondary "Manage" button.
- List of `CatRow` items, one per category, separated by `1px solid var(--border)`.

**Right column** (stacked, gap 14):
- **"This week" card** (padding 16): title + weekly total (mono right-aligned) + 68px-tall bar chart. Today's and yesterday's bars use `var(--accent)`, others use `var(--surface-2)`.
- **"Recent activity" card** (flex:1, padding 16): title + "See all →" link (accent color) + list of 4 `TxRow` items.

### `CatRow` anatomy
- Grid: `28px icon-tile | name+bar (flex) | amount (right)`.
- Icon tile: 28×28, radius 7, `background: color-mix(in srgb, var(--accent) 13%, transparent)`, icon color `var(--accent)`.
- Row body: name (12.5 / 600) on one line, mono amount `$spent / $budget` on the other, then a 5px progress bar (`--surface-2` track, `--accent` fill, or `--warn` / `--bad` if over).
- Padding 10px 0, bottom hairline.

### `TxRow` anatomy
- Grid: `icon | name+category | date | amount`.
- 28×28 neutral icon tile (`--surface-2` bg, `--text-dim` icon).
- Name (12.5 / 600) + category eyebrow (10.5 / mute).
- Date (10.5 / mute / mono).
- Amount (12.5 / 700 / mono). `var(--good)` with `+` for income, `var(--text)` with `−` for expenses.

---

## Screen: Budget / Categories
- Same shell + top bar. Page title "Budget", subtitle "6 categories · April 2026". Primary button "Category".
- Body is two groups ("Essentials" / "Lifestyle"), each with an eyebrow + mono group totals + a Card wrapping `CatRow` items.

## Screen: Transactions
- Top bar title "Transactions", subtitle dynamic ("{n} this month · ${total} total"). Right: secondary "Filter" + primary "Add".
- Search input bar under the top bar (surface bg, border, 8px radius, search icon left, "last 30d" pill right).
- Main Card contains a column header row (uppercase eyebrow labels: Merchant / Date / Amount) followed by `TxRow`s.

## Screen: Add Transaction (modal)
- Overlay `rgba(0,0,0,0.35)` over the Transactions screen.
- Modal: 380px wide, surface bg, 1px border, 12px radius, 22px padding, shadow `0 20px 60px rgba(0,0,0,0.3)`.
- Title "Add transaction" + close X.
- Centered big amount: `−$64.21` (34 / 700 / mono / accent color) + "tap to edit" hint.
- Fields (each with uppercase eyebrow label): Merchant, Category + Date (two-col), Account, Note (textarea). Fields have bg `var(--bg)`, `1px solid var(--border)`, radius 7, padding `10px 12px`.
- Footer: secondary "Cancel" (flex 1) + primary "Save transaction" (flex 2).

## Screen: Goals
- Top bar: title "Goals", subtitle "4 active · $19,370 saved across all", primary "New goal".
- 2-column grid of goal cards. Each card: icon tile + name/due-date + big `%` right-aligned (18 / 800 / mono / accent), mono `$cur of $tgt`, 8px progress bar, "Save $X/mo to hit it on time" hint.

## Screen: Reports
- Top bar: title "Reports", subtitle "6-month spending trends", segmented control (Month / Quarter / Year) where the active segment is `--accent` bg.
- **Top card**: "6-month average" eyebrow + `$2,426` (28 / 700 / mono) + "vs prior 6mo ↓ 8.2%" in `--good`. 140px monthly bar chart (current month highlighted).
- **Bottom grid (1.2fr / 1fr)**:
  - "Where it went · April" — horizontal bars per category (each bar a different swatch from the palette's accent/accent-2/good/warn/bad cycle).
  - "Insights" — pills ("Saving" / "Watch" / "Goal") with single-sentence copy under each.

## Screen: Settings
- Top bar: "Settings", "Account, budgeting, notifications".
- Sections (Profile, Budgeting, Notifications, Appearance), each with a small uppercase eyebrow and a Card containing `key : value` rows separated by hairlines. Each row has a chevron-right for edit affordance.
- Appearance row is special: 3 equal-width mode tiles (Light / Dark / System) with a 2px accent border on the selected one.

---

## Interactions & Behavior

- **Hover states**: nav items get a subtle `background: color-mix(in srgb, var(--text) 4%, transparent)` unless active. Buttons darken 4-6%. Rows get no hover on the dashboard, but full hover background on Transactions list.
- **Focus states**: `outline: 2px solid var(--accent); outline-offset: 2px;` — never remove focus outlines globally.
- **Transitions**: `transition: background 120ms ease, color 120ms ease, border-color 120ms ease;` on all interactive elements. No fancy animations.
- **Progress bars**: animate `width` with `transition: width 400ms cubic-bezier(0.2, 0.7, 0.3, 1)` when data updates.
- **Theme toggle**: the Settings appearance row toggles `html[data-theme="dark"]`; all tokens should be declared in both `:root` and `[data-theme="dark"]` blocks.

## State Management
Don't change the current state shape. Only visual. If the current app's empty state is the centered "No budget data yet" text (seen in the current app screenshot), replace it with a friendlier empty state: a small illustration or the toast logo, a one-sentence explainer, and a primary "Add your first category" CTA — styled to match the new tokens.

## Responsive
Not specified in this handoff — the prototypes are desktop-focused. If mobile is in scope, follow the same token system and collapse the sidebar to a bottom tab bar at <768px.

---

## Files in this bundle

```
design_handoff_toasty_warm/
├── README.md                          ← you are here
├── toasty-tokens.css                  ← drop-in CSS variables (light + dark)
├── reference_html/
│   ├── ToastyBudget Design.html       ← open this; focus the "Recommended" artboard
│   ├── tokens.jsx                     ← all palettes + icon set + logo mark
│   ├── primitives.jsx                 ← Frame, Sidebar, TopBar, Card, Stat, CatRow, TxRow, Donut, Bars, Pill, Btn
│   ├── screens-dashboard.jsx          ← 3 dashboard variants (use V1 — Toasty Warm)
│   ├── screens-other.jsx              ← Budget, Transactions, AddTx, Goals, Reports, Settings
│   ├── screens-hero.jsx               ← the polished hero — PIXEL MATCH THIS
│   └── design-canvas.jsx              ← canvas infrastructure (not needed for shipping code)
```

## Definition of done
- [ ] Tokens in place as CSS variables or theme object; `:root` and `[data-theme="dark"]` both defined.
- [ ] Inter + JetBrains Mono loaded; all currency/percentage/date text uses mono + `tabular-nums`.
- [ ] Dashboard hero card matches the polished reference.
- [ ] Sidebar matches (logo mark, nav, daily-pace card, user row).
- [ ] All 7 screens re-skinned against the new tokens.
- [ ] Existing functionality untouched — this is a visual refresh, not a behavior change.
