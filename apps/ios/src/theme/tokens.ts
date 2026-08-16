export const colors = {
  cream: "#F7F1E8",
  creamDeep: "#F0E4D4",
  sand: "#F6E8D8",
  clay: "#D2693A",
  clayDark: "#B45328",
  coral: "#E36A4A",
  coralDark: "#C45336",
  peach: "#F3C4A8",
  sage: "#5C8A68",
  sageLight: "#E3F2E7",
  ink: "#241F1C",
  muted: "#6E6761",
  border: "rgba(255,255,255,0.58)",
  glass: "rgba(255,251,246,0.55)",
  glassStrong: "rgba(255,251,246,0.8)",
  hairline: "rgba(36,31,28,0.08)",
  white: "#FFFFFF",
  danger: "#B42318",
  dangerSoft: "rgba(180,35,24,0.1)",
} as const;

export const space = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 44,
} as const;

export const radius = {
  sm: 14,
  md: 20,
  lg: 26,
  xl: 32,
  pill: 999,
} as const;

export const type = {
  display: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "600" as const,
    letterSpacing: -0.8,
  },
  hero: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "600" as const,
    letterSpacing: -0.45,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "600" as const,
    letterSpacing: -0.35,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "500" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "400" as const,
  },
  callout: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600" as const,
  },
  caption: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "500" as const,
  },
  kicker: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "700" as const,
    letterSpacing: 0.4,
  },
};

export const motion = {
  snappy: { damping: 16, stiffness: 380, mass: 0.65 },
  fluid: { damping: 22, stiffness: 200, mass: 0.9 },
  pressIn: { damping: 16, stiffness: 420 },
  pressOut: { damping: 11, stiffness: 240 },
  driftMs: { clay: 9000, sage: 12000 },
} as const;

export const typeScale = {
  body: 1.5,
  ui: 1.25,
} as const;
