/* @layer renderer-app @kind constants */
const TILE_SIZE_DEFAULT = { width: 16, height: 16, map: { columns: 16, rows: 16 } } as const;

const SHEET_SPRITE_SIZE = { width: 16, height: 16 } as const;

export { SHEET_SPRITE_SIZE, TILE_SIZE_DEFAULT };
