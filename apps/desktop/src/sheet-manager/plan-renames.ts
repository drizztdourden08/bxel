/* @layer renderer-app @kind logic */
import { expandNamePattern } from '@bxel/document';
import type { Sprite } from '@bxel/document';
import { buildRenamePlan } from './build-rename-plan';
import type { RenamePlan, RenameSpec } from './manager.type';

const finalName = (spec: RenameSpec, sprite: Sprite, index: number): string => {
  const found = spec.find.length === 0 ? sprite.name : sprite.name.split(spec.find).join(spec.replace);
  return expandNamePattern(spec.pattern, found, spec.start + index).trim();
};

const planRenames = (spec: RenameSpec, targets: readonly Sprite[], others: readonly string[]): RenamePlan =>
  buildRenamePlan(
    targets,
    targets.map((sprite, index) => finalName(spec, sprite, index)),
    others,
  );

export { planRenames };
