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
  list_layout: {},
  set_layout: {
    ops: [
      { op: 'dock', widget: 'timeline', side: 'right', size: 300 },
      { op: 'toolbarSide', toolbar: 'tools', side: 'left' },
      { op: 'toolbarLabels', toolbar: 'tools', on: true },
    ],
  },
  get_settings: { scope: 'app', page: 'canvas', schema: true },
  set_setting: { scope: 'project', key: 'project.name', value: 'Dungeon', show: true },
  restart_bxel: { unsaved: 'recover' },
};

const WIDGET = {
  id: 'timeline',
  label: 'Timeline',
  visible: true,
  placement: 'docked',
  side: 'right',
  size: 300,
  index: 0,
  tab: 0,
  rect: null,
  popped: false,
  available: true,
};

const TOOLBAR = { id: 'tools', label: 'Tools', shown: true, side: 'left', row: 0, index: 0, labels: true };

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
  list_layout: { ok: true, widgets: [WIDGET], toolbars: [TOOLBAR], presets: ['Default'] },
  set_layout: { ok: true, applied: 3, widgets: [WIDGET], toolbars: [TOOLBAR] },
  get_settings: {
    ok: true,
    scope: 'app',
    pages: [{ id: 'canvas', label: 'Canvas', route: 'settings/canvas', sections: [{ id: 'look', title: 'Look', items: [{ key: 'gridSize', label: 'Grid', value: 8, settable: true, locked: false, why: null, control: { kind: 'number', min: 1 } }] }] }],
    routes: [{ route: 'settings/canvas', title: 'Canvas', kind: 'page' }],
  },
  set_setting: { ok: true, scope: 'project', key: 'project.name', value: 'Dungeon', shown: true },
  restart_bxel: { ok: true, restarted: true, window: 'headless', sessionId: 's2', recovered: [DOC] },
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
