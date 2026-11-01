/* @layer renderer-app @kind constants */
const PALETTE_TRANSFER_COMMAND = {
  import: 'palette.import_colours',
  export: 'palette.export',
  copyList: 'palette.copy_hex_list',
  saveProject: 'palette.save_project_palette',
  previewWith: 'palette.preview_with',
  previewEnd: 'palette.preview_end',
  moveColour: 'palette.move_colour_only',
  replaceFront: 'palette.replace_with_front',
  replaceRamp: 'palette.replace_ramp',
} as const;

const PALETTE_TRANSFER_IDS: readonly string[] = Object.values(PALETTE_TRANSFER_COMMAND);

export { PALETTE_TRANSFER_COMMAND, PALETTE_TRANSFER_IDS };
