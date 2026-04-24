// ToastyBudget design tokens — shared palettes + primitives
// Three directions: Toasty Warm, Hearth (editorial), Kitchen (bold)

const PALETTES = {
  // Direction 1 — Toasty Warm. Cream + amber + deep crust.
  toasty: {
    name: 'Toasty Warm',
    tag: 'Cream · Amber · Crust',
    light: {
      bg:       '#FDF6EC',  // cream
      surface:  '#FFFCF5',  // warmer white card
      surface2: '#F5ECDB',  // sunken
      border:   '#E8DAC0',
      text:     '#2B1810',  // pumpernickel
      textDim:  '#6B5340',
      textMute: '#9A826A',
      accent:   '#C94F1A',  // deep crust
      accent2:  '#E8853A',  // toast
      good:     '#6B8E4E',  // herb
      warn:     '#D97706',
      bad:      '#A63A2A',
    },
    dark: {
      bg:       '#1A1108',  // burnt crust
      surface:  '#241810',
      surface2: '#2E2015',
      border:   '#3D2B1C',
      text:     '#FDF6EC',
      textDim:  '#C4A888',
      textMute: '#8A7258',
      accent:   '#E8853A',  // toast glow
      accent2:  '#F5B871',  // butter
      good:     '#A3C579',
      warn:     '#F5B871',
      bad:      '#E8735C',
    },
  },
  // Direction 2 — Hearth. Editorial, paper, more serif-feel
  hearth: {
    name: 'Hearth',
    tag: 'Paper · Ember · Ink',
    light: {
      bg:       '#F4EDE4',  // paper
      surface:  '#FBF6ED',
      surface2: '#EBE0CC',
      border:   '#DCCDB3',
      text:     '#3D2817',  // ink
      textDim:  '#6F5A44',
      textMute: '#9C8770',
      accent:   '#A63A50',  // ember red
      accent2:  '#E4B363',  // wheat
      good:     '#5C7A4E',
      warn:     '#C97A30',
      bad:      '#A63A50',
    },
    dark: {
      bg:       '#1E1612',
      surface:  '#2A1F18',
      surface2: '#342820',
      border:   '#453426',
      text:     '#F4EDE4',
      textDim:  '#C9B29A',
      textMute: '#8A7258',
      accent:   '#E4B363',
      accent2:  '#D18878',
      good:     '#9CB584',
      warn:     '#E4B363',
      bad:      '#D17866',
    },
  },
  // Direction 3 — Kitchen. Bolder, more playful, chunky
  kitchen: {
    name: 'Kitchen',
    tag: 'Butter · Chili · Charcoal',
    light: {
      bg:       '#FFF6E3',  // butter
      surface:  '#FFFFFF',
      surface2: '#FFE9B8',
      border:   '#2B1810',  // hard black borders!
      text:     '#1A0F08',
      textDim:  '#5C4430',
      textMute: '#8C7358',
      accent:   '#E5421F',  // chili
      accent2:  '#F5A623',  // turmeric
      good:     '#4A8B3A',
      warn:     '#F5A623',
      bad:      '#E5421F',
    },
    dark: {
      bg:       '#14100A',
      surface:  '#1F1810',
      surface2: '#2B2015',
      border:   '#F5A623',  // loud border in dark
      text:     '#FFF6E3',
      textDim:  '#D4B88A',
      textMute: '#8C7358',
      accent:   '#FF6B35',
      accent2:  '#F5A623',
      good:     '#A3D18F',
      warn:     '#F5A623',
      bad:      '#FF6B35',
    },
  },
};

const FONTS = {
  // shared — clean sans + mono numerals
  sans: '"Inter", -apple-system, system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
  serif: '"Instrument Serif", "Cormorant Garamond", Georgia, serif', // hearth only
};

// Inject Google Fonts + base styles once
if (typeof document !== 'undefined' && !document.getElementById('tb-fonts')) {
  const link = document.createElement('link');
  link.id = 'tb-fonts';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap';
  document.head.appendChild(link);
}

// Tabular-number helper
const NUM_STYLE = {
  fontFamily: FONTS.mono,
  fontVariantNumeric: 'tabular-nums',
  letterSpacing: '-0.02em',
};

