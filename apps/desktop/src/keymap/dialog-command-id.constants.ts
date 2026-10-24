/* @layer renderer-app @kind constants */
const DIALOG_COMMAND = {
  newFile: 'file.new',
  newSprite: 'sprite.new',
  importImage: 'file.import_image',
  deleteSwatch: 'palette.delete_swatch',
  mergeSwatch: 'palette.merge_swatch',
  changeLimit: 'palette.change_limit',
} as const;

export { DIALOG_COMMAND };
