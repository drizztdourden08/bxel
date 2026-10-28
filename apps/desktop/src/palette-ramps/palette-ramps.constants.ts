/* @layer renderer-app @kind constants */
const RAMP_REF = (at: number): string => `ramp-step-${at}`;

const RAMP_TEXT = {
  defaultName: (number: number): string => `Ramp ${number}`,
  noRoom: (added: number, free: number): string =>
    `This ramp needs ${added} new colours and the palette has ${free} free slots. Raise the limit or reuse more.`,
  fits: (added: number, free: number): string => `${added} new colours, ${free} free slots.`,
  tooShort: 'A ramp needs at least two swatches.',
  gradient: (count: number): string => (count === 1 ? 'Recoloured 1 swatch as a gradient.' : `Recoloured ${count} swatches as a gradient.`),
  gradientLabel: 'Gradient between swatches',
  gradientShort: 'Choose two swatches with at least one swatch between them.',
} as const;

const SPHERE = { size: 16, margin: 0.5, light: [-0.45, -0.55, 0.7] } as const;

export { RAMP_REF, RAMP_TEXT, SPHERE };
