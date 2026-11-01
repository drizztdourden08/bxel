/* @layer core @kind logic */
import { ASE } from './ase.constants';
import { formatHexColor } from './format-hex-color';
import { readAseName } from './read-ase-name';
import type { PaletteColor } from './palette-file.type';

const byteOf = (unit: number): number => Math.min(ASE.CHANNEL_MAX, Math.max(0, Math.round(unit * ASE.CHANNEL_MAX)));

const channelCountOf = (model: string): number => {
  if (model === ASE.MODEL_RGB) return 3;
  if (model === ASE.MODEL_GRAY) return 1;
  if (model === ASE.MODEL_CMYK) return 4;
  return 0;
};

const channelsOf = (view: DataView, at: number, model: string): readonly number[] | undefined => {
  const count = channelCountOf(model);
  if (count === 0 || at + count * 4 > view.byteLength) return undefined;
  return Array.from({ length: count }, (_, i) => view.getFloat32(at + i * 4));
};

const rgbOf = (model: string, c: readonly number[]): readonly number[] => {
  if (model === ASE.MODEL_GRAY) return [c[0] ?? 0, c[0] ?? 0, c[0] ?? 0];
  if (model === ASE.MODEL_CMYK) {
    const key = 1 - (c[3] ?? 0);
    return [(1 - (c[0] ?? 0)) * key, (1 - (c[1] ?? 0)) * key, (1 - (c[2] ?? 0)) * key];
  }
  return c;
};

const readAseColor = (view: DataView, start: number): PaletteColor | undefined => {
  const named = readAseName(view, start);
  if (!named || named.next + ASE.MODEL_BYTES > view.byteLength) return undefined;
  let model = '';
  for (let i = 0; i < ASE.MODEL_BYTES; i += 1) model += String.fromCharCode(view.getUint8(named.next + i));
  const channels = channelsOf(view, named.next + ASE.MODEL_BYTES, model);
  if (!channels) return undefined;
  const [r = 0, g = 0, b = 0] = rgbOf(model, channels).map(byteOf);
  return { hex: formatHexColor(r, g, b, 255), name: named.name };
};

export { readAseColor };
