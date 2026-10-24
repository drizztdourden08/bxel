/* @layer renderer-app @kind logic */
import { TRANSFORM_COMMAND } from '@bxel/raster';
import type { SpriteId, TurnDirection } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { LABEL } from './manager-text.constants';
import { spriteSteps } from './sprite-steps';

const turnSprites = (ids: readonly SpriteId[], direction: TurnDirection): boolean =>
  ids.length > 0 && runDocument(LABEL.turn(ids.length), spriteSteps(TRANSFORM_COMMAND.spriteTurn, ids, { direction })) !== null;

export { turnSprites };
