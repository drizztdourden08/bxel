/* @layer renderer-app @kind logic */
import { encodeApng } from '@bxel/formats';
import { bankRgba } from './bank-rgba';
import type { MadeFile, Target } from './export.type';
import { frameIndices } from './frame-indices';
import { madeBytes } from './made-bytes';
import { playOrder } from './play-order';
import { renderImage } from './render-image';

const makeApng = (target: Target, scale: number, indexed: boolean): MadeFile => {
  const frames = playOrder(target).map((frame) => ({
    pixels: indexed ? frameIndices(target, frame, scale).indices : renderImage(target, frame, scale).data,
    delayMs: frame.durationMs,
  }));
  return madeBytes(
    encodeApng({
      width: target.sprite.width * scale,
      height: target.sprite.height * scale,
      palette: indexed ? bankRgba(target.bank) : undefined,
      loops: target.tag?.repeat ?? 0,
      frames,
    }),
  );
};

export { makeApng };
