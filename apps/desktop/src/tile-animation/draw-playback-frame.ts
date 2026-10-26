/* @layer renderer-app @kind logic */
import { CHANNELS } from '../sheet/sheet.constants';
import type { PlaybackFrame } from './tile-animation.type';

const drawPlaybackFrame = (canvas: HTMLCanvasElement, frame: PlaybackFrame): void => {
  const ctx = canvas.getContext('2d');
  const { indices, table, width, height } = frame;
  if (!ctx) return;
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
  const rgba = new Uint8ClampedArray(indices.length * CHANNELS);
  indices.forEach((index, at) => rgba.set(table.subarray(index * CHANNELS, (index + 1) * CHANNELS), at * CHANNELS));
  ctx.putImageData(new ImageData(rgba, width, height), 0, 0);
};

export { drawPlaybackFrame };
