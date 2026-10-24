/* @layer renderer-app @kind logic */
import { TRANSFORM_COMMAND } from '@bxel/raster';
import type { SpriteId } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { LABEL } from './manager-text.constants';
import type { ResizeSpec } from './manager.type';
import { spriteSteps } from './sprite-steps';

const resizeSprites = (ids: readonly SpriteId[], spec: ResizeSpec): boolean =>
  ids.length > 0 && runDocument(LABEL.resize(ids.length), spriteSteps(TRANSFORM_COMMAND.spriteResize, ids, spec)) !== null;

export { resizeSprites };
