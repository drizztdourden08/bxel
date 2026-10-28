/* @layer renderer-app @kind constants */
import type { BxelContext } from './bxel-context.type';

const REASON = {
  noDocument: 'Open or create an asset first.',
  noDraw: 'Open or create an asset to draw.',
  noFile: 'Open or create a file first.',
  readOnly: 'This file is open read only. Use Save as to edit a copy.',
  noSelection: 'Nothing is selected.',
  noCells: 'No cells are selected.',
  emptyClipboard: 'The clipboard is empty.',
  nothingToUndo: 'There is nothing to undo.',
  nothingToRedo: 'There is nothing to redo.',
  noProject: 'No project is open.',
  noPending: 'Nothing is waiting to be applied.',
  imageOnly: 'An image is a preview. Use Import to make an asset from it.',
} as const;

const documentReason = (context: BxelContext): string => (context.fileType === 'image' ? REASON.imageOnly : REASON.noDocument);

const ONLY = {
  animations: 'Animations',
  pixels: 'Sprites, animations and tiles',
  maps: 'Tilemaps',
  tiles: 'Tilesets and tilemaps',
  sheets: 'Sheets',
  palettes: 'Palettes',
  drawing: 'Sprites, animations, tiles and maps',
} as const;

export { documentReason, ONLY, REASON };
