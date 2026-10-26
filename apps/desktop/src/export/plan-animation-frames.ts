/* @layer renderer-app @kind logic */
import { compositeIndexed, encodePngRgba, upscaleRgba } from '@bxel/formats';
import type { ExportFrame, ExportSprite } from '@bxel/formats';
import { EXPORT_TEXT } from './export.constants';
import type { MadeFile, PlanParts, PlannedFile } from './export.type';
import { madeBytes } from './made-bytes';

const frameImage = (sprite: ExportSprite, frame: ExportFrame, scale: number): MadeFile => {
  const image = compositeIndexed(frame.layers, sprite.palette, sprite);
  return madeBytes(encodePngRgba(scale === 1 ? image : upscaleRgba(image, scale)));
};

const planAnimationFrames = (parts: PlanParts): PlannedFile[] | string => {
  const sprite = parts.extra[0];
  if (!sprite) return EXPORT_TEXT.noAnimation;
  const { scale } = parts.settings;
  const digits = Math.max(2, String(sprite.frames.length).length);
  const width = sprite.width * scale;
  const height = sprite.height * scale;
  return sprite.frames.map((frame, index) => {
    const name = `${parts.base}_${String(index + 1).padStart(digits, '0')}.png`;
    return { name, detail: EXPORT_TEXT.imageDetail(name, width, height), spriteIndex: 0, width, height, make: () => frameImage(sprite, frame, scale) };
  });
};

export { planAnimationFrames };
