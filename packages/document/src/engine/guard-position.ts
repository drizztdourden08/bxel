/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { failIfAny } from '../commands/layer/fail-if-any';
import type { TargetIssue } from '../commands/command-error.type';
import type { Draft } from '../draft/draft.type';
import { effectiveLock } from '../read/effective-lock';
import { requireSprite } from '../read/require-sprite';
import type { ResolvedCel } from '../scope/resolved-scope.type';
import { MOVING_COMMANDS } from './guard-transparency.constants';

const positionIssue = (draft: Draft, cel: ResolvedCel): TargetIssue[] => {
  const sprite = requireSprite(draft.artwork, cel.spriteId);
  const layer = sprite.layers.find((each) => each.id === cel.layerId);
  return layer && effectiveLock(sprite.layers, layer).position ? [{ spriteId: sprite.id, layerId: layer.id, frameId: cel.frameId, reason: 'its position is locked' }] : [];
};

const guardPosition = (draft: Draft, name: string, cels: readonly ResolvedCel[]): void => {
  if (!MOVING_COMMANDS.has(name)) return;
  const issues = new Map(cels.flatMap((cel) => positionIssue(draft, cel)).map((issue) => [issue.layerId, issue]));
  failIfAny(ERROR_CODE.LAYER_POSITION_LOCKED, 'A layer with a locked position does not move or transform. Unlock its position first.', [...issues.values()]);
};

export { guardPosition };
