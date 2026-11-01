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
const PLACE = { folderId: FOLDER, path: 'sprites/hero.bxsprite' };
const LOCATION = { projectId: PROJECT, folderId: FOLDER, path: 'sprites/hero.bxsprite' };

const ASSET_INPUT_EXAMPLES: Record<string, unknown> = {
  list_assets: { projectId: PROJECT, kinds: ['sprite', 'sheet'], folderId: FOLDER, usedBy: SPRITE, query: 'tag:hero is:unsaved', states: ['open'], withLinks: true },
  find_references: { projectId: PROJECT, file: PLACE, direction: 'both' },
  project_health: { projectId: PROJECT, checks: ['broken', 'moved'] },
  repair_links: { projectId: PROJECT, fixes: [{ file: PLACE, linkId: BANK, by: 'id' }] },
  organise: { projectId: PROJECT, op: 'tag', files: [PLACE], tags: ['hero'] },
  move_files: { projectId: PROJECT, files: [PLACE], into: { folderId: FOLDER, path: 'heroes' } },
  rename_file: { projectId: PROJECT, file: PLACE, name: 'knight' },
  create_folder: { projectId: PROJECT, in: { folderId: FOLDER }, name: 'heroes' },
  trash_files: { projectId: PROJECT, files: [PLACE], breakLinks: false },
  duplicate_file: { projectId: PROJECT, files: [PLACE] },
  import_files: { projectId: PROJECT, sources: [{ folderId: FOLDER, path: 'art/hero.png' }], into: { folderId: FOLDER, path: 'heroes' } },
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
      { kind: 'sprite', id: SPRITE, name: 'idle', fileName: 'idle.bxsprite', location: LOCATION, dirty: false, opened: true, usedBy: [], documentId: DOC, modifiedAt: '2026-10-23T19:42:10Z', tags: ['hero'], collections: ['Players'], pinned: false, states: ['open'], uses: [], missingLinks: [] },
    ],
    total: 1,
    notOpened: 0,
    truncated: false,
  },
  find_references: {
    ok: true,
    projectId: PROJECT,
    target: { assetId: SPRITE, kind: 'sprite', name: 'hero', location: LOCATION },
    usedBy: [{ assetId: 'sht_4k9m2q7x1v8c', kind: 'sheet', name: 'walk', location: { ...LOCATION, path: 'sheets/walk.bxsheet' }, state: 'ok' }],
    uses: [{ assetId: BANK, kind: 'palette', name: 'bxel-16', location: null, state: 'missing' }],
  },
  project_health: {
    ok: true,
    projectId: PROJECT,
    files: 12,
    total: 1,
    findings: [{ check: 'moved', fix: 'link:C:/Art/walk.bxsheet|spr_4k9m2q7x1v8c', message: 'walk.bxsheet links to hero.bxsprite', file: { ...LOCATION, path: 'sheets/walk.bxsheet' }, linkId: SPRITE, foundAt: LOCATION }],
  },
  repair_links: { ok: true, projectId: PROJECT, fixed: 1, skipped: [{ file: 'sheets/idle.bxsheet', linkId: SPRITE, reason: 'More than one file holds that asset. Choose one with its path.' }] },
  organise: { ok: true, projectId: PROJECT, note: 'Tagged 1 file with 1 tag.', affected: 1, collections: [{ id: 'col_1a2b3c4d', name: 'Players', assets: 2 }], searches: [{ id: 'smart_1a2b3c4d', name: 'Heroes', query: 'tag:hero' }] },
  move_files: { ok: true, projectId: PROJECT, moved: [{ from: LOCATION, to: { ...LOCATION, path: 'heroes/hero.bxsprite' } }], linksRewritten: 2 },
  rename_file: { ok: true, projectId: PROJECT, from: LOCATION, to: { ...LOCATION, path: 'sprites/knight.bxsprite' }, linksRewritten: 2 },
  create_folder: { ok: true, projectId: PROJECT, folder: { ...LOCATION, path: 'heroes' } },
  duplicate_file: { ok: true, projectId: PROJECT, created: [{ from: LOCATION, to: { ...LOCATION, path: 'sprites/hero copy.bxsprite' } }] },
  import_files: { ok: true, projectId: PROJECT, imported: [{ source: { ...LOCATION, path: 'art/hero.png' }, created: [{ ...LOCATION, path: 'heroes/hero.bxsprite' }] }], skipped: [{ path: 'art/notes.txt', reason: 'Only PNG and GIF images and GPL and PAL palette files can be imported.' }] },
  trash_files: { ok: true, projectId: PROJECT, trashed: [LOCATION], brokenLinksIn: [{ ...LOCATION, path: 'sheets/walk.bxsheet' }] },
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
      { frameId: ANIM_FRAME, index: 0, spriteId: SPRITE, owned: true, clip: null, durationMs: 200, offset: { x: 0, y: 0 }, pivot: null, sameSpriteAs: null },
      { frameId: 'afr_5k9m2q7x1v8c', index: 1, spriteId: SPRITE, owned: false, clip: null, durationMs: 200, offset: { x: 0, y: 0 }, pivot: null, sameSpriteAs: 0 },
    ],
    tags: [{ kind: 'span', tagId: TAG, name: 'flow', from: 0, to: 1, direction: 'forward', repeat: 0, facing: 'e' }],
    plays: [
      {
        tagId: null,
        name: 'water',
        facing: null,
        mirrorOf: null,
        flip: null,
        direction: 'forward',
        repeat: 0,
        forever: true,
        steps: [
          { index: 0, frameId: ANIM_FRAME, flip: null, ms: 200 },
          { index: 1, frameId: 'afr_5k9m2q7x1v8c', flip: null, ms: 200 },
        ],
        truncated: false,
        passMs: 400,
        totalMs: 400,
        fps: 5,
      },
    ],
    facings: { e: TAG },
    usedBy: { sheets: [], tilesets: [{ tilesetId: TILESET, keys: [1] }] },
  },
  split_legacy_file: { ok: true, files: [{ kind: 'sprite', name: 'idle', location: LOCATION, renamed: false }], skipped: 0 },
};

export { ASSET_INPUT_EXAMPLES, ASSET_OUTPUT_EXAMPLES };
