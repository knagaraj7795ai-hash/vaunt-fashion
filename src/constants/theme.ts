export const COLORS = {
  // Brand Primary & Accents (Distinct from Myntra's pink/red)
  primary: '#0F172A',         // Obsidian Slate
  primaryDark: '#020617',
  primaryLight: '#1E293B',
  accent: '#3B82F6',          // Electric Cobalt
  accentIndigo: '#4F46E5',    // Royal Indigo
  accentHover: '#2563EB',
  
  // Secondary & Highlights
  amber: '#D97706',           // Warm Amber for ratings & luxe club
  amberLight: '#FEF3C7',
  emerald: '#059669',         // Emerald Green for deals, discounts & success
  emeraldLight: '#D1FAE5',
  rose: '#E11D48',            // Soft Rose for heart/wishlist
  roseLight: '#FFE4E6',
  
  // Functional
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#0EA5E9',

  // Neutrals & Surfaces
  canvas: '#F8FAFC',          // Crisp light grey background
  card: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceSubtle: '#F1F5F9',
  surfaceMuted: '#E2E8F0',

  // Text
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textSubtle: '#94A3B8',
  textInverse: '#FFFFFF',
  textSuccess: '#059669',
  textWarning: '#D97706',

  // Borders & Dividers
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderDark: '#CBD5E1',

  // Overlay
  overlay: 'rgba(15, 23, 42, 0.65)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const RADIUS = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
};

export const TYPOGRAPHY = {
  display: {
    fontSize: 28,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
  },
  title1: {
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  title2: {
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
  },
  headline: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  bodyBold: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  subhead: {
    fontSize: 13,
    fontWeight: '500' as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
  },
  captionBold: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  micro: {
    fontSize: 10,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },
};

export const SHADOWS = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
};
