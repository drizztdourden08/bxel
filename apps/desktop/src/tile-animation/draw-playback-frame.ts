/* @layer renderer-app @kind logic */
import { CHANNELS } from '../sheet/sheet.constants';

const drawPlaybackFrame = (canvas: HTMLCanvasElement, indices: Uint8Array, table: Uint8Array, width: number, height: number): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
  const rgba = new Uint8ClampedArray(indices.length * CHANNELS);
  indices.forEach((index, at) => rgba.set(table.subarray(index * CHANNELS, (index + 1) * CHANNELS), at * CHANNELS));
  ctx.putImageData(new ImageData(rgba, width, height), 0, 0);
};

export { drawPlaybackFrame };
