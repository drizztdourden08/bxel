/* @layer renderer-app @kind constants */
const PRESET_DIALOG_TEXT = {
  titleNew: 'Save as preset',
  titleEdit: 'Update preset',
  name: 'Name',
  namePlaceholder: 'For example Soft shading',
  fields: 'Save these options',
  fieldsHint: 'A preset keeps only the options you tick. The others stay as they are when it is applied. Colours are never saved.',
  save: 'Save',
  cancel: 'Cancel',
  nothing: 'Tick at least one option.',
} as const;

export { PRESET_DIALOG_TEXT };
