/* @layer tests @kind test */
const DOC = 'doc_4k9m2q7x1v8c';
const SPRITE = 'spr_4k9m2q7x1v8c';
const PROJECT = 'prj_8d2k4m6q9x1v';
const FOLDER = 'fld_7r2k9m4q';
const TILEMAP = 'tlm_4k9m2q7x1v8c';
const TILESET = 'tls_4k9m2q7x1v8c';
const MAP_LAYER = 'tml_4k9m2q7x1v8c';
const ANIMATION = 'anm_4k9m2q7x1v8c';
const ANIM_FRAME = 'afr_4k9m2q7x1v8c';
const TAG = 'tag_4k9m2q7x1v8c';
const BANK = 'bnk_4k9m2q7x1v8c';
const LOCATION = { projectId: PROJECT, folderId: FOLDER, path: 'sprites/hero.bxsprite' };

const ASSET_INPUT_EXAMPLES: Record<string, unknown> = {
  list_assets: { projectId: PROJECT, kinds: ['sprite', 'sheet'], folderId: FOLDER, usedBy: SPRITE },
  split_legacy_file: { file: { ...LOCATION, path: 'old.bxel' } },
  get_animation: { documentId: DOC, animationId: ANIMATION },
  list_map_layers: { documentId: DOC, tilemapId: TILEMAP, includeTiles: true },
  read_map_cells: { documentId: DOC, tilemapId: TILEMAP, layerId: MAP_LAYER, rect: { x: 0, y: 0, width: 2, height: 2 } },
};

const ASSET_OUTPUT_EXAMPLES: Record<string, unknown> = {
  list_assets: {
    ok: true,
    projectId: PROJECT,
    assets: [
      { kind: 'sprite', id: SPRITE, name: 'idle', fileName: 'idle.bxsprite', location: LOCATION, dirty: false, opened: true, usedBy: [], documentId: DOC, modifiedAt: '2026-10-23T19:42:10Z' },
    ],
    total: 1,
    notOpened: 0,
    truncated: false,
  },
  list_map_layers: {
    ok: true,
    revision: 12,
    tilemaps: [
      {
        tilemapId: TILEMAP,
        name: 'level',
        tilesetId: TILESET,
        columns: 32,
        rows: 24,
        orientation: 'orthogonal',
        layers: [{ layerId: MAP_LAYER, name: 'Ground', visible: true, locked: false }],
      },
    ],
    tilesets: [
      {
        tilesetId: TILESET,
        name: 'ground',
        tileWidth: 16,
        tileHeight: 16,
        tileCount: 1,
        terrain: null,
        tiles: [{ key: 1, spriteId: SPRITE, collision: 'full', animation: { animationId: ANIMATION, tagId: null, start: 'together' } }],
      },
    ],
  },
  read_map_cells: { ok: true, revision: 12, rect: { x: 0, y: 0, width: 2, height: 2 }, keys: [1, 0, 1, 1], flags: [0, 0, 1, 0] },
  get_animation: {
    ok: true,
    revision: 12,
    animationId: ANIMATION,
    name: 'water',
    width: 16,
    height: 16,
    bankId: BANK,
    anchor: { x2: 16, y2: 16 },
    loop: { direction: 'forward', repeat: 0 },
    directions: 'none',
    cycleMs: 400,
    frames: [
      { frameId: ANIM_FRAME, index: 0, spriteId: SPRITE, owned: true, clip: null, durationMs: 200, offset: { x: 0, y: 0 }, pivot: null },
      { frameId: 'afr_5k9m2q7x1v8c', index: 1, spriteId: null, owned: false, clip: null, durationMs: 200, offset: { x: 0, y: 0 }, pivot: null },
    ],
    tags: [{ kind: 'span', tagId: TAG, name: 'flow', from: 0, to: 1, direction: 'forward', repeat: 0 }],
    usedBy: { sheets: [], tilesets: [{ tilesetId: TILESET, keys: [1] }] },
  },
  split_legacy_file: { ok: true, files: [{ kind: 'sprite', name: 'idle', location: LOCATION, renamed: false }], skipped: 0 },
};

export { ASSET_INPUT_EXAMPLES, ASSET_OUTPUT_EXAMPLES };
