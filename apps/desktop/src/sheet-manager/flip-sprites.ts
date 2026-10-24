/* @layer renderer-app @kind logic */
import { TRANSFORM_COMMAND } from '@bxel/raster';
import type { FlipAxis, SpriteId } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { LABEL } from './manager-text.constants';
import { spriteSteps } from './sprite-steps';

const flipSprites = (ids: readonly SpriteId[], axis: FlipAxis): boolean =>
  ids.length > 0 && runDocument(LABEL.flip(ids.length), spriteSteps(TRANSFORM_COMMAND.spriteFlip, ids, { axis })) !== null;

export { flipSprites };
