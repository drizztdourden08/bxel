/* @layer renderer-app @kind constants */
const TILE_SET_REF = 'made-tileset';

const TILESET_TEXT = {
  name: 'Tileset',
  menu: 'Tileset from these',
  needSprites: 'Pick at least one sprite.',
  sameSize: 'The sprites differ in size. A tileset needs sprites of one size.',
  samePalette: 'The sprites use different palettes. Give them one palette first.',
  label: (count: number): string => (count === 1 ? 'Make a tileset from a sprite' : `Make a tileset from ${count} sprites`),
} as const;

export { TILE_SET_REF, TILESET_TEXT };
