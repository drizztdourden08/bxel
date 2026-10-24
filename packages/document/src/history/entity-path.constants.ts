/* @layer core @kind config */
const META_PATH = 'artwork.meta';
const ORDER_PATH = 'artwork.spriteOrder';
const COLLECTION_PREFIX = 'artwork.';
const SPRITE_PREFIX = 'sprite:';
const SHELL_PREFIX = 'shell:';
const CEL_PREFIX = 'cel:';
const COLLECTION_KEYS = ['banks', 'sheets', 'presets', 'tilesets', 'tilemaps'] as const;
const SHELL_KEYS = ['name', 'role', 'bankId', 'width', 'height', 'pivot', 'layers', 'frames', 'tags', 'slices'] as const;

export { CEL_PREFIX, COLLECTION_KEYS, COLLECTION_PREFIX, META_PATH, ORDER_PATH, SHELL_KEYS, SHELL_PREFIX, SPRITE_PREFIX };
