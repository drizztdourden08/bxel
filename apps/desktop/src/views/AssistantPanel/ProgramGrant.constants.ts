/* @layer renderer-app @kind constants */
import type { Level, PresetId, ToolName } from '@bxel/mcp';

const TOOL_TEXT: Readonly<Record<ToolName, string>> = {
  start_bxel: 'Starts a Bxel for the program to use.',
  show_window: 'Brings the Bxel window forward.',
  get_session: 'Reports the session and what it may do.',
  stop_bxel: 'Stops the Bxel the program started. Discarding unsaved work counts as editing.',
  list_places: 'Lists the places the program may look in.',
  list_files: 'Lists files in a place.',
  list_assets: 'Lists the assets of a project.',
  list_documents: 'Lists the open documents.',
  open_file: 'Opens a file as a document.',
  close_document: 'Closes a document. Discarding unsaved work counts as editing.',
  get_document: 'Reads a document and its structure.',
  get_animation: 'Reads an animation and its frames.',
  read_palette: 'Reads a palette.',
  read_pixels: 'Reads pixels of a cel.',
  list_map_layers: 'Lists the layers of a tilemap.',
  read_map_cells: 'Reads the cells of a tilemap layer.',
  render_preview: 'Renders a picture of a document.',
  preview_edits: 'Tries a batch of edits without applying it. Each step also follows its own group.',
  apply_edits: 'Applies a batch of edits. Each step also follows its own group: Edit pixels, Animation, Sheets and sprites or Tilemaps.',
  undo: 'Undoes the last change of a document.',
  save_document: 'Saves a document to a file.',
  export_document: 'Exports a document as an image or a sheet.',
  create_document: 'Creates a new document.',
  split_legacy_file: 'Splits an older file into separate assets.',
};

const LEVEL_NAME: Readonly<Record<Level, string>> = { disabled: 'Disabled', read: 'Read', edit: 'Edit' };

const PRESET_OPTIONS_ORDER: readonly PresetId[] = ['read_only', 'edit_documents', 'full_control'];

const GRANT_TEXT_UI = {
  customLabel: 'Custom',
  customReason: 'Change a level in Permissions to make a custom set.',
  blockedLabel: 'Blocked',
  presetLabel: 'Preset',
  searchLabel: 'Search tools',
  searchPlaceholder: 'Search tools',
  toolsTitle: 'Tools',
  toolsHint: 'Each group has a level. A tool follows its group unless you set it on its own.',
  lastSeen: (when: string): string => `Last connected ${when}`,
  blocked: 'This program is blocked and cannot connect. Pick a preset to let it connect again.',
  noMatch: 'No tool matches the search.',
  noTools: 'No tools in this group yet.',
  routedGroup: 'Controls the edit steps of this group.',
  toolCount: (count: number, overrides: number): string => {
    const base = `${count} ${count === 1 ? 'tool' : 'tools'}`;
    return overrides === 0 ? base : `${base}, ${overrides} overridden`;
  },
  overrides: (count: number): string => `${count} ${count === 1 ? 'override' : 'overrides'}`,
  overrideBadge: 'Override',
  followBundle: (tool: string): string => `Follow bundle for ${tool}`,
  groupName: (label: string): string => `${label} permission`,
  toolName: (tool: string, bundle: string, overridden: boolean): string =>
    overridden ? `${tool} permission, overrides ${bundle}` : `${tool} permission`,
  onlyReads: 'This tool only reads.',
  onlyWrites: 'This tool only writes.',
  groupOnlyReads: 'This group only reads.',
  shown: (count: number): string => `${count} ${count === 1 ? 'tool' : 'tools'} shown`,
  specialTitle: 'Special permissions',
  specialHint: 'Off unless you turn them on, and never part of a preset.',
  specialWarning: 'Turn this on only for a program you trust with your whole session. It can close Bxel while you work.',
  restartLabel: 'May restart Bxel',
  restartHint:
    'Developer use. The program may stop and restart Bxel, also a Bxel you opened, and reconnects with these same permissions. Unsaved work is kept as recovery or the restart is refused.',
  restartOn: (program: string): string => `${program} may now restart Bxel.`,
  restartOff: (program: string): string => `${program} may no longer restart Bxel.`,
  groupSet: (group: string, level: string, program: string, kept: number): string =>
    `${group} set to ${level} for ${program}.${kept === 0 ? '' : ` ${kept} ${kept === 1 ? 'override' : 'overrides'} kept.`}`,
  toolSet: (tool: string, level: string, program: string): string => `${tool} set to ${level} for ${program}.`,
  toolFollows: (tool: string, level: string, program: string): string => `${tool} now follows its group at ${level} for ${program}.`,
  presetSet: (preset: string, program: string): string => `${program} set to ${preset}.`,
} as const;

export { GRANT_TEXT_UI, LEVEL_NAME, PRESET_OPTIONS_ORDER, TOOL_TEXT };
