/* @layer renderer-app @kind logic */
import { nameKey } from '@bxel/document';
import type { Sprite } from '@bxel/document';
import type { BroadcastCheck, Mismatch } from './sheet.type';

const reasonOf = (active: Sprite, sprite: Sprite, layerName: string, strict: boolean): Mismatch['reason'] | null => {
  if (strict && (sprite.width !== active.width || sprite.height !== active.height)) return 'size';
  if (strict && sprite.bankId !== active.bankId) return 'palette';
  return sprite.layers.some((layer) => nameKey(layer.name) === nameKey(layerName)) ? null : 'layer';
};

const checkBroadcast = (active: Sprite, layerName: string, group: readonly Sprite[], strict = true): BroadcastCheck => {
  const ok: Sprite[] = [];
  const gaps: Mismatch[] = [];
  for (const sprite of group) {
    const reason = sprite.id === active.id ? null : reasonOf(active, sprite, layerName, strict);
    if (reason === null) ok.push(sprite);
    else gaps.push({ spriteId: sprite.id, name: sprite.name, reason });
  }
  return { ok, gaps, total: group.length };
};

export { checkBroadcast };
