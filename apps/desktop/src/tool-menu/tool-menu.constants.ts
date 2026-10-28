/* @layer renderer-app @kind constants */
const TOOL_MENU_TEXT = {
  members: 'Variants',
  presets: 'Presets',
  savePreset: 'Save as preset...',
  resetOptions: 'Reset tool options',
  hide: 'Move to More tools',
  show: 'Show on the rail',
  panel: 'Tools panel...',
  optionsPanel: 'Tool options panel...',
  resetLayout: 'Show every tool on the rail',
} as const;

const TOOLS_WIDGET_ID = 'tools';

const OPTIONS_WIDGET_ID = 'options';

export { OPTIONS_WIDGET_ID, TOOL_MENU_TEXT, TOOLS_WIDGET_ID };
