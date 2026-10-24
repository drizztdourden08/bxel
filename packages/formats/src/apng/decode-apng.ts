/* @layer core @kind logic */
import type { AnimationDecodeResult } from '../animation/animation.type';
import { isFormatFailure } from '../failure/is-format-failure';
import { groupApngFrames } from './group-apng-frames';
import type { ApngRenderState } from './apng.type';
import { readApngChunks } from './read-apng-chunks';
import { renderApngFrame } from './render-apng-frame';

const decodeApng = (bytes: Uint8Array): AnimationDecodeResult => {
  const chunks = readApngChunks(bytes);
  if (isFormatFailure(chunks)) return chunks;
  const layout = groupApngFrames(chunks);
  if (isFormatFailure(layout)) return layout;
  const { width, height } = layout;
  const state: ApngRenderState = {
    canvas: new Uint8ClampedArray(width * height * 4),
    width,
    height,
    frames: [],
    pending: undefined,
  };
  for (const frame of layout.frames) {
    const failure = renderApngFrame(state, layout, frame);
    if (failure) return failure;
  }
  return { ok: true, width, height, loops: layout.plays, frames: state.frames };
};

export { decodeApng };
