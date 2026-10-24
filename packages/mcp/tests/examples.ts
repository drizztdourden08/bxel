/* @layer tests @kind test */
const DOC = 'doc_4k9m2q7x1v8c';
const SPRITE = 'spr_4k9m2q7x1v8c';
const LAYER = 'lay_4k9m2q7x1v8c';
const FRAME = 'frm_4k9m2q7x1v8c';
const BANK = 'bnk_4k9m2q7x1v8c';
const SHEET = 'sht_4k9m2q7x1v8c';
const PROJECT = 'prj_8d2k4m6q9x1v';
const FOLDER = 'fld_7r2k9m4q';
const RECENT = 'rcf_2q8m4k6x';
const SHA = `sha256:${'9f'.repeat(32)}`;
const LOCATION = { projectId: PROJECT, folderId: FOLDER, path: 'sprites/hero.bxel' };
const RECT = { x: 0, y: 0, width: 2, height: 2 };
const SCOPE = { sprites: [SPRITE], layers: { by: 'all' }, frames: { by: 'all' } };
const CHANGES = {
  artwork: false,
  banks: [],
  sprites: [
    {
      id: SPRITE,
      kind: 'updated',
      meta: false,
      structure: false,
      recolored: false,
      cels: [{ celId: 'cel_4k9m2q7x1v8c', layerId: LAYER, frameId: FRAME, rect: RECT }],
    },
  ],
  sheets: [],
  presets: [],
};
const TRANSACTION = {
  ok: true,
  mode: 'commit',
  baseRevision: 12,
  revision: 13,
  noop: false,
  changes: CHANGES,
  created: {},
  report: { pixels: 4 },
  warnings: [],
  preview: null,
};
const EDIT_STEPS = [
  { name: 'pixels.patch', targets: SCOPE, options: { rect: RECT, pixels: 'AAECAw==' } },
  { name: 'layer.add', targets: SCOPE, options: { name: 'Ink' } },
  { name: 'sprite.create', targets: null, options: { name: 'idle', width: 16, height: 16 } },
];

const INPUT_EXAMPLES: Record<string, unknown> = {
  start_bxel: { window: 'headless' },
  show_window: {},
  stop_bxel: { unsaved: 'recover' },
  get_session: {},
  list_places: {},
  list_files: { projectId: PROJECT, folderId: FOLDER, path: 'sprites' },
  open_file: { file: LOCATION },
  close_document: { documentId: DOC },
  list_documents: {},
  get_document: { documentId: DOC },
  read_palette: { documentId: DOC },
  read_pixels: { documentId: DOC, spriteId: SPRITE, frameId: FRAME, layer: 'flattened', rect: RECT },
  render_preview: { documentId: DOC, target: { spriteId: SPRITE } },
  preview_edits: { documentId: DOC, baseRevision: 12, label: 'Outline', steps: EDIT_STEPS },
  apply_edits: { documentId: DOC, baseRevision: 12, label: 'Outline', steps: EDIT_STEPS, clientRequestId: 'try-1' },
  undo: { documentId: DOC, expectedRevision: 13 },
  save_document: { documentId: DOC, asset: { kind: 'sprite', id: SPRITE }, target: { fileName: 'hero.bxsprite', moveAsset: true } },
  export_document: { documentId: DOC, format: 'png', source: { spriteId: SPRITE }, fileName: 'idle.png' },
  create_document: { name: 'Hero', kind: 'sheet', bank: { name: 'Main', cap: 16, transparent: true, colors: [{ rgb: '#140B26' }] }, sprite: { name: 'idle', width: 16, height: 16 } },
};

