/* @layer renderer-app @kind logic */
import { TRANSFORM_COMMAND } from '@bxel/raster';
import type { SpriteId } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { spritesTarget } from '../sheet/sprites-target';
import { COMPOSE_LABEL } from './compose-text.constants';
import type { MergeSpec } from './compose.type';
import { knownSprites } from './known-sprites';
import { selectMade } from './select-made';

const mergeSprites = (ids: readonly SpriteId[], spec: MergeSpec): boolean => {
  const before = knownSprites();
  const name = spec.name.trim();
  const options = { anchor: spec.anchor, keep: spec.keep, ...(name === '' ? {} : { name }) };
  const step = { name: TRANSFORM_COMMAND.spriteMerge, targets: spritesTarget(ids), options };
  if (ids.length < 2 || runDocument(COMPOSE_LABEL.merge(ids.length), [step]) === null) return false;
  selectMade(before);
  return true;
};

export { mergeSprites };
