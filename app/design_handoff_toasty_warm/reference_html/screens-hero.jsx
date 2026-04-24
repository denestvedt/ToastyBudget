// Hero — the polished "winning direction" dashboard.
// Toasty Warm direction, light mode, generous + considered.
// This is what the codebase should aim for visually.

function HeroDashboard() {
  const theme = PALETTES.toasty.light;
  return (
    <Frame theme={theme}>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Sidebar */}
        <div style={{
          width: 200, flexShrink: 0,
          borderRight: `1px solid ${theme.border}`,
          padding: '20px 14px',
          display: 'flex', flexDirection: 'column', gap: 2,
          background: theme.surface,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '4px 10px 22px' }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: `linear-gradient(135deg, ${theme.accent2}, ${theme.accent})`,
              display: 'grid', placeItems: 'center',
            }}>
              <ToastMark size={18} color="#FFFCF5" glow={theme.accent}/>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: '-0.02em' }}>ToastyBudget</div>
              <div style={{ fontSize: 9.5, color: theme.textMute, fontWeight: 500 }}>April 2026</div>
            </div>
          </div>

          {NAV.map(it => (
            <div key={it.label} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 11px',
              borderRadius: 7,
              fontSize: 12.5,
              fontWeight: it.label === 'Dashboard' ? 600 : 500,
              background: it.label === 'Dashboard' ? theme.accent + '1F' : 'transparent',
              color: it.label === 'Dashboard' ? theme.accent : theme.textDim,
              cursor: 'pointer',
            }}>
              <Icon name={it.icon} size={15}/>
              <span>{it.label}</span>
            </div>
          ))}

          {/* Spend pace mini-card */}
          <div style={{ marginTop: 14, padding: 12, background: theme.bg, borderRadius: 8, border: `1px solid ${theme.border}` }}>
            <div style={{ fontSize: 9.5, fontWeight: 600, color: theme.textMute, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Daily pace</div>
            <div style={{ fontSize: 18, fontWeight: 700, ...NUM_STYLE, marginTop: 4, color: theme.good }}>$56</div>
            <div style={{ fontSize: 10, color: theme.textDim, marginTop: 1 }}>Under by $12/day</div>
            <div style={{ height: 4, background: theme.surface2, borderRadius: 99, marginTop: 8 }}>
              <div style={{ width: '67%', height: '100%', background: theme.good, borderRadius: 99 }}/>
            </div>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: theme.accent2, color: theme.bg, display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700 }}>A</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>Alex Chen</div>
              <div style={{ fontSize: 10, color: theme.textMute }}>alex@toasty.app</div>
            </div>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 28px',
            borderBottom: `1px solid ${theme.border}`,
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMute, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Wednesday, April 23</div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 3 }}>Good morning, Alex</div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 12px', border: `1px solid ${theme.border}`,
                borderRadius: 8, background: theme.surface,
              }}>
                <Icon name="search" size={13} style={{ color: theme.textMute }}/>
                <span style={{ fontSize: 11.5, color: theme.textMute }}>Search ⌘K</span>
              </div>
              <MonthSwitcher theme={theme}/>
              <Btn theme={theme} primary icon="plus">Add transaction</Btn>
            </div>
          </div>

          {/* Body */}
          <div style={{ flex: 1, padding: 22, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Hero remaining card — the centerpiece */}
            <div style={{
              padding: '20px 24px',
              borderRadius: 14,
              background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accent2} 100%)`,
              color: '#FFFCF5',
              display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 24,
              alignItems: 'center',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* subtle grain */}
              <div style={{ position: 'absolute', inset: 0, opacity: 0.08, background: 'radial-gradient(circle at 90% 20%, white 0%, transparent 40%)' }}/>
              <div style={{ position: 'relative' }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.85 }}>Left to spend in April</div>
                <div style={{ fontSize: 44, fontWeight: 700, ...NUM_STYLE, lineHeight: 1.05, marginTop: 6 }}>$1,132<span style={{ fontSize: 22, opacity: 0.7 }}>.40</span></div>
                <div style={{ fontSize: 12, marginTop: 6, opacity: 0.9 }}>20 days left · ~$56/day</div>
              </div>
              <div style={{ position: 'relative', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: 24 }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.75 }}>Spent</div>
                <div style={{ fontSize: 22, fontWeight: 700, ...NUM_STYLE, marginTop: 4 }}>$2,318</div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.2)', borderRadius: 99, marginTop: 8 }}>
                  <div style={{ width: '67%', height: '100%', background: '#FFFCF5', borderRadius: 99 }}/>
                </div>
                <div style={{ fontSize: 10.5, marginTop: 4, opacity: 0.85 }}>67% of $3,450 budget</div>
              </div>
              <div style={{ position: 'relative', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: 24 }}>
                <div style={{ fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.75 }}>Net worth</div>
                <div style={{ fontSize: 22, fontWeight: 700, ...NUM_STYLE, marginTop: 4 }}>$24,891</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: 11 }}>
                  <Icon name="trend-up" size={12}/> +$412 this week
                </div>
              </div>
            </div>

            {/* Two-column: budget left + activity right */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14, flex: 1, minHeight: 0 }}>
              <Card theme={theme} pad={18} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>Budget by category</div>
                    <div style={{ fontSize: 11, color: theme.textMute, marginTop: 2 }}>1 over · 5 on track</div>
                  </div>
                  <Btn theme={theme} small>Manage</Btn>
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  {CATS.map(c => <CatRow key={c.name} theme={theme} {...c}/>)}
                </div>
              </Card>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
                <Card theme={theme} pad={16}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>This week</div>
                    <span style={{ fontSize: 11, color: theme.textDim, ...NUM_STYLE }}>$495.40</span>
                  </div>
                  <Bars theme={theme} data={SPEND_BARS} height={68}/>
                </Card>
                <Card theme={theme} pad={16} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Recent activity</div>
                    <span style={{ fontSize: 10.5, color: theme.accent, fontWeight: 600, cursor: 'pointer' }}>See all →</span>
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    {TXNS.slice(0, 4).map(t => <TxRow key={t.name} theme={theme} {...t}/>)}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

// ─── PALETTE CARD ────────────────────────────────────────────────────
// Shows colors + type + components for a direction
function PaletteCard({ dirKey }) {
  const dir = PALETTES[dirKey];
  const t = dir.light;
  return (
    <Frame theme={t} style={{ padding: 24, gap: 20 }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: t.textMute, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Direction</div>
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 4 }}>{dir.name}</div>
        <div style={{ fontSize: 13, color: t.textDim, marginTop: 2, ...NUM_STYLE, letterSpacing: 0 }}>{dir.tag}</div>
      </div>

      {/* Light row */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: t.textMute, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Light mode</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
          <Swatch color={t.bg} label="bg" textColor={t.textDim}/>
          <Swatch color={t.surface} label="surface" textColor={t.textDim}/>
          <Swatch color={t.surface2} label="sunken" textColor={t.textDim}/>
          <Swatch color={t.accent} label="accent" textColor={t.textDim}/>
          <Swatch color={t.accent2} label="accent2" textColor={t.textDim}/>
          <Swatch color={t.text} label="text" textColor={t.textDim}/>
          <Swatch color={t.good} label="good" textColor={t.textDim}/>
        </div>
      </div>

      {/* Dark row */}
      <div style={{ background: dir.dark.bg, color: dir.dark.text, padding: 16, borderRadius: 10, border: `1px solid ${dir.dark.border}` }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: dir.dark.textMute, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Dark mode</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
          {['bg','surface','surface2','accent','accent2','text','good'].map(k => (
            <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ height: 44, background: dir.dark[k], borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: dir.dark.textMute, ...NUM_STYLE, letterSpacing: 0 }}>
                <span>{k}</span><span>{dir.dark[k]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Type sample */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: t.textMute, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Type</div>
          <div style={{ fontFamily: dirKey === 'hearth' ? FONTS.serif : FONTS.sans, fontSize: 28, fontWeight: dirKey === 'hearth' ? 400 : 700, lineHeight: 1.05 }}>
            Toasty mornings, calm money.
          </div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 12, color: t.textDim, marginTop: 6 }}>
            Body — Inter 400. Used for everything that isn't a number.
          </div>
          <div style={{ ...NUM_STYLE, fontSize: 22, fontWeight: 700, marginTop: 10, color: t.accent }}>
            $1,132.40 / $3,450.00
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: t.textMute, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Components</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <Btn theme={t} primary icon="plus">Primary</Btn>
            <Btn theme={t} icon="filter">Secondary</Btn>
            <Pill theme={t} tone="good">on track</Pill>
            <Pill theme={t} tone="warn">over</Pill>
            <Pill theme={t}>tag</Pill>
          </div>
          <div style={{ marginTop: 10 }}>
            <CatRow theme={t} icon="bread" name="Groceries" spent={412} budget={600}/>
          </div>
        </div>
      </div>
    </Frame>
  );
}

Object.assign(window, { HeroDashboard, PaletteCard });
