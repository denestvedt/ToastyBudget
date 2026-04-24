// Other screens — Budget, Transactions, Add Transaction, Goals, Reports, Settings
// Each has 3 variations matching directions 1/2/3.

// ─── BUDGET / ENVELOPES ─────────────────────────────────────────────────
function BudgetView({ theme, variant }) {
  const groups = [
    { name: 'Essentials', cats: CATS.slice(0, 3), total: 2549, budget: 2700 },
    { name: 'Lifestyle', cats: CATS.slice(3), total: 551, budget: 650 },
  ];
  if (variant === 'envelope') {
    // V3 — actual envelope metaphor cards
    const hard = `2px solid ${theme.text}`;
    return (
      <Frame theme={theme}>
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <Sidebar theme={theme} active="Budget" items={NAV}/>
          <div style={{ flex: 1, padding: 22, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>Envelopes</div>
                <div style={{ fontSize: 12, color: theme.textDim }}>Drag to rebalance · April</div>
              </div>
              <Btn theme={theme} primary icon="plus">New envelope</Btn>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {CATS.map((c, i) => {
                const pct = Math.min(100, (c.spent / c.budget) * 100);
                const over = c.spent > c.budget;
                return (
                  <div key={c.name} style={{
                    border: hard, borderRadius: 10, padding: 14,
                    background: theme.surface,
                    boxShadow: `3px 3px 0 ${theme.text}`,
                    position: 'relative',
                  }}>
                    {/* envelope flap */}
                    <div style={{
                      position: 'absolute', top: -2, left: -2, right: -2, height: 14,
                      background: theme.accent2, borderBottom: hard,
                      borderRadius: '8px 8px 0 0',
                      clipPath: 'polygon(0 0, 50% 80%, 100% 0, 100% 100%, 0 100%)',
                    }}/>
                    <div style={{ paddingTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon name={c.icon} size={16}/>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{c.name}</div>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, marginTop: 8, ...NUM_STYLE, color: over ? theme.bad : theme.text }}>
                      ${(c.budget - c.spent).toFixed(0)}
                    </div>
                    <div style={{ fontSize: 10.5, color: theme.textMute }}>left of ${c.budget}</div>
                    <div style={{ height: 6, background: theme.surface2, borderRadius: 99, marginTop: 8, border: `1px solid ${theme.border}` }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: over ? theme.bad : theme.accent, borderRadius: 99 }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Frame>
    );
  }
  // V1 / V2 — grouped list
  return (
    <Frame theme={theme}>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar theme={theme} active="Budget" items={NAV} variant={variant === 'editorial' ? 'hard' : 'soft'}/>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <TopBar theme={theme}
            title={variant === 'editorial' ? 'Your April plan' : 'Budget'}
            subtitle={variant === 'editorial' ? 'Edit envelopes, watch the totals re-balance.' : '6 categories · April 2026'}
            right={<Btn theme={theme} primary icon="plus">Category</Btn>}/>
          <div style={{ flex: 1, padding: 20, overflow: 'auto' }}>
            {groups.map(g => (
              <div key={g.name} style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                  <div style={{
                    fontSize: variant === 'editorial' ? 18 : 12,
                    fontWeight: variant === 'editorial' ? 400 : 700,
                    fontFamily: variant === 'editorial' ? FONTS.serif : FONTS.sans,
                    fontStyle: variant === 'editorial' ? 'italic' : 'normal',
                    textTransform: variant === 'editorial' ? 'none' : 'uppercase',
                    letterSpacing: variant === 'editorial' ? '-0.01em' : '0.1em',
                    color: variant === 'editorial' ? theme.text : theme.textMute,
                  }}>{g.name}</div>
                  <div style={{ fontSize: 11.5, color: theme.textDim, ...NUM_STYLE }}>${g.total} / ${g.budget}</div>
                </div>
                <Card theme={theme} pad={14}>
                  {g.cats.map(c => <CatRow key={c.name} theme={theme} {...c}/>)}
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

// ─── TRANSACTIONS ──────────────────────────────────────────────────────
function TransactionsView({ theme, variant }) {
  const allTx = [...TXNS, { name: 'Spotify', cat: 'Entertainment', date: 'Apr 17', amount: '11.99', icon: 'film' },
                       { name: 'Uber', cat: 'Transport', date: 'Apr 17', amount: '18.40', icon: 'car' },
                       { name: 'Target', cat: 'Shopping', date: 'Apr 16', amount: '54.20', icon: 'bag' }];
  return (
    <Frame theme={theme}>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar theme={theme} active="Transactions" items={NAV} variant={variant === 'editorial' ? 'hard' : 'soft'}/>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <TopBar theme={theme}
            title="Transactions"
            subtitle={`${allTx.length} this month · $2,640.41 total`}
            right={<div style={{ display: 'flex', gap: 8 }}>
              <Btn theme={theme} icon="filter" small>Filter</Btn>
              <Btn theme={theme} primary icon="plus">Add</Btn>
            </div>}/>
          <div style={{ flex: 1, padding: '14px 20px', overflow: 'auto' }}>
            {/* search bar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 12px', border: `1px solid ${theme.border}`,
              borderRadius: 8, marginBottom: 12, background: theme.surface,
            }}>
              <Icon name="search" size={14} style={{ color: theme.textMute }}/>
              <input placeholder="Search transactions…" style={{
                flex: 1, border: 'none', background: 'transparent', outline: 'none',
                color: theme.text, fontSize: 12, fontFamily: 'inherit',
              }}/>
              <Pill theme={theme}>last 30d</Pill>
            </div>

            {variant === 'envelope' ? (
              // chunky cards
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {allTx.map(t => (
                  <div key={t.name} style={{
                    border: `2px solid ${theme.text}`, borderRadius: 8,
                    background: theme.surface, padding: '10px 14px',
                    display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 12,
                    boxShadow: `2px 2px 0 ${theme.text}`,
                  }}>
                    <div style={{ width: 32, height: 32, borderRadius: 7, background: theme.accent + '33', color: theme.accent, display: 'grid', placeItems: 'center' }}>
                      <Icon name={t.icon} size={16}/>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{t.name}</div>
                      <div style={{ fontSize: 10.5, color: theme.textMute }}>{t.cat} · {t.date}</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, ...NUM_STYLE, color: t.incoming ? theme.good : theme.text }}>
                      {t.incoming ? '+' : '−'}${t.amount}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card theme={theme} pad={16}>
                {/* header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 12,
                  paddingBottom: 8, borderBottom: `1px solid ${theme.border}`,
                  fontSize: 10, fontWeight: 600, color: theme.textMute, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <span style={{ width: 28 }}/>
                  <span>Merchant</span>
                  <span>Date</span>
                  <span>Amount</span>
                </div>
                {allTx.map(t => <TxRow key={t.name} theme={theme} {...t}/>)}
              </Card>
            )}
          </div>
        </div>
      </div>
    </Frame>
  );
}

// ─── ADD TRANSACTION (modal) ───────────────────────────────────────────
function AddTxView({ theme, variant }) {
  // Show as a modal over a faded background
  const fieldStyle = {
    width: '100%', padding: '10px 12px',
    border: `1px solid ${theme.border}`,
    borderRadius: 7, background: theme.bg,
    color: theme.text, fontSize: 13,
    fontFamily: 'inherit', outline: 'none',
  };
  return (
    <Frame theme={theme}>
      <div style={{ display: 'flex', flex: 1, minHeight: 0, position: 'relative' }}>
        <Sidebar theme={theme} active="Transactions" items={NAV} variant={variant === 'editorial' ? 'hard' : 'soft'}/>
        <div style={{ flex: 1, padding: 20, opacity: 0.4 }}>
          <div style={{ height: 24, background: theme.surface2, borderRadius: 6, width: 200, marginBottom: 16 }}/>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[1,2,3].map(i => <div key={i} style={{ height: 80, background: theme.surface, borderRadius: 8, border: `1px solid ${theme.border}` }}/>)}
          </div>
        </div>
        {/* overlay */}
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)',
          display: 'grid', placeItems: 'center',
        }}>
          <div style={{
            width: 380, background: theme.surface,
            border: variant === 'envelope' ? `2px solid ${theme.text}` : `1px solid ${theme.border}`,
            borderRadius: 12, padding: 22,
            boxShadow: variant === 'envelope' ? `5px 5px 0 ${theme.text}` : '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{
                fontSize: 17, fontWeight: 700,
                fontFamily: variant === 'editorial' ? FONTS.serif : FONTS.sans,
              }}>{variant === 'editorial' ? 'New entry' : 'Add transaction'}</div>
              <button style={btnIcon(theme)}><Icon name="x" size={16}/></button>
            </div>

            {/* Big amount */}
            <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
              <div style={{ fontSize: 34, fontWeight: 700, ...NUM_STYLE, color: theme.accent }}>−$64.21</div>
              <div style={{ fontSize: 10.5, color: theme.textMute, marginTop: 2 }}>tap to edit</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: theme.textMute, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Merchant</div>
                <input value="Trader Joe's" readOnly style={fieldStyle}/>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: theme.textMute, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Category</div>
                  <div style={{ ...fieldStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon name="bread" size={13} style={{ color: theme.accent }}/> Groceries
                    </span>
                    <Icon name="chevD" size={12}/>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: theme.textMute, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Date</div>
                  <input value="Apr 22, 2026" readOnly style={fieldStyle}/>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: theme.textMute, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Account</div>
                <input value="Chase Checking" readOnly style={fieldStyle}/>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: theme.textMute, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Note</div>
                <textarea placeholder="Optional" style={{ ...fieldStyle, minHeight: 50, resize: 'none' }}/>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <Btn theme={theme} style={{ flex: 1, justifyContent: 'center' }}>Cancel</Btn>
              <Btn theme={theme} primary style={{ flex: 2, justifyContent: 'center' }}>Save transaction</Btn>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

// ─── GOALS ──────────────────────────────────────────────────────────────
function GoalsView({ theme, variant }) {
  const goals = [
    { name: 'Emergency fund', icon: 'flame', cur: 4200, tgt: 10000, due: 'Dec 2026' },
    { name: 'Japan trip', icon: 'target', cur: 1850, tgt: 5000, due: 'Oct 2026' },
    { name: 'New laptop', icon: 'bag', cur: 920, tgt: 2400, due: 'Aug 2026' },
    { name: 'House down payment', icon: 'home', cur: 12400, tgt: 60000, due: 'Q4 2028' },
  ];
  return (
    <Frame theme={theme}>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar theme={theme} active="Goals" items={NAV} variant={variant === 'editorial' ? 'hard' : 'soft'}/>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <TopBar theme={theme}
            title={variant === 'editorial' ? 'What you\'re working toward' : 'Goals'}
            subtitle="4 active · $19,370 saved across all"
            right={<Btn theme={theme} primary icon="plus">New goal</Btn>}/>
          <div style={{ flex: 1, padding: 20, overflow: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {goals.map(g => {
              const pct = Math.round((g.cur / g.tgt) * 100);
              return (
                <div key={g.name} style={{
                  background: theme.surface,
                  border: variant === 'envelope' ? `2px solid ${theme.text}` : `1px solid ${theme.border}`,
                  borderRadius: 10, padding: 16,
                  boxShadow: variant === 'envelope' ? `3px 3px 0 ${theme.text}` : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: theme.accent + '22', color: theme.accent, display: 'grid', placeItems: 'center' }}>
                      <Icon name={g.icon} size={18}/>
                    </div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700 }}>{g.name}</div>
                      <div style={{ fontSize: 10.5, color: theme.textMute }}>by {g.due}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: 18, fontWeight: 800, ...NUM_STYLE, color: theme.accent }}>{pct}%</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: theme.textDim, marginBottom: 4, ...NUM_STYLE }}>
                    <span style={{ color: theme.text, fontWeight: 600 }}>${g.cur.toLocaleString()}</span>
                    <span>of ${g.tgt.toLocaleString()}</span>
                  </div>
                  <div style={{ height: 8, background: theme.surface2, borderRadius: 99, overflow: 'hidden', border: variant === 'envelope' ? `1px solid ${theme.text}` : 'none' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: theme.accent, borderRadius: 99 }}/>
                  </div>
                  <div style={{ marginTop: 10, fontSize: 11, color: theme.textDim }}>
                    Save <span style={{ ...NUM_STYLE, color: theme.text, fontWeight: 600 }}>${Math.round((g.tgt - g.cur) / 8)}/mo</span> to hit it on time
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Frame>
  );
}

// ─── REPORTS ────────────────────────────────────────────────────────────
function ReportsView({ theme, variant }) {
  const monthly = ['Nov','Dec','Jan','Feb','Mar','Apr'].map((m, i) => ({ label: m, value: [2100, 2890, 2400, 2150, 2700, 2318][i], highlight: i === 5 }));
  return (
    <Frame theme={theme}>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar theme={theme} active="Reports" items={NAV} variant={variant === 'editorial' ? 'hard' : 'soft'}/>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <TopBar theme={theme}
            title={variant === 'editorial' ? 'A look back' : 'Reports'}
            subtitle="6-month spending trends"
            right={<div style={{ display: 'flex', gap: 6 }}>
              {['Month','Quarter','Year'].map((p, i) => (
                <button key={p} style={{
                  padding: '5px 12px', fontSize: 11.5, fontWeight: 600,
                  border: `1px solid ${theme.border}`, borderRadius: 6,
                  background: i === 0 ? theme.accent : 'transparent',
                  color: i === 0 ? theme.bg : theme.textDim,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>{p}</button>
              ))}
            </div>}/>
          <div style={{ flex: 1, padding: 20, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Card theme={theme} pad={18}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMute, textTransform: 'uppercase', letterSpacing: '0.08em' }}>6-month average</div>
                  <div style={{ fontSize: 28, fontWeight: 700, ...NUM_STYLE, marginTop: 4 }}>$2,426</div>
                </div>
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: 10, color: theme.textMute }}>vs prior 6mo</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: theme.good, ...NUM_STYLE }}>↓ 8.2%</div>
                  </div>
                </div>
              </div>
              <Bars theme={theme} data={monthly} height={140}/>
            </Card>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14 }}>
              <Card theme={theme} pad={16}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Where it went · April</div>
                {CATS.map((c, i) => {
                  const w = (c.spent / 2318) * 100;
                  return (
                    <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                      <div style={{ width: 80, fontSize: 11.5, color: theme.textDim }}>{c.name}</div>
                      <div style={{ flex: 1, height: 16, background: theme.surface2, borderRadius: 4, position: 'relative' }}>
                        <div style={{ width: `${w}%`, height: '100%', background: [theme.accent, theme.accent2, theme.good, theme.warn, theme.bad, theme.accent][i % 6], borderRadius: 4 }}/>
                      </div>
                      <div style={{ width: 50, fontSize: 11, ...NUM_STYLE, textAlign: 'right' }}>${c.spent}</div>
                    </div>
                  );
                })}
              </Card>
              <Card theme={theme} pad={16}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Insights</div>
                {[
                  { tag: 'Saving', text: 'You spent 8% less than your 6mo avg.', tone: 'good' },
                  { tag: 'Watch', text: 'Dining is 15% over budget for the 2nd month.', tone: 'warn' },
                  { tag: 'Goal', text: 'On track for Japan trip if you save $390/mo.', tone: 'good' },
                ].map((x, i) => (
                  <div key={i} style={{ padding: '8px 0', borderBottom: i < 2 ? `1px solid ${theme.border}` : 'none' }}>
                    <Pill theme={theme} tone={x.tone}>{x.tag}</Pill>
                    <div style={{ fontSize: 12, marginTop: 5, color: theme.textDim }}>{x.text}</div>
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

// ─── SETTINGS ───────────────────────────────────────────────────────────
function SettingsView({ theme, variant }) {
  const sections = [
    { name: 'Profile', items: [['Display name', 'Alex Chen'], ['Email', 'alex@toasty.app'], ['Currency', 'USD ($)']] },
    { name: 'Budgeting', items: [['Budget cycle', 'Monthly'], ['Start of month', '1st'], ['Rollover unused', 'On']] },
    { name: 'Notifications', items: [['Daily summary', 'Off'], ['Over-budget alerts', 'On'], ['Weekly digest', 'On']] },
  ];
  return (
    <Frame theme={theme}>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar theme={theme} active="Settings" items={NAV} variant={variant === 'editorial' ? 'hard' : 'soft'}/>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <TopBar theme={theme} title="Settings" subtitle="Account, budgeting, notifications"/>
          <div style={{ flex: 1, padding: 20, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {sections.map(s => (
              <div key={s.name}>
                <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMute, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{s.name}</div>
                <Card theme={theme} pad={0}>
                  {s.items.map(([k, v], i) => (
                    <div key={k} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '12px 16px',
                      borderBottom: i < s.items.length - 1 ? `1px solid ${theme.border}` : 'none',
                    }}>
                      <div style={{ fontSize: 12.5 }}>{k}</div>
                      <div style={{ fontSize: 12, color: theme.textDim, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {v}
                        <Icon name="chevR" size={12} style={{ color: theme.textMute }}/>
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
            ))}
            {/* Theme picker preview */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: theme.textMute, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Appearance</div>
              <Card theme={theme}>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[['Light', false], ['Dark', true], ['System', false]].map(([n, sel]) => (
                    <div key={n} style={{
                      flex: 1, padding: 12, borderRadius: 8,
                      border: `2px solid ${sel ? theme.accent : theme.border}`,
                      textAlign: 'center', fontSize: 12, fontWeight: 600,
                    }}>{n}</div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

Object.assign(window, { BudgetView, TransactionsView, AddTxView, GoalsView, ReportsView, SettingsView });
