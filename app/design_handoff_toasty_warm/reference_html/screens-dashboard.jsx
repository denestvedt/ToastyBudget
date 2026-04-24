// Dashboard screens — three variations × light/dark
// All three render via shared primitives but have distinct LAYOUTS too,
// not just colors. Direction 1 = data-dense Monarch-feel, Dir 2 = editorial
// hero, Dir 3 = chunky bold cards.

const NAV = [
  { label: 'Dashboard', icon: 'grid' },
  { label: 'Budget',    icon: 'wallet' },
  { label: 'Transactions', icon: 'arrows' },
  { label: 'Accounts',  icon: 'bank' },
  { label: 'Goals',     icon: 'target' },
  { label: 'Reports',   icon: 'chart' },
  { label: 'Settings',  icon: 'gear' },
];

const CATS = [
  { name: 'Groceries', icon: 'bread', spent: 412, budget: 600 },
  { name: 'Dining', icon: 'coffee', spent: 287, budget: 250, tone: 'warn' },
  { name: 'Rent', icon: 'home', spent: 1850, budget: 1850 },
  { name: 'Transport', icon: 'car', spent: 142, budget: 300 },
  { name: 'Entertainment', icon: 'film', spent: 89, budget: 150 },
  { name: 'Shopping', icon: 'bag', spent: 320, budget: 200 },
];

const TXNS = [
  { name: 'Trader Joe\'s', cat: 'Groceries', date: 'Apr 22', amount: '64.21', icon: 'bread' },
  { name: 'Blue Bottle Coffee', cat: 'Dining', date: 'Apr 22', amount: '6.50', icon: 'coffee' },
  { name: 'Paycheck — Acme Co', cat: 'Income', date: 'Apr 21', amount: '4,200.00', icon: 'trend-up', incoming: true },
  { name: 'Shell Gas Station', cat: 'Transport', date: 'Apr 20', amount: '48.30', icon: 'car' },
  { name: 'Netflix', cat: 'Entertainment', date: 'Apr 19', amount: '15.49', icon: 'film' },
  { name: 'Whole Foods Market', cat: 'Groceries', date: 'Apr 18', amount: '92.14', icon: 'bread' },
];

const SPEND_BARS = [
  { label: 'M', value: 45 }, { label: 'T', value: 67 }, { label: 'W', value: 38 },
  { label: 'T', value: 91, highlight: true }, { label: 'F', value: 124, highlight: true },
  { label: 'S', value: 78 }, { label: 'S', value: 52 },
];

