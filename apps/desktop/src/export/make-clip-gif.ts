/* @layer renderer-app @kind logic */
import { encodeGif } from '@bxel/formats';
import type { ExportSprite } from '@bxel/formats';
import { clipIndices } from './clip-indices';
import type { MadeFile } from './export.type';
import type { Clip } from './export-parts.type';
import { madeBytes } from './made-bytes';

const transparentIndex = (palette: ArrayLike<number>): number | null => {
  for (let at = 0; at < palette.length; at += 4) if (palette[at + 3] === 0) return at / 4;
  return null;
};

const makeClipGif = (sprite: ExportSprite, clip: Clip, scale: number): MadeFile =>
  madeBytes(
    encodeGif({
      width: sprite.width * scale,
      height: sprite.height * scale,
      palette: sprite.palette,
      transparentIndex: transparentIndex(sprite.palette),
      loops: clip.repeat,
      frames: clip.frames.map((frame) => ({ indices: clipIndices(sprite, frame, scale), delayMs: frame.durationMs })),
    }),
  );

export { makeClipGif };
