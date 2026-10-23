/* @layer core @kind logic */
import type { CelId } from '../model/ids.type';
import type { Project } from '../model/project.type';
import type { Sprite, SpriteShell } from '../model/sprite.type';
import { CEL_PREFIX, ORDER_PATH, SHELL_KEYS, SHELL_PREFIX, SPRITE_PREFIX } from './entity-path.constants';
import type { UndoOp } from './history.type';

const shellOf = ({ cels: _cels, ...shell }: Sprite): SpriteShell => shell;

const sameShell = (first: Sprite, second: Sprite): boolean => SHELL_KEYS.every((key) => first[key] === second[key]);

const celOps = (before: Sprite, after: Sprite): UndoOp[] => {
  const ids = new Set([...Object.keys(before.cels), ...Object.keys(after.cels)]);
  const ops: UndoOp[] = [];
  for (const id of ids) {
    const prior = before.cels[id as CelId];
    const current = after.cels[id as CelId];
    const changed = prior?.pixels.length !== current?.pixels.length;
    if (changed) ops.push({ kind: 'entity', path: `${CEL_PREFIX}${after.id}:${id}`, before: prior, after: current });
  }
  return ops;
};

const changedOps = (before: Sprite, after: Sprite): UndoOp[] => {
  if (before === after) return [];
  const shell: UndoOp[] = sameShell(before, after)
    ? []
    : [{ kind: 'entity', path: `${SHELL_PREFIX}${after.id}`, before: shellOf(before), after: shellOf(after) }];
  return [...shell, ...celOps(before, after)];
};

const orderOps = (base: Project, next: Project): UndoOp[] => {
  const before = base.sprites.map((sprite) => sprite.id);
  const after = next.sprites.map((sprite) => sprite.id);
  const same = before.length === after.length && before.every((id, index) => id === after[index]);
  return same ? [] : [{ kind: 'entity', path: ORDER_PATH, before, after }];
};

const spriteOps = (base: Project, next: Project): UndoOp[] => {
  const prior = new Map(base.sprites.map((sprite) => [sprite.id, sprite] as const));
  const kept = new Set(next.sprites.map((sprite) => sprite.id));
  const ops: UndoOp[] = [];
  for (const sprite of next.sprites) {
    const before = prior.get(sprite.id);
    if (before) ops.push(...changedOps(before, sprite));
    else ops.push({ kind: 'entity', path: `${SPRITE_PREFIX}${sprite.id}`, before: undefined, after: sprite });
  }
  for (const sprite of base.sprites) {
    if (!kept.has(sprite.id)) ops.push({ kind: 'entity', path: `${SPRITE_PREFIX}${sprite.id}`, before: sprite, after: undefined });
  }
  return [...ops, ...orderOps(base, next)];
};

export { spriteOps };
