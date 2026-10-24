/* @layer renderer-app @kind logic */
import { EXPORT_TEXT } from './export.constants';
import type { PlanParts, PlannedFile } from './export.type';
import { fileLabel } from './file-label';
import { makeApng } from './make-apng';
import { makeGif } from './make-gif';
import { playOrder } from './play-order';

const planAnimation = (parts: PlanParts): PlannedFile[] => {
  const { targets, settings, base } = parts;
  const { scale, animation } = settings;
  return targets.map((target, spriteIndex) => {
    const name = `${fileLabel(base, target, targets.length, null)}.${animation === 'gif' ? 'gif' : 'png'}`;
    const width = target.sprite.width * scale;
    const height = target.sprite.height * scale;
    return {
      name,
      detail: EXPORT_TEXT.animationDetail(name, width, height, playOrder(target).length),
      spriteIndex,
      width,
      height,
      make: () => (animation === 'gif' ? makeGif(target, scale) : makeApng(target, scale, settings.colour === 'indexed')),
    };
  });
};

export { planAnimation };
