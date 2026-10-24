/* @layer renderer-app @kind constants */
const BXEL_16_COLORS = [
  { rgb: '#140b26', name: 'Night' },
  { rgb: '#4b1fa0', name: 'Indigo' },
  { rgb: '#7b3fe4', name: 'Violet' },
  { rgb: '#b02a9c', name: 'Magenta' },
  { rgb: '#e0245e', name: 'Crimson' },
  { rgb: '#ff7a8a', name: 'Coral' },
  { rgb: '#f4eeff', name: 'Snow' },
  { rgb: '#a58cf0', name: 'Lilac' },
  { rgb: '#e9b8ff', name: 'Orchid' },
  { rgb: '#ffc9a8', name: 'Peach' },
  { rgb: '#ffd66b', name: 'Gold' },
  { rgb: '#3fd0a8', name: 'Mint' },
  { rgb: '#1f6f8b', name: 'Teal' },
  { rgb: '#8ad1ff', name: 'Sky' },
  { rgb: '#7a6b99', name: 'Dusk' },
] as const;

const DEFAULT_ARTWORK = {
  name: 'Untitled',
  bank: { name: 'Bxel 16', cap: 16, transparent: true, colors: BXEL_16_COLORS },
  sprite: { name: 'sprite', width: 32, height: 32 },
} as const;

export { DEFAULT_ARTWORK };
