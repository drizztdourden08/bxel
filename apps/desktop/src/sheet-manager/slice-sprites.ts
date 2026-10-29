/* @layer renderer-app @kind logic */
import { TRANSFORM_COMMAND } from '@bxel/raster';
import { COMMAND_NAME } from '@bxel/document';
import type { SpriteId } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { COMPOSE_LABEL } from './compose-text.constants';
import type { SliceSpec } from './compose.type';
import { knownSprites } from './known-sprites';
import { selectMade } from './select-made';
import { sliceRequest } from './slice-request';
import { spriteSteps } from './sprite-steps';

const sliceSprites = (ids: readonly SpriteId[], spec: SliceSpec, replace: readonly SpriteId[] = []): boolean => {
  const before = knownSprites();
  const drop = spec.existing === 'replace' && replace.length > 0 ? spriteSteps(COMMAND_NAME.spriteDelete, replace, { detachAnimations: true }) : [];
  const steps = [...drop, ...spriteSteps(TRANSFORM_COMMAND.spriteSlice, ids, sliceRequest(spec))];
  if (ids.length === 0 || runDocument(COMPOSE_LABEL.slice(ids.length), steps) === null) return false;
  selectMade(before);
  return true;
};

export { sliceSprites };
