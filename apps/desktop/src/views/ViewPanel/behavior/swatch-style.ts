/* @layer renderer-app @kind logic */
const swatchStyle = (colour: string, opacity: number, gap: number): Record<string, string> => ({
  '--swatch-line': `color-mix(in srgb, ${colour} ${Math.round(Math.min(1, opacity + 0.25) * 100)}%, transparent)`,
  '--swatch-gap': `${Math.max(3, Math.min(12, gap * 2))}px`,
});

export { swatchStyle };
