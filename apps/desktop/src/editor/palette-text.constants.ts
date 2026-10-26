/* @layer renderer-app @kind constants */
const PALETTE_TEXT = {
  transparentName: 'transparent',
  swatch: (index: number, name: string, hex: string): string => (hex === '' ? `Swatch ${index}, ${name}` : `Swatch ${index}, ${name}, ${hex}`),
  count: (cap: number, transparent: boolean): string =>
    transparent ? `${cap - 1} opaque + transparent = ${cap}` : `${cap} opaque, no transparency = ${cap}`,
  hexCopied: (hex: string): string => `Copied ${hex}`,
  hexFailed: 'Could not copy the colour.',
  title: (name: string): string => `Palette ${name}`,
} as const;

export { PALETTE_TEXT };
