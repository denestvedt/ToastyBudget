// Shared UI primitives — work across all 3 palettes.
// Components read a `theme` object (from PALETTES[dir][mode]) so
// one implementation renders in any direction.

function Frame({ theme, children, style, fontFamily, pad = 0 }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: theme.bg,
      color: theme.text,
      fontFamily: fontFamily || FONTS.sans,
      fontSize: 13,
      lineHeight: 1.45,
      padding: pad,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      ...style,
    }}>{children}</div>
  );
}

function Sidebar({ theme, active, items, variant = 'soft', fontFamily }) {
  const isHard = variant === 'hard';
  return (
    <div style={{
      width: 176, flexShrink: 0,
      borderRight: `1px solid ${theme.border}`,
      background: isHard ? theme.surface : 'transparent',
      padding: '18px 12px',
      display: 'flex', flexDirection: 'column', gap: 2,
      fontFamily: fontFamily || FONTS.sans,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px 16px' }}>
        <ToastMark size={20} color={theme.accent} glow={theme.bg}/>
        <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '-0.02em' }}>ToastyBudget</span>
      </div>
      {items.map(it => (
        <div key={it.label} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '7px 10px',
          borderRadius: 6,
          fontSize: 12.5,
          fontWeight: active === it.label ? 600 : 500,
          background: active === it.label ? theme.accent + '22' : 'transparent',
          color: active === it.label ? theme.accent : theme.textDim,
          border: active === it.label && isHard ? `1px solid ${theme.accent}44` : '1px solid transparent',
        }}>
          <Icon name={it.icon} size={14}/>
          <span>{it.label}</span>
          {it.badge && <span style={{
            marginLeft: 'auto', fontSize: 10, fontWeight: 600,
            background: theme.accent, color: theme.bg,
            padding: '1px 6px', borderRadius: 8,
          }}>{it.badge}</span>}
        </div>
      ))}
      <div style={{ marginTop: 'auto', borderTop: `1px solid ${theme.border}`, paddingTop: 10, color: theme.textMute, fontSize: 11 }}>
        <div style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: theme.accent2, color: theme.bg, display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 700 }}>A</div>
          <div>
            <div style={{ color: theme.text, fontSize: 11.5, fontWeight: 600 }}>Alex Chen</div>
            <div style={{ fontSize: 10 }}>Pro plan</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopBar({ theme, title, subtitle, right, fontFamily }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      padding: '18px 24px 16px',
      borderBottom: `1px solid ${theme.border}`,
      fontFamily: fontFamily || FONTS.sans,
    }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{title}</div>
        {subtitle && <div style={{ color: theme.textDim, fontSize: 12, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}

function MonthSwitcher({ theme, month = 'April 2026' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, border: `1px solid ${theme.border}`, borderRadius: 8, padding: '4px 6px' }}>
      <button style={btnIcon(theme)}><Icon name="chevL" size={14}/></button>
      <div style={{ fontSize: 12, fontWeight: 600, padding: '0 8px', ...NUM_STYLE, letterSpacing: 0 }}>{month}</div>
      <button style={btnIcon(theme)}><Icon name="chevR" size={14}/></button>
    </div>
  );
}

function btnIcon(theme) {
  return {
    background: 'transparent', border: 'none', color: theme.textDim,
    width: 22, height: 22, borderRadius: 4,
    display: 'grid', placeItems: 'center', cursor: 'pointer', padding: 0,
  };
}

function Btn({ theme, children, primary, small, icon, style }) {
  return (
    <button style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: small ? '5px 10px' : '7px 14px',
      fontSize: small ? 11.5 : 12.5,
      fontWeight: 600,
      fontFamily: 'inherit',
      border: primary ? 'none' : `1px solid ${theme.border}`,
      background: primary ? theme.accent : 'transparent',
      color: primary ? theme.bg : theme.text,
      borderRadius: 7,
      cursor: 'pointer',
      ...style,
    }}>
      {icon && <Icon name={icon} size={small ? 12 : 13}/>}
      {children}
    </button>
  );
}

function Card({ theme, children, style, pad = 16, accent }) {
  return (
    <div style={{
      background: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: 10,
      padding: pad,
      position: 'relative',
      ...(accent ? { boxShadow: `inset 3px 0 0 ${theme.accent}` } : {}),
      ...style,
    }}>{children}</div>
  );
}

function Stat({ theme, label, value, sub, tone, big }) {
  const color = tone === 'good' ? theme.good : tone === 'bad' ? theme.bad : theme.text;
  return (
    <Card theme={theme} pad={14}>
      <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: theme.textMute }}>{label}</div>
      <div style={{ fontSize: big ? 28 : 22, fontWeight: 700, marginTop: 6, color, ...NUM_STYLE }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: theme.textDim, marginTop: 3, ...NUM_STYLE, letterSpacing: 0 }}>{sub}</div>}
    </Card>
  );
}

