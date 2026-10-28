/* @layer core @kind constants */
const RAMP_DEFAULTS = {
  light: 3,
  dark: 3,
  hueShift: 15,
  hueMode: 'shift',
  chromaCurve: true,
  snap: 0.03,
} as const;

const RAMP_LIMITS = { maxSide: 8, maxHueShift: 45, maxSnap: 0.2 } as const;

const RAMP_HUE = { warm: 90, cool: 280 } as const;

const RAMP_SPAN = { lightTop: 0.97, lightShare: 0.8, darkShare: 0.35 } as const;

const RAMP_CHROMA_DROP = { light: 0.6, dark: 0.45 } as const;

export { RAMP_CHROMA_DROP, RAMP_DEFAULTS, RAMP_HUE, RAMP_LIMITS, RAMP_SPAN };
