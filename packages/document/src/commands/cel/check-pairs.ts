/* @layer core @kind logic */
import { ERROR_CODE } from '../error-code.constants';
import { failIfAny } from '../layer/fail-if-any';
import { layerIssue } from '../layer/layer-issue';
import type { LockRule, SlotPair } from './cel.type';

const checkPairs = (pairs: readonly SlotPair[], locks: LockRule, allowLocked: boolean): void => {
  failIfAny(
    ERROR_CODE.INVALID_OPTION,
    'from and to name the same cel slot.',
    pairs
      .filter(({ source, target }) => source.layer.id === target.layer.id && source.frame.id === target.frame.id)
      .map(({ source }) => layerIssue(source.sprite.id, source.layer, 'it is both the source and the destination')),
  );
  if (allowLocked) return;
  const locked = pairs.flatMap(({ source, target }) => (locks === 'both' ? [source, target] : [target]));
  failIfAny(
    ERROR_CODE.LAYER_LOCKED,
    'A locked layer takes cel changes only with allowLocked.',
    locked.filter(({ layer }) => layer.locked).map(({ sprite, layer }) => layerIssue(sprite.id, layer, 'locked')),
  );
};

export { checkPairs };
