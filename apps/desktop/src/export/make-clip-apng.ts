/* @layer renderer-app @kind logic */
import { compositeIndexed, encodeApng, upscaleRgba } from '@bxel/formats';
import type { ExportFrame, ExportSprite } from '@bxel/formats';
import { clipIndices } from './clip-indices';
import type { MadeFile } from './export.type';
import type { Clip } from './export-parts.type';
import { madeBytes } from './made-bytes';

const pixelsOf = (sprite: ExportSprite, frame: ExportFrame, scale: number): Uint8ClampedArray => {
  const image = compositeIndexed(frame.layers, sprite.palette, sprite);
  return (scale === 1 ? image : upscaleRgba(image, scale)).data;
};

const makeClipApng = (sprite: ExportSprite, clip: Clip, scale: number, indexed: boolean): MadeFile =>
  madeBytes(
    encodeApng({
      width: sprite.width * scale,
      height: sprite.height * scale,
      palette: indexed ? sprite.palette : undefined,
      loops: clip.repeat,
      frames: clip.frames.map((frame) => ({
        pixels: indexed ? clipIndices(sprite, frame, scale) : pixelsOf(sprite, frame, scale),
        delayMs: frame.durationMs,
      })),
    }),
  );

export { makeClipApng };
