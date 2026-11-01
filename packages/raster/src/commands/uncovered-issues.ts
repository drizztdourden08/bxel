/* @layer core @kind logic */
import { effectiveLock, layerKindOf, shownInTree } from '@bxel/document';
import type { Layer, ResolvedCel, Sprite, TargetIssue } from '@bxel/document';

const reasonFor = (sprite: Sprite, layer: Layer): string => {
  if (effectiveLock(sprite.layers, layer).pixels) {
    return 'the layer is locked, so it cannot turn with the sprite';
  }
  if (!shownInTree(sprite.layers, layer)) {
    return 'the layer is hidden, so it cannot turn with the sprite';
  }
  return 'the target scope leaves cels of this layer out, but a turn needs every cel of the sprite';
};

const uncoveredIssues = (sprite: Sprite, cels: readonly ResolvedCel[]): TargetIssue[] => {
  const covered = new Set(cels.map((cel) => `${cel.layerId}:${cel.frameId}`));
  const issues: TargetIssue[] = [];
  for (const layer of sprite.layers.filter((each) => layerKindOf(each) === 'pixel')) {
    const missing = sprite.frames.filter((frame) => !covered.has(`${layer.id}:${frame.id}`));
    const whole = missing.length === sprite.frames.length;
    if (missing.length > 0) {
      issues.push({ spriteId: sprite.id, layerId: layer.id, frameId: whole ? null : (missing[0]?.id ?? null), reason: reasonFor(sprite, layer) });
    }
  }
  return issues;
};

export { uncoveredIssues };
