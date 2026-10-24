/* @layer renderer-app @kind logic */
import { TRANSFORM_COMMAND } from '@bxel/raster';
import type { SpriteId } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { LABEL } from './manager-text.constants';
import { spriteSteps } from './sprite-steps';

const trimSprites = (ids: readonly SpriteId[]): boolean =>
  ids.length > 0 && runDocument(LABEL.trim(ids.length), spriteSteps(TRANSFORM_COMMAND.spriteTrim, ids, {})) !== null;

export { trimSprites };
