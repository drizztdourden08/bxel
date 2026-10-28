/* @layer renderer-app @kind constants */
const PRESET_TEXT = {
  region: 'Presets',
  empty: 'No presets for this tool yet. Save the current options as one.',
  save: 'Save as preset',
  apply: 'Apply',
  inUse: 'In use',
  actions: (name: string): string => `Actions for ${name}`,
  rename: 'Rename',
  duplicate: 'Duplicate',
  update: 'Update from current',
  remove: 'Delete',
  confirmRemove: 'Click again to delete',
  up: 'Move up',
  down: 'Move down',
  nameField: 'Preset name',
  builtIn: 'Built in',
} as const;

export { PRESET_TEXT };
