/* @layer tests @kind test */
import { ONION_DEFAULTS } from '../src/schema/onion-defaults.constants';

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
  state: 'shown',
  only: null,
  reason: null,
  checkable: false,
  checked: null,
  effect: 'show',
  args: null,
  opensDialog: false,
};

const PROJECT = 'prj_8d2k4m6q9x1v';
const FOLDER = 'fld_7r2k9m4q';
const PLACE = { projectId: PROJECT, folderId: FOLDER, path: 'sprites/hero.bxsprite' };

const OPTION_ROW = {
  id: 'pencil.size',
  tool: 'pencil',
  label: 'Size',
  description: 'The width of the brush in pixels.',
  kind: 'number',
  tier: 1,
  group: 'brush',
  memory: 'tool',
  default: 1,
  min: 1,
  max: 64,
  choices: null,
  command: null,
  value: 2,
  applies: true,
  disabled: null,
};

const PRESET_ROW = { id: 'builtin.pencil-2', name: 'Pencil 2', member: 'pencil', builtin: true, fields: { 'pencil.size': 2 }, summary: 'Size 2', active: true };

const SELECTION = { empty: false, bounds: { x: 1, y: 1, width: 2, height: 1 }, pixels: 2, runs: [[1, 1, 2]] };

const APP_INPUT_EXAMPLES: Record<string, unknown> = {
  list_commands: { area: 'app_control', query: 'zoom', includeHidden: true },
  list_tools: { surface: 'sprite' },
  list_presets: { member: 'pencil' },
  apply_preset: { id: 'builtin.pencil-2' },
  save_preset: { member: 'pencil', name: 'Thick', fields: { 'pencil.size': 4 } },
  update_preset: { id: 'usr.thick', name: 'Thicker', fields: { 'pencil.size': 6 } },
  delete_preset: { id: 'usr.thick' },
  run_command: { id: 'transform.rotate', args: { angle: 45 }, revision: 12 },
  get_view: {},
  set_view: {
    focus: { documentId: DOC, raise: true },
    zoom: { rect: { x: 0, y: 0, width: 8, height: 8 } },
    toggles: { grid: true, tiled: 'both' },
    timeline: { frameId: 'afr_4k9m2q7x1v8c', range: { kind: 'loop', from: 'afr_4k9m2q7x1v8c', to: 'afr_5k9m2q7x1v8c' }, playMode: 'pingpong', zoom: 'fit', onion: { on: true, before: 2, after: 2, wrap: true } },
    select: { sprite: SPRITE, layer: LAYER },
    tool: { member: 'pencil', options: { 'pencil.size': 2 } },
    properties: { file: PLACE },
    browse: { folder: { projectId: PROJECT, folderId: FOLDER }, view: 'list', selection: [PLACE], search: 'kind:sprite' },
    reveal: PLACE,
    projectPanel: { mode: 'tree', chips: ['kind:sprite'] },
    tileset: { mode: 'collision', stamp: { columns: 2, rows: 1, keys: [1, 2] }, scatter: false, collisionOverlay: true },
    colours: { foreground: 3 },
    symmetry: { x: true, axisX: 8 },
    selection: { op: 'add', shape: { kind: 'wand', x: 2, y: 3 } },
    mapSelection: { op: 'add', cells: { by: 'wand', x: 2, y: 3 } },
  },
  get_history: { documentId: DOC, limit: 20 },
  list_layout: {},
  set_layout: {
    ops: [
      { op: 'dock', widget: 'timeline', side: 'right', size: 300 },
      { op: 'toolbarSide', toolbar: 'tools', side: 'left' },
      { op: 'toolbarLabels', toolbar: 'tools', on: true },
      { op: 'toolbarColumns', toolbar: 'tools', columns: 2 },
      { op: 'hideTool', member: 'spray' },
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

const TOOLBAR = { id: 'tools', label: 'Tools', shown: true, side: 'left', row: 0, index: 0, labels: true, columns: 2, hiddenItems: [] };

const APP_OUTPUT_EXAMPLES: Record<string, unknown> = {
  list_commands: { ok: true, commands: [COMMAND_ROW], total: 1 },
  list_tools: {
    ok: true,
    surface: 'sprite',
    current: 'sprite',
    surfaces: ['sprite', 'tile', 'map', 'sheet'],
    slots: [{ id: 'pencil', group: 'draw', label: 'Pencil', key: 'B', tool: 'pencil', surfaces: ['sprite'], active: true, members: [{ id: 'pencil', label: 'Pencil', description: 'Draws pixels.', variant: null, hidden: false }], options: [OPTION_ROW] }],
    presets: [PRESET_ROW],
  },
  list_presets: { ok: true, presets: [PRESET_ROW] },
  apply_preset: { ok: true, preset: PRESET_ROW },
  save_preset: { ok: true, preset: { ...PRESET_ROW, id: 'usr.thick', builtin: false } },
  update_preset: { ok: true, preset: { ...PRESET_ROW, id: 'usr.thick', builtin: false } },
  delete_preset: { ok: true, deleted: 'usr.thick' },
  run_command: { ok: true, ran: true, id: 'view.zoom_in', label: 'Zoom in', revision: 12, viewChanged: true, opened: null },
  get_view: {
    ok: true,
    window: 'visible',
    visible: true,
    page: null,
    dialog: null,
    context: { fileType: 'sprite', surface: 'sprite' },
    ui: { workspace: 'sprite', widgets: [{ id: 'layers', state: 'shown', reason: null }], toolbars: [{ id: 'tools', state: 'shown' }], kindMenu: { kind: 'sprite', state: 'shown' } },
    tabs: [{ tabId: 'tab1', documentId: DOC, name: 'hero.bxsprite', asset: 'sprite:spr', dirty: false, active: true }],
    active: { documentId: DOC, revision: 12, sprite: SPRITE },
    tool: { id: 'pencil' },
    colours: { foreground: 1 },
    symmetry: { x: false },
    zoom: { percent: 800 },
    toggles: { grid: true },
    pointer: { x: 4, y: 7 },
    playback: { playing: false },
    timeline: {
      animationId: 'anm_4k9m2q7x1v8c',
      frameId: 'afr_4k9m2q7x1v8c',
      pickedFrameIds: ['afr_4k9m2q7x1v8c'],
      range: { kind: 'tag', tagId: 'tag_4k9m2q7x1v8c' },
      playing: false,
      playMode: 'loop',
      speed: 1,
      zoom: 48,
      timeMode: false,
      units: 'ms',
      onion: { ...ONION_DEFAULTS, on: true, before: 2, after: 2 },
    },
    selection: { ...SELECTION, variant: 'rect', combine: 'replace' },
    mapSelection: null,
    clipboard: null,
    sprites: { selected: [] },
    properties: { status: 'none', pinned: false, back: 0, forward: 0, subject: null },
    browse: { folder: null, view: 'grid', search: '', chips: [], selection: [] },
    projectPanel: null,
    tileset: { mode: 'tiles', search: '', filters: [], stamp: { columns: 1, rows: 1, keys: [1] }, scatter: false, terrainBrush: false, collisionOverlay: false },
  },
  list_layout: { ok: true, widgets: [WIDGET], toolbars: [TOOLBAR], presets: ['Default'] },
  set_layout: { ok: true, applied: 5, widgets: [WIDGET], toolbars: [TOOLBAR] },
  get_settings: {
    ok: true,
    scope: 'app',
    pages: [{ id: 'canvas', label: 'Canvas', route: 'settings/canvas', sections: [{ id: 'look', title: 'Look', items: [{ key: 'gridSize', label: 'Grid', value: 8, settable: true, locked: false, why: null, control: { kind: 'number', min: 1 } }] }] }],
    routes: [{ route: 'settings/canvas', title: 'Canvas', kind: 'page' }],
  },
  set_setting: { ok: true, scope: 'project', key: 'project.name', value: 'Dungeon', shown: true },
  restart_bxel: { ok: true, restarted: true, window: 'headless', sessionId: 's2', recovered: [DOC] },
  set_view: { ok: true, applied: ['focus', 'zoom'], visible: true, selection: SELECTION, mapSelection: null },
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
