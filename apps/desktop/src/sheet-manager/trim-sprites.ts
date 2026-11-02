/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import { TRANSFORM_COMMAND } from '@bxel/raster';
import type { SpriteId } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { ANNOUNCE_TEXT } from './announce-moved.constants';
import { LABEL } from './manager-text.constants';
import { spriteSteps } from './sprite-steps';

const trimSprites = (ids: readonly SpriteId[]): boolean => {
  if (ids.length === 0 || runDocument(LABEL.trim(ids.length), spriteSteps(TRANSFORM_COMMAND.spriteTrim, ids, {})) === null) return false;
  announce(ANNOUNCE_TEXT.trimmed(ids.length));
  return true;
};

export { trimSprites };
