/* @layer renderer-app @kind constants */
const TOOL_MENU_TEXT = {
  members: 'Variants',
  presets: 'Presets',
  savePreset: 'Save as preset...',
  resetOptions: 'Reset tool options',
  changeKey: 'Change key...',
  hide: 'Move to More tools',
  show: 'Show on the rail',
  panel: 'Tools panel...',
  focusOptions: 'Tool options',
  optionsPanel: 'Tool options panel...',
  resetLayout: 'Show every tool on the rail',
  customize: 'Customize tools...',
} as const;

const TOOLS_WIDGET_ID = 'tools';

const OPTIONS_WIDGET_ID = 'options';

const VIEW_WIDGET_ID = 'view';

const KEYMAP_ROUTE = 'options/keyboard';

export { KEYMAP_ROUTE, OPTIONS_WIDGET_ID, TOOL_MENU_TEXT, TOOLS_WIDGET_ID, VIEW_WIDGET_ID };