// ─── DASHBOARD V1 — Toasty Warm (Monarch-influenced, dense) ──────────────
function DashboardV1({ theme, dirKey }) {
  return (
    <Frame theme={theme}>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar theme={theme} active="Dashboard" items={NAV}/>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <TopBar theme={theme} title="Good morning, Alex" subtitle="Here's where your April is heading."
            right={<div style={{ display: 'flex', gap: 8 }}>
              <MonthSwitcher theme={theme}/>
              <Btn theme={theme} primary icon="plus">Add transaction</Btn>
            </div>}/>
          <div style={{ flex: 1, padding: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Top stat row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <Stat theme={theme} label="Budgeted" value="$3,450" sub="Apr 1 – Apr 30"/>
              <Stat theme={theme} label="Spent" value="$2,318" sub="67% of budget"/>
              <Stat theme={theme} label="Remaining" value="$1,132" sub="$56/day for 20 days" tone="good"/>
              <Stat theme={theme} label="Net worth" value="$24,891" sub="↑ $412 this week" tone="good"/>
            </div>

            {/* Two-column: budget + chart */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12, flex: 1, minHeight: 0 }}>
              <Card theme={theme} pad={16} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>Budget by category</div>
                  <Pill theme={theme}>6 categories</Pill>
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  {CATS.slice(0, 5).map(c => <CatRow key={c.name} theme={theme} {...c}/>)}
                </div>
              </Card>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Card theme={theme} pad={14}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700 }}>This week</div>
                    <span style={{ fontSize: 11, color: theme.textDim, ...NUM_STYLE }}>$495.40</span>
                  </div>
                  <Bars theme={theme} data={SPEND_BARS} height={70}/>
                </Card>
                <Card theme={theme} pad={14} style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>Recent activity</div>
                  {TXNS.slice(0, 3).map(t => <TxRow key={t.name} theme={theme} {...t}/>)}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

// ─── DASHBOARD V2 — Hearth (editorial, generous space, serif moments) ──
function DashboardV2({ theme, dirKey }) {
  return (
    <Frame theme={theme} fontFamily={FONTS.sans}>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar theme={theme} active="Dashboard" items={NAV} variant="hard"/>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Editorial top — big serif headline */}
          <div style={{ padding: '28px 32px 20px', borderBottom: `1px solid ${theme.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMute, textTransform: 'uppercase', letterSpacing: '0.14em' }}>Wednesday · April 23</div>
                <div style={{ fontFamily: FONTS.serif, fontSize: 36, lineHeight: 1.05, marginTop: 6, fontWeight: 400, letterSpacing: '-0.02em' }}>
                  You have <span style={{ color: theme.accent, fontStyle: 'italic' }}>$1,132</span> left to spend this month.
                </div>
              </div>
              <Btn theme={theme} primary icon="plus">New entry</Btn>
            </div>
          </div>

          <div style={{ flex: 1, padding: 24, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {/* Big donut left */}
            <Card theme={theme} pad={20} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Donut theme={theme} size={170} center={{ label: 'SPENT', value: '67%' }} data={[
                { value: 412, color: theme.accent },
                { value: 287, color: theme.accent2 },
                { value: 142, color: theme.good },
                { value: 89, color: theme.warn },
                { value: 320, color: theme.bad },
                { value: 1132, color: theme.surface2 },
              ]}/>
              <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', width: '100%' }}>
                {CATS.slice(0, 4).map((c, i) => (
                  <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: [theme.accent, theme.accent2, theme.good, theme.warn][i] }}/>
                    <span style={{ color: theme.textDim }}>{c.name}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Middle — top categories list */}
            <Card theme={theme} pad={18}>
              <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 16, marginBottom: 10, color: theme.textDim }}>What you spent on</div>
              {CATS.slice(0, 4).map(c => <CatRow key={c.name} theme={theme} {...c}/>)}
            </Card>

            {/* Right — accounts mini */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Card theme={theme} pad={16}>
                <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: theme.textMute }}>Net worth</div>
                <div style={{ fontFamily: FONTS.serif, fontSize: 32, fontWeight: 400, marginTop: 4, ...NUM_STYLE, fontFamily: FONTS.serif }}>$24,891</div>
                <Spark theme={theme} data={[20, 22, 21, 23, 22, 24, 23, 25, 24, 25]} width={220} height={36}/>
                <div style={{ fontSize: 10.5, color: theme.good, marginTop: 4 }}>↑ 1.7% this week</div>
              </Card>
              <Card theme={theme} pad={16} style={{ flex: 1 }}>
                <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 14, marginBottom: 8, color: theme.textDim }}>Accounts</div>
                {[
                  { n: 'Chase Checking', v: '4,201.18' },
                  { n: 'Ally Savings', v: '18,402.50' },
                  { n: 'Amex Gold', v: '−1,247.30' },
                ].map(a => (
                  <div key={a.n} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${theme.border}`, fontSize: 12 }}>
                    <span>{a.n}</span>
                    <span style={{ ...NUM_STYLE, fontWeight: 600 }}>${a.v}</span>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

// ─── DASHBOARD V3 — Kitchen (chunky, bold borders, playful) ──────────────
function DashboardV3({ theme, dirKey }) {
  const hard = `2px solid ${theme.text}`;
  return (
    <Frame theme={theme}>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Custom heavy sidebar */}
        <div style={{ width: 180, borderRight: hard, padding: 16, display: 'flex', flexDirection: 'column', gap: 4, background: theme.surface }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, padding: 4 }}>
            <div style={{ width: 32, height: 32, background: theme.accent, border: hard, borderRadius: 8, display: 'grid', placeItems: 'center' }}>
              <ToastMark size={20} color={theme.bg}/>
            </div>
            <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.02em' }}>ToastyBudget</span>
          </div>
          {NAV.map(it => (
            <div key={it.label} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px',
              border: it.label === 'Dashboard' ? hard : '2px solid transparent',
              background: it.label === 'Dashboard' ? theme.accent : 'transparent',
              color: it.label === 'Dashboard' ? theme.bg : theme.text,
              fontSize: 12.5, fontWeight: it.label === 'Dashboard' ? 700 : 500,
              borderRadius: 8,
              boxShadow: it.label === 'Dashboard' ? `3px 3px 0 ${theme.text}` : 'none',
            }}>
              <Icon name={it.icon} size={14}/>
              <span>{it.label}</span>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Bold header band */}
          <div style={{ padding: '20px 24px', borderBottom: hard, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: theme.surface }}>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em' }}>Dashboard</div>
              <div style={{ fontSize: 12, color: theme.textDim, marginTop: 2 }}>April 2026 · Week 4</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={{ ...btnIcon(theme), width: 36, height: 36, border: hard, borderRadius: 8 }}>
                <Icon name="search" size={16}/>
              </button>
              <button style={{
                padding: '8px 16px', fontSize: 13, fontWeight: 700,
                background: theme.accent, color: theme.bg,
                border: hard, borderRadius: 8,
                boxShadow: `3px 3px 0 ${theme.text}`,
                display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
                <Icon name="plus" size={14}/> Add
              </button>
            </div>
          </div>

          <div style={{ flex: 1, padding: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Hero remaining card */}
            <div style={{
              border: hard, borderRadius: 12, padding: '18px 22px',
              background: theme.accent, color: theme.bg,
              boxShadow: `4px 4px 0 ${theme.text}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.85 }}>You can still spend</div>
                <div style={{ fontSize: 40, fontWeight: 800, ...NUM_STYLE, lineHeight: 1, marginTop: 4 }}>$1,132.40</div>
                <div style={{ fontSize: 12, marginTop: 6, opacity: 0.9 }}>~ $56/day for the next 20 days</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Icon name="flame" size={48} stroke={2}/>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, flex: 1, minHeight: 0 }}>
              {[
                { label: 'BUDGETED', value: '$3,450', sub: 'Set Apr 1' },
                { label: 'SPENT', value: '$2,318', sub: '67% used' },
                { label: 'NET WORTH', value: '$24,891', sub: '↑ $412 wk', tone: 'good' },
              ].map((s, i) => (
                <div key={i} style={{
                  border: hard, borderRadius: 10, padding: 14, background: theme.surface,
                  boxShadow: `3px 3px 0 ${theme.text}`,
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: theme.textMute }}>{s.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, ...NUM_STYLE, marginTop: 4, color: s.tone === 'good' ? theme.good : theme.text }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: theme.textDim, marginTop: 2 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, flex: 1.3, minHeight: 0 }}>
              <div style={{ border: hard, borderRadius: 10, padding: 14, background: theme.surface, overflow: 'hidden' }}>
                <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 6 }}>Top categories</div>
                {CATS.slice(0, 3).map(c => <CatRow key={c.name} theme={theme} {...c}/>)}
              </div>
              <div style={{ border: hard, borderRadius: 10, padding: 14, background: theme.surface, overflow: 'hidden' }}>
                <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>This week</div>
                <Bars theme={theme} data={SPEND_BARS} height={90}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

Object.assign(window, { DashboardV1, DashboardV2, DashboardV3, NAV, CATS, TXNS, SPEND_BARS });
