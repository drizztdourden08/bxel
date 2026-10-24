/* @layer renderer-app @kind constants */
const SHEET_COMMAND = {
  modeSprite: 'mode.set_sprite',
  modeSheet: 'mode.set_sheet',
  isolate: 'sprite.isolate',
  back: 'sprite.back',
  broadcast: 'scope.set_broadcast',
  duplicateSprite: 'sprite.duplicate',
  deleteSprite: 'sprite.delete',
  moveEarlier: 'sprite.move_earlier',
  moveLater: 'sprite.move_later',
  renameSprite: 'sprite.rename',
  duplicateFrame: 'frame.duplicate',
  arrangeGrid: 'sheet.arrange_grid',
  arrangePacked: 'sheet.arrange_packed',
  arrangeManual: 'sheet.arrange_manual',
  importSheet: 'sheet.import',
  sliceAdd: 'slice.add',
  sliceRemove: 'slice.remove',
} as const;

export { SHEET_COMMAND };
