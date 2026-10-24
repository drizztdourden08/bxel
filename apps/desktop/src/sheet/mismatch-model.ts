/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import { checkBroadcast } from './check-broadcast';
import { mismatchText } from './mismatch-text';
import type { MismatchModel, SpriteScene } from './sheet.type';

const mismatchModel = (scene: SpriteScene, layerName: string, group: readonly Sprite[], strict: boolean): MismatchModel | null => {
  const { active } = scene;
  if (!active || group.length < 2) return null;
  const check = checkBroadcast(active, layerName, group, strict);
  if (check.gaps.length === 0) return null;
  return {
    text: mismatchText(check, layerName),
    layerName,
    layerGaps: check.gaps.filter((gap) => gap.reason === 'layer').map((gap) => gap.spriteId),
    keep: check.ok.map((sprite) => sprite.id),
  };
};

export { mismatchModel };
