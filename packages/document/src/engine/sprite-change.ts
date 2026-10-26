/* @layer core @kind logic */
import type { SpriteChange } from '../commands/result.type';
import type { Sprite } from '../model/sprite.type';
import { celChanges } from './cel-changes';

const structureKeys = ['width', 'height', 'layers', 'frames', 'tags', 'slices'] as const;

const optionsChanged = (before: Sprite, after: Sprite): boolean =>
  before.platformId !== after.platformId ||
  before.platformStrict !== after.platformStrict ||
  before.pixelGrid?.width !== after.pixelGrid?.width ||
  before.pixelGrid?.height !== after.pixelGrid?.height ||
  before.guides !== after.guides;

const metaChanged = (before: Sprite, after: Sprite): boolean =>
  before.name !== after.name ||
  before.role !== after.role ||
  before.bankId !== after.bankId ||
  before.pivot.x2 !== after.pivot.x2 ||
  before.pivot.y2 !== after.pivot.y2 ||
  optionsChanged(before, after);

const structureChanged = (before: Sprite, after: Sprite): boolean =>
  structureKeys.some((key) => before[key] !== after[key]);

const spriteChange = ({
  before,
  after,
  recolored,
}: {
  before: Sprite | undefined;
  after: Sprite;
  recolored: boolean;
}): SpriteChange | null => {
  if (!before) {
    return { id: after.id, kind: 'added', meta: true, structure: true, recolored: false, cels: celChanges(undefined, after) };
  }
  if (before === after && !recolored) return null;
  const meta = metaChanged(before, after);
  const structure = structureChanged(before, after);
  const cels = celChanges(before, after);
  if (!meta && !structure && !recolored && cels.length === 0) return null;
  return { id: after.id, kind: 'updated', meta, structure, recolored, cels };
};

export { spriteChange };
