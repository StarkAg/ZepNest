// Source of truth — mirrors zepnest-partner-design-system tokens exactly.
// All components consume these values; never hardcode hex anywhere else.

export const colors = {
  // ── Brand: Zepnest Blue ───────────────────────────────────────────
  brand: {
    header:          '#0159B1',   // blue-700 — app chrome, primary actions
    headerDark:      '#011C37',   // navy — gradient end stop (welcome screen)
    headerForeground:'#FFFFFF',
    accent:          '#0264D4',   // blue-600
    soft:            '#EBF4FF',   // blue-50
    partnerLabel:    '#71AEF5',   // blue-300 — subtext on blue header
  },

  // ── Ink / neutral scale ───────────────────────────────────────────
  ink: {
    900: '#0E1A1F',   // primary text
    800: '#1B2A30',
    700: '#33444B',   // secondary text
    600: '#4C5C63',
    500: '#687A81',   // muted / tertiary
    400: '#8C9AA0',   // placeholder
    300: '#B5C0C5',   // disabled
    200: '#D8DEE1',   // borders
    150: '#E4E9EB',   // subtle border / divider
    100: '#EEF1F3',   // hairline / track
    50:  '#F5F7F8',   // app background
  },

  // ── Status (reserved — never reuse status hues for decoration) ────
  status: {
    available: { bg: '#E6F6EC', text: '#11713C', dot: '#1A9E55' },
    enRoute:   { bg: '#FDF1DD', text: '#9A5C03', dot: '#E8920C' },
    onJob:     { bg: '#E5EDFD', text: '#1A48B0', dot: '#2563EB' },
    offDuty:   { bg: '#EEF0F2', text: '#4B535B', dot: '#6B7280' },
    offline:   { bg: '#FCE9E9', text: '#A21A1A', dot: '#DC2626' },
  },

  // ── Job type accents ──────────────────────────────────────────────
  jobType: {
    rateCard:   { bg: '#ECECFB', text: '#3F3FA8', dot: '#5B5BD6' },
    service:    { bg: '#E1F4F7', text: '#0A6675', dot: '#0E8C9E' },
    highTicket: { bg: '#F8EEDD', text: '#8A5111', dot: '#B26B1A' },
  },

  // ── Money emphasis ────────────────────────────────────────────────
  money: {
    positive: '#11713C',   // earnings, payout, paid
    pending:  '#9A5C03',   // COD pending, awaiting
    neutral:  '#0E1A1F',   // ink-900
  },

  // ── Stat tile icon tones ──────────────────────────────────────────
  stat: {
    online: '#1A9E55',   // mirrors status-available dot
    onJob:  '#2563EB',   // mirrors status-onJob dot
    done:   '#33444B',   // ink-700 / text-secondary
  },

  // ── Avatar palette (fixed set for initials circles) ───────────────
  avatar: {
    teal:   '#0B6E6A',
    purple: '#7C3AED',
    green:  '#15803D',
    blue:   '#1D4ED8',
    amber:  '#B45309',
    red:    '#DC2626',
    gray:   '#687A81',
  },

  // ── Surfaces ─────────────────────────────────────────────────────
  surface: {
    app:    '#F5F7F8',   // ink-50 — screen background
    card:   '#FFFFFF',
    sunken: '#EEF1F3',   // ink-100
  },

  // ── Borders ──────────────────────────────────────────────────────
  border: {
    subtle:  '#E4E9EB',  // ink-150
    default: '#D8DEE1',  // ink-200
  },

  // ── Filter pills ─────────────────────────────────────────────────
  pill: {
    selectedBg:    '#0E1A1F',   // ink-900
    selectedText:  '#FFFFFF',
    defaultBg:     '#FFFFFF',
    defaultText:   '#33444B',   // ink-700
    defaultBorder: '#D8DEE1',   // ink-200
  },

  // ── Tab bar ──────────────────────────────────────────────────────
  tab: {
    active:   '#0159B1',   // blue-700
    inactive: '#687A81',   // ink-500
  },

  white: '#FFFFFF',
} as const;

export type AvatarColor = keyof typeof colors.avatar;
export type StatusKey = 'available' | 'enRoute' | 'onJob' | 'offDuty' | 'offline';
