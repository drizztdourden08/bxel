/* @layer tests @kind test */
const BANK = 'bnk_4k9m2q7x1v8c';
const SPRITE = 'spr_4k9m2q7x1v8c';
const SHEET = 'sht_4k9m2q7x1v8c';
const TILESET = 'tls_4k9m2q7x1v8c';
const RECT = { x: 0, y: 0, width: 2, height: 2 };
const GUIDES = { x: [8], y: [] };

const GET_DOCUMENT_OUTPUT = {
  ok: true,
  documentId: 'doc_4k9m2q7x1v8c',
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
      layers: [{ layerId: 'lay_4k9m2q7x1v8c', name: 'Layer 1', visible: true, locked: false }],
      frames: [{ frameId: 'frm_4k9m2q7x1v8c', durationMs: 100 }],
      tags: [
        { name: 'walk', from: 0, to: 3, colour: '#3b82f6', tagId: 'tag_4k9m2q7x1v8c', direction: 'pingpong', repeat: 2 },
        { name: 'idle', from: 0, to: 1 },
      ],
      slices: [{ sliceId: 'slc_4k9m2q7x1v8c', name: 'hit', rect: RECT, pivot: { x2: 2, y2: 2 }, center: null }],
      guides: GUIDES,
      symmetry: null,
    },
  ],
  spritesTotal: 1,
  truncated: false,
  animations: [{ animationId: 'anm_4k9m2q7x1v8c', name: 'walk', width: 32, height: 32, frames: 4, tags: 1 }],
  sheets: [
    {
      sheetId: SHEET,
      name: 'atlas',
      width: 128,
      height: 64,
      entries: 3,
      layout: { kind: 'grid', columns: 4, spacing: 1, margin: 0 },
      entryList: [{ kind: 'sprite', id: SPRITE, name: 'hero/idle', folder: 'hero', at: { x: 0, y: 0 }, source: null, tagId: null }],
      guides: GUIDES,
    },
  ],
  brushes: [{ brushId: 'brs_4k9m2q7x1v8c', name: 'Corner', width: 2, height: 2 }],
  tilesets: [{ tilesetId: TILESET, name: 'ground', bankId: BANK, tileWidth: 16, tileHeight: 16, tiles: 1 }],
  tilemaps: [{ tilemapId: 'tlm_4k9m2q7x1v8c', name: 'level', tilesetId: TILESET, columns: 20, rows: 10, layers: 2, guides: GUIDES }],
  tilesetDetails: [
    {
      tilesetId: TILESET,
      columns: 1,
      rows: 1,
      collisionLayers: [],
      fields: [],
      terrainSets: [],
      tiles: [
        {
          key: 1,
          spriteId: SPRITE,
          name: 'grass',
          index: 0,
          uses: 4,
          shapes: [{ kind: 'full', layer: 'default', oneWay: false }],
          animation: null,
          type: null,
          probability: 1,
          turns: 'none',
          data: {},
        },
      ],
    },
  ],
  presets: [{ presetId: 'exp_4k9m2q7x1v8c', name: 'Web', format: 'png', scale: 2, sheetId: null, pathTemplate: '{name}.png' }],
};

export { GET_DOCUMENT_OUTPUT };