const OUTPUT_EXAMPLES: Record<string, unknown> = {
  start_bxel: { ok: true, started: true, window: 'headless', launchedBy: 'this_helper', readyMs: 2140 },
  show_window: { ok: true, shown: true, window: 'visible' },
  stop_bxel: { ok: true, stopped: true, recovered: [DOC], discarded: [] },
  get_session: {
    ok: true,
    sessionId: 's3',
    mode: 'edit',
    client: { name: 'pixel-agent', version: '2.4.1' },
    trust: 'remembered',
    instance: { window: 'headless', launchedBy: 'this_helper', canStop: true },
    scope: { see: 'everything', write: 'where_bxel_can' },
    bxelVersion: '0.4.0',
    contract: 1,
    assistantFolder: 'Documents\\Bxel Assistant',
    exportFormats: ['png'],
    commands: ['pixels.patch'],
    limits: {
      steps: 256,
      points: 8192,
      patchPixels: 65536,
      batchPatchPixels: 262144,
      readPixels: 65536,
      previewPixels: 65536,
      renderSide: 2048,
      targetSprites: 64,
      listEntries: 500,
    },
  },
  list_places: {
    ok: true,
    projects: [
      {
        projectId: PROJECT,
        name: 'Dungeon',
        access: 'edit',
        open: true,
        folders: [{ folderId: FOLDER, name: 'Dungeon' }],
        newFiles: { folderId: FOLDER, path: 'sprites' },
        exports: null,
      },
    ],
    recent: [{ recentId: RECENT, fileName: 'boss.bxel', kind: 'bxel', openedAt: '2026-10-22T18:01:00Z', documentId: null }],
    assistantFolder: { name: 'Bxel Assistant', writable: true },
  },
  list_files: {
    ok: true,
    path: 'sprites',
    entries: [
      { name: 'old', kind: 'folder' },
      { name: 'hero.bxel', kind: 'bxel', bytes: 18234, modifiedAt: '2026-10-23T19:42:10Z', documentId: DOC },
    ],
    total: 2,
    skipped: 0,
    truncated: false,
  },
  open_file: { ok: true, documentId: DOC, revision: 1, alreadyOpen: false, readOnly: false, outcome: 'ok', fileName: 'slime.bxel' },
  close_document: { ok: true, closed: true, discarded: false },
  list_documents: {
    ok: true,
    documents: [
      {
        documentId: DOC,
        name: 'Hero',
        fileName: 'hero.bxel',
        place: LOCATION,
        revision: 12,
        dirty: true,
        readOnly: false,
        active: true,
        openedBy: 'owner',
        sprites: 3,
        sheets: 1,
      },
    ],
  },
  get_document: {
    ok: true,
    documentId: DOC,
    revision: 12,
    name: 'Hero',
    canUndo: true,
    canRedo: false,
    undoIsOwn: false,
    banks: [{ bankId: BANK, name: 'Main', cap: 16, used: 9, transparent: true }],
    sprites: [
      {
        spriteId: SPRITE,
        name: 'idle',
        width: 32,
        height: 32,
        bankId: BANK,
        pivot: { x2: 32, y2: 64 },
        layers: [{ layerId: LAYER, name: 'Layer 1', visible: true, locked: false }],
        frames: [{ frameId: FRAME, durationMs: 100 }],
        tags: [{ name: 'walk', from: 0, to: 3, colour: '#3b82f6' }, { name: 'idle', from: 0, to: 1 }],
      },
    ],
    spritesTotal: 1,
    truncated: false,
    sheets: [{ sheetId: SHEET, name: 'atlas', width: 128, height: 64, entries: 3 }],
  },
  read_palette: {
    ok: true,
    revision: 12,
    bankId: BANK,
    name: 'Main',
    cap: 16,
    transparent: true,
    slots: [
      { index: 0, swatchId: 'sw_4k9m2q7x1v8c', hex: null, name: 'Transparent' },
      { index: 1, swatchId: 'sw_5k9m2q7x1v8c', hex: '#140B26', name: 'Outline' },
    ],
    ramps: [{ rampId: 'rmp_4k9m2q7x1v8c', name: 'Skin', indexes: [3, 4, 5] }],
  },
  read_pixels: {
    ok: true,
    revision: 12,
    rect: RECT,
    encoding: 'u8-rowmajor-base64',
    pixels: 'AAECAw==',
    indexHash: SHA,
    colorUse: [[0, 1], [1, 3]],
  },
  render_preview: { ok: true, revision: 12, width: 128, height: 128, scale: 4, indexHash: SHA, uri: 'bxel://doc/preview.png' },
  preview_edits: { ...TRANSACTION, mode: 'preview', preview: { cels: [], colorUse: { [BANK]: [0, 4] }, truncated: false } },
  apply_edits: TRANSACTION,
  undo: { ok: true, baseRevision: 13, revision: 14, undone: { label: 'Agent (pixel-agent): outline', origin: 'mcp' }, changes: CHANGES },
  save_document: { ok: true, revision: 14, fileName: 'hero.bxsprite', place: LOCATION, bytes: 18234, savedAt: '2026-10-23T19:42:10Z' },
  export_document: { ok: true, revision: 14, files: [{ fileName: 'idle.png', bytes: 412, sha256: SHA }], indexHash: SHA },
  create_document: { ok: true, documentId: DOC, revision: 1, asset: { kind: 'sheet', id: 'sht_0123456789abcdef' } },
};

export { INPUT_EXAMPLES, OUTPUT_EXAMPLES, SCOPE };
