/* @layer renderer-app @kind logic */
import { encodeGif } from '@bxel/formats';
import { bankRgba } from './bank-rgba';
import type { MadeFile, Target } from './export.type';
import { frameIndices } from './frame-indices';
import { madeBytes } from './made-bytes';
import { playOrder } from './play-order';

const makeGif = (target: Target, scale: number): MadeFile => {
  const frames = playOrder(target).map((frame) => ({
    indices: frameIndices(target, frame, scale).indices,
    delayMs: frame.durationMs,
  }));
  const transparent = target.bank.slots.findIndex((slot) => slot.kind === 'transparent');
  return madeBytes(
    encodeGif({
      width: target.sprite.width * scale,
      height: target.sprite.height * scale,
      palette: bankRgba(target.bank),
      transparentIndex: transparent < 0 ? null : transparent,
      loops: target.tag?.repeat ?? 0,
      frames,
    }),
  );
};

export { makeGif };
