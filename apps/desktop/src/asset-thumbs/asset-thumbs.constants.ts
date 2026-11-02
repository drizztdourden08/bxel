/* @layer renderer-app @kind constants */
const THUMB_SIDE = 64;

const THUMB_CACHE_MAX = 1500;

const PALETTE_SWATCH_MAX = 16;

const IMAGE_BYTES_MAX = 524288;

const THUMB_MIME = 'image/png';

const GIF_MIME = 'image/gif';

const IDLE_TIMEOUT_MS = 200;

const HOVER_FRAME_MIN_MS = 40;

const HOVER_FRAME_MAX_MS = 1000;

const SETTLE_MS = 160;

const LOADED_THUMB_KINDS: readonly string[] = ['sheet', 'palette', 'tileset', 'tilemap'];

const NATIVE_KINDS: readonly string[] = ['sprite', 'animation', 'sheet', 'palette', 'tileset', 'tilemap', 'legacy'];

export { GIF_MIME, HOVER_FRAME_MAX_MS, HOVER_FRAME_MIN_MS, IDLE_TIMEOUT_MS, IMAGE_BYTES_MAX, LOADED_THUMB_KINDS, NATIVE_KINDS, PALETTE_SWATCH_MAX, SETTLE_MS, THUMB_CACHE_MAX, THUMB_MIME, THUMB_SIDE };
