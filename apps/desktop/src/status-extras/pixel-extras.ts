/* @layer renderer-app @kind logic */
import { EXTRA_TEXT } from './status-extras.constants';
import { frameExtra } from './frame-extra';
import { indexExtra } from './index-extra';
import type { PixelRead } from './read-extras.type';
import { selectionExtra } from './selection-extra';
import type { StatusExtras } from './status-extras.type';

const pixelExtras = (read: PixelRead): StatusExtras => ({
  index: indexExtra(read),
  selection: selectionExtra(read.mask),
  drag: read.move ? EXTRA_TEXT.dragValue(read.move.x, read.move.y) : null,
  frame: read.surface === 'sprite' ? frameExtra(read.focus) : null,
  cell: null,
  tile: null,
});

export { pixelExtras };