// Category row with progress bar
function CatRow({ theme, icon, name, spent, budget, tone }) {
  const pct = Math.min(100, (spent / budget) * 100);
  const over = spent > budget;
  const barColor = over ? theme.bad : tone === 'warn' ? theme.warn : theme.accent;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${theme.border}` }}>
      <div style={{
        width: 28, height: 28, borderRadius: 7,
        background: theme.accent + '22', color: theme.accent,
        display: 'grid', placeItems: 'center', flexShrink: 0,
      }}><Icon name={icon} size={14}/></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: 11.5, color: theme.textDim, ...NUM_STYLE, whiteSpace: 'nowrap' }}>
            <span style={{ color: over ? theme.bad : theme.text, fontWeight: 600 }}>${spent}</span>
            <span style={{ color: theme.textMute }}> / ${budget}</span>
          </div>
        </div>
        <div style={{ height: 5, background: theme.surface2, borderRadius: 99, marginTop: 5, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: 99 }}/>
        </div>
      </div>
    </div>
  );
}

// Transaction row
function TxRow({ theme, icon, name, cat, date, amount, incoming }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${theme.border}` }}>
      <div style={{ width: 28, height: 28, borderRadius: 7, background: theme.surface2, color: theme.textDim, display: 'grid', placeItems: 'center' }}>
        <Icon name={icon} size={14}/>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
        <div style={{ fontSize: 10.5, color: theme.textMute, marginTop: 1 }}>{cat}</div>
      </div>
      <div style={{ fontSize: 10.5, color: theme.textMute, ...NUM_STYLE }}>{date}</div>
      <div style={{
        fontSize: 12.5, fontWeight: 700,
        color: incoming ? theme.good : theme.text,
        ...NUM_STYLE,
      }}>{incoming ? '+' : '−'}${amount}</div>
    </div>
  );
}

// Donut chart (simple svg)
function Donut({ theme, size = 140, data, center }) {
  const total = data.reduce((a, b) => a + b.value, 0);
  const r = size / 2 - 10;
  const c = size / 2;
  let off = 0;
  const circum = 2 * Math.PI * r;
  return (
    <svg width={size} height={size}>
      <circle cx={c} cy={c} r={r} fill="none" stroke={theme.surface2} strokeWidth="14"/>
      {data.map((d, i) => {
        const len = (d.value / total) * circum;
        const dash = `${len} ${circum - len}`;
        const el = (
          <circle key={i} cx={c} cy={c} r={r} fill="none"
            stroke={d.color} strokeWidth="14"
            strokeDasharray={dash}
            strokeDashoffset={-off}
            transform={`rotate(-90 ${c} ${c})`}/>
        );
        off += len;
        return el;
      })}
      {center && (
        <g>
          <text x={c} y={c - 2} textAnchor="middle" fontSize="10" fill={theme.textMute} fontFamily={FONTS.sans} fontWeight="600" letterSpacing="0.08em">{center.label}</text>
          <text x={c} y={c + 16} textAnchor="middle" fontSize="18" fill={theme.text} fontFamily={FONTS.mono} fontWeight="700">{center.value}</text>
        </g>
      )}
    </svg>
  );
}

// Sparkline
function Spark({ theme, data, width = 80, height = 24, color }) {
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / (max - min || 1)) * height;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={width} height={height}>
      <polyline points={pts} fill="none" stroke={color || theme.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Bar chart
function Bars({ theme, data, height = 120, color }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height, paddingTop: 8 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{
            width: '100%',
            height: `${(d.value / max) * 100}%`,
            background: d.highlight ? (color || theme.accent) : theme.surface2,
            borderRadius: 3,
            minHeight: 2,
          }}/>
          <div style={{ fontSize: 9, color: theme.textMute, ...NUM_STYLE, letterSpacing: 0 }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

// Pill/tag
function Pill({ theme, children, tone, style }) {
  const bg = tone === 'good' ? theme.good + '22' : tone === 'bad' ? theme.bad + '22' : tone === 'warn' ? theme.warn + '22' : theme.surface2;
  const fg = tone === 'good' ? theme.good : tone === 'bad' ? theme.bad : tone === 'warn' ? theme.warn : theme.textDim;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 10.5, fontWeight: 600,
      padding: '2px 8px',
      borderRadius: 99,
      background: bg, color: fg,
      ...style,
    }}>{children}</span>
  );
}

// Swatch for palette cards
function Swatch({ color, label, textColor }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ height: 52, background: color, borderRadius: 6, border: '1px solid rgba(0,0,0,0.08)' }}/>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9.5, color: textColor || '#6b5340', ...NUM_STYLE, letterSpacing: 0 }}>
        <span>{label}</span><span>{color}</span>
      </div>
    </div>
  );
}

Object.assign(window, { Frame, Sidebar, TopBar, MonthSwitcher, Btn, Card, Stat, CatRow, TxRow, Donut, Spark, Bars, Pill, Swatch, btnIcon });
