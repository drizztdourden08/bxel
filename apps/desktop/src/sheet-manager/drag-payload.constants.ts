/* @layer renderer-app @kind constants */
const ASSETS_DRAG_TYPE = 'application/x-bxel-assets';

const DRAG_WHY = {
  readOnly: 'This file is read only.',
  noSheet: 'Open a sheet to drop here.',
  nothing: 'Nothing to drop here.',
  onSheet: 'These are already on the sheet.',
  exportShown: 'The canvas shows the export result. Turn it off to place entries.',
} as const;

export { ASSETS_DRAG_TYPE, DRAG_WHY };