// Little icon set — keep them simple & consistent. Uses currentColor.
function Icon({ name, size = 16, stroke = 1.75, style }) {
  const s = { width: size, height: size, ...style };
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'grid': return <svg viewBox="0 0 24 24" style={s}><g {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></g></svg>;
    case 'wallet': return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M3 7a2 2 0 0 1 2-2h13v4"/><path d="M3 7v11a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-3"/><path d="M16 13h6v4h-6a2 2 0 0 1 0-4z"/></g></svg>;
    case 'arrows': return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M7 7h13l-3-3"/><path d="M17 17H4l3 3"/></g></svg>;
    case 'bank': return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M3 10h18L12 3 3 10z"/><path d="M5 10v8m4-8v8m6-8v8m4-8v8"/><path d="M3 20h18"/></g></svg>;
    case 'gear': return <svg viewBox="0 0 24 24" style={s}><g {...p}><circle cx="12" cy="12" r="3"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"/></g></svg>;
    case 'plus': return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M12 5v14M5 12h14"/></g></svg>;
    case 'target': return <svg viewBox="0 0 24 24" style={s}><g {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></g></svg>;
    case 'chart': return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M3 20h18"/><rect x="5" y="12" width="3" height="8"/><rect x="11" y="7" width="3" height="13"/><rect x="17" y="14" width="3" height="6"/></g></svg>;
    case 'search': return <svg viewBox="0 0 24 24" style={s}><g {...p}><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></g></svg>;
    case 'chevL': return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M15 6l-6 6 6 6"/></g></svg>;
    case 'chevR': return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M9 6l6 6-6 6"/></g></svg>;
    case 'chevD': return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M6 9l6 6 6-6"/></g></svg>;
    case 'bread': return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M4 11c0-3 2-5 5-5h6c3 0 5 2 5 5 0 1.5-1 2-2 2v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6c-1 0-2-.5-2-2z"/><path d="M9 12v4m3-4v4m3-4v4"/></g></svg>;
    case 'coffee': return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M4 8h14v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8z"/><path d="M18 10h2a2 2 0 0 1 0 4h-2"/><path d="M8 4c0 1 1 1 1 2s-1 1-1 2M12 4c0 1 1 1 1 2s-1 1-1 2"/></g></svg>;
    case 'home': return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/></g></svg>;
    case 'car': return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M4 14l2-6h12l2 6v4H4v-4z"/><circle cx="8" cy="17" r="1.5"/><circle cx="16" cy="17" r="1.5"/></g></svg>;
    case 'film': return <svg viewBox="0 0 24 24" style={s}><g {...p}><rect x="3" y="4" width="18" height="16" rx="1"/><path d="M7 4v16M17 4v16M3 10h4m10 0h4M3 14h4m10 0h4"/></g></svg>;
    case 'bag': return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></g></svg>;
    case 'trend-up': return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></g></svg>;
    case 'trend-dn': return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M3 7l6 6 4-4 8 8"/><path d="M14 17h7v-7"/></g></svg>;
    case 'check': return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M4 12l5 5L20 6"/></g></svg>;
    case 'x': return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M6 6l12 12M18 6L6 18"/></g></svg>;
    case 'dots': return <svg viewBox="0 0 24 24" style={s}><g fill="currentColor"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></g></svg>;
    case 'flame': return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M12 3c1 3 4 4 4 8a4 4 0 1 1-8 0c0-2 1-3 1-5 2 0 3-1 3-3z"/></g></svg>;
    case 'filter': return <svg viewBox="0 0 24 24" style={s}><g {...p}><path d="M4 5h16l-6 8v5l-4 2v-7L4 5z"/></g></svg>;
    default: return null;
  }
}

// Logo mark — a little toast slice
function ToastMark({ size = 24, color = 'currentColor', glow }) {
  return (
    <svg viewBox="0 0 32 32" style={{ width: size, height: size }}>
      <path d="M4 13c0-3 2-5 5-5h14c3 0 5 2 5 5 0 2-1.5 2.5-2.5 2.5V24a3 3 0 0 1-3 3H9.5a3 3 0 0 1-3-3v-8.5C5.5 15.5 4 15 4 13z"
        fill={color} opacity={glow ? 1 : 0.95}/>
      <path d="M11 17v4M16 17v4M21 17v4" stroke={glow || '#1a1108'} strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
    </svg>
  );
}

Object.assign(window, { PALETTES, FONTS, NUM_STYLE, Icon, ToastMark });
