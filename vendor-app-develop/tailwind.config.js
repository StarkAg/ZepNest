const { hairlineWidth } = require('nativewind/theme');
const { colors } = require('./src/theme/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './src/screens/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Existing semantic tokens (kept for global.css compatibility)
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        // ── Zepnest DS tokens ──────────────────────────────────────
        brand: {
          header:           colors.brand.header,
          headerForeground: colors.brand.headerForeground,
          accent:           colors.brand.accent,
          soft:             colors.brand.soft,
          partnerLabel:     colors.brand.partnerLabel,
        },

        ink: colors.ink,

        status: {
          availableBg:   colors.status.available.bg,
          availableText: colors.status.available.text,
          enRouteBg:     colors.status.enRoute.bg,
          enRouteText:   colors.status.enRoute.text,
          onJobBg:       colors.status.onJob.bg,
          onJobText:     colors.status.onJob.text,
          offDutyBg:     colors.status.offDuty.bg,
          offDutyText:   colors.status.offDuty.text,
          offlineBg:     colors.status.offline.bg,
          offlineText:   colors.status.offline.text,
        },

        stat: colors.stat,
        avatar: colors.avatar,

        surface: colors.surface,
        zn: {
          border:        colors.border.subtle,
          borderDefault: colors.border.default,
        },
        tab:   colors.tab,
        pill:  colors.pill,
        money: colors.money,
      },

      // ── DS type scale ───────────────────────────────────────────
      fontSize: {
        micro:      ['11px', { lineHeight: '16px' }],
        caption:    ['12px', { lineHeight: '16px' }],
        label:      ['13px', { lineHeight: '18px' }],
        'body-sm':  ['14px', { lineHeight: '20px' }],
        body:       ['15px', { lineHeight: '22px' }],
        title:      ['16px', { lineHeight: '22px' }],
        h3:         ['18px', { lineHeight: '24px' }],
        h2:         ['22px', { lineHeight: '28px' }],
        h1:         ['28px', { lineHeight: '34px' }],
        display:    ['40px', { lineHeight: '48px' }],
        'num-md':   ['24px', { lineHeight: '30px' }],
        'num-lg':   ['32px', { lineHeight: '38px' }],
        'num-hero': ['44px', { lineHeight: '52px' }],
      },

      borderWidth: {
        hairline: hairlineWidth(),
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
