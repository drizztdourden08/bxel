/* @layer tests @kind test */
const DOC = 'doc_4k9m2q7x1v8c';
const SPRITE = 'spr_4k9m2q7x1v8c';
const LAYER = 'lay_4k9m2q7x1v8c';

const COMMAND_ROW = {
  id: 'view.zoom_in',
  label: 'Zoom in',
  group: 'View',
  area: 'app_control',
  chord: 'Plus',
  enabled: true,
  reason: null,
  checkable: false,
  checked: null,
  effect: 'show',
  args: null,
  opensDialog: false,
};

const SELECTION = { empty: false, bounds: { x: 1, y: 1, width: 2, height: 1 }, pixels: 2, runs: [[1, 1, 2]] };

const APP_INPUT_EXAMPLES: Record<string, unknown> = {
  list_commands: { area: 'app_control', query: 'zoom' },
  run_command: { id: 'transform.rotate', args: { angle: 45 }, revision: 12 },
  get_view: {},
  set_view: {
    focus: { documentId: DOC, raise: true },
    zoom: { rect: { x: 0, y: 0, width: 8, height: 8 } },
    toggles: { grid: true, tiled: 'both' },
    select: { sprite: SPRITE, layer: LAYER },
    tool: { id: 'pencil', options: { brushSize: 2 } },
    colours: { foreground: 3 },
    symmetry: { x: true, axisX: 8 },
    selection: { op: 'add', shape: { kind: 'wand', x: 2, y: 3 } },
  },
  get_history: { documentId: DOC, limit: 20 },
};

const APP_OUTPUT_EXAMPLES: Record<string, unknown> = {
  list_commands: { ok: true, commands: [COMMAND_ROW], total: 1 },
  run_command: { ok: true, ran: true, id: 'view.zoom_in', label: 'Zoom in', revision: 12, viewChanged: true, opened: null },
  get_view: {
    ok: true,
    window: 'visible',
    visible: true,
    page: null,
    dialog: null,
    tabs: [{ tabId: 'tab1', documentId: DOC, name: 'hero.bxsprite', asset: 'sprite:spr', dirty: false, active: true }],
    active: { documentId: DOC, revision: 12, sprite: SPRITE },
    tool: { id: 'pencil' },
    colours: { foreground: 1 },
    symmetry: { x: false },
    zoom: { percent: 800 },
    toggles: { grid: true },
    playback: { playing: false },
    selection: { ...SELECTION, variant: 'rect', combine: 'replace' },
    clipboard: null,
    sprites: { selected: [] },
  },
  set_view: { ok: true, applied: ['focus', 'zoom'], visible: true, selection: SELECTION },
  get_history: {
    ok: true,
    revision: 14,
    entries: [{ index: 0, label: 'Outline', actor: 'owner', origin: 'ui', applied: true }],
    cursor: 1,
    total: 1,
    canUndo: true,
    canRedo: false,
  },
};

export { APP_INPUT_EXAMPLES, APP_OUTPUT_EXAMPLES };
