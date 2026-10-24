/* @layer core @kind logic */
import type { CelId } from '../model/ids.type';
import type { PaletteBank } from '../model/palette.type';
import type { Cel } from '../model/sprite.type';
import type { SpriteJson } from './document-json.type';
import type { DamagedCel } from './load-report.type';
import type { EntryCheck } from './entry-check.type';
import { restoreCel } from './restore-cel';
import type { RestoredSprite } from './restored-sprite.type';

const restoreSprite = (shell: SpriteJson, bank: PaletteBank, source: EntryCheck): RestoredSprite => {
  const cels: Record<CelId, Cel> = {};
  const damage: DamagedCel[] = [];
  for (const celId of shell.celIds) {
    const restored = restoreCel(shell, bank, celId, source);
    cels[celId] = restored.cel;
    if (restored.damage) damage.push(restored.damage);
  }
  const sprite = {
    id: shell.id,
    name: shell.name,
    ...(shell.created === undefined ? {} : { created: shell.created }),
    role: shell.role,
    bankId: shell.bankId,
    width: shell.width,
    height: shell.height,
    pivot: shell.pivot,
    layers: shell.layers,
    frames: shell.frames,
    tags: shell.tags,
    slices: shell.slices,
    cels,
  };
  return { sprite, damage };
};

export { restoreSprite };
