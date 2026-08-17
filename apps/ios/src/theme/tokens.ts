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
  glassSoft: "rgba(255,251,246,0.38)",
  glassStrong: "rgba(255,251,246,0.8)",
  hairline: "rgba(36,31,28,0.08)",
  white: "#FFFFFF",
  danger: "#B42318",
  dangerSoft: "rgba(180,35,24,0.1)",
} as const;

export const atmosphere = {
  gradient: ["#FFF8F2", "#F6E0CC", "#F4EDE4"] as const,
  orbCoral: "rgba(227,106,74,0.18)",
  orbPeach: "rgba(243,196,168,0.28)",
  orbSage: "rgba(92,138,104,0.08)",
} as const;

export const space = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 12,
  md: 18,
  lg: 24,
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
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "600" as const,
    letterSpacing: -0.4,
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
  snappy: { damping: 18, stiffness: 320, mass: 0.7 },
  fluid: { damping: 22, stiffness: 200, mass: 0.9 },
  enter: { damping: 22, stiffness: 180, mass: 0.85 },
  pressIn: { damping: 20, stiffness: 380, mass: 0.7 },
  pressOut: { damping: 14, stiffness: 220, mass: 0.8 },
  pressScale: 0.97,
  cardScale: 0.985,
  driftMs: { clay: 14000, peach: 16000, sage: 18000 },
} as const;

export const glass = {
  soft: 22,
  regular: 34,
  strong: 48,
} as const;

export const typeScale = {
  body: 1.5,
  ui: 1.25,
} as const;
