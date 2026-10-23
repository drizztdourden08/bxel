/* @layer core @kind logic */
import type { Sprite } from '../model/sprite.type';
import { remapCel } from '../pixels/remap-cel';
import type { BankRemap, Draft } from './draft.type';
import { flushCels } from './flush-cels';
import { updateProject } from './update-project';

const remapSprite = (draft: Draft, sprite: Sprite, table: Uint8Array): Sprite => {
  const entries = Object.values(sprite.cels).map((cel) => {
    const pixels = remapCel(cel.pixels, table);
    draft.owned.delete(cel.id);
    draft.baselines.set(cel.id, pixels);
    return [cel.id, { ...cel, pixels }] as const;
  });
  return { ...sprite, cels: Object.fromEntries(entries) };
};

const remapBank = (draft: Draft, remap: BankRemap): void => {
  flushCels(draft);
  draft.ops.push({ kind: 'cel-remap', bankId: remap.bankId, forward: remap.forward, inverse: remap.inverse });
  updateProject(draft, (project) => ({
    ...project,
    sprites: project.sprites.map((sprite) => (sprite.bankId === remap.bankId ? remapSprite(draft, sprite, remap.forward) : sprite)),
  }));
};

export { remapBank };
