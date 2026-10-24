/* @layer core @kind logic */
import { FORMAT_ERROR_CODE } from '../failure/format-error.constants';
import { formatFail } from '../failure/format-fail';
import type { FormatFailure } from '../failure/format.type';
import { inflateLayer } from './inflate-layer';
import { numberOf } from './number-of';
import type { Rec } from './rec.type';
import { textOf } from './text-of';
import { BYTES_PER_GID } from './tiled.constants';

const bad = (message: string): FormatFailure => formatFail(FORMAT_ERROR_CODE.TILED_INVALID, message);

const fromNumbers = (values: readonly unknown[], count: number): Uint32Array | FormatFailure => {
  if (values.length !== count) return bad(`A tile layer holds ${values.length} cells, not ${count}.`);
  return Uint32Array.from(values, (value) => numberOf(value, 0) >>> 0);
};

const fromBytes = (bytes: Uint8Array, count: number): Uint32Array | FormatFailure => {
  if (bytes.length !== count * BYTES_PER_GID) return bad('The tile layer data does not match the map size.');
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return Uint32Array.from({ length: count }, (_, at) => view.getUint32(at * BYTES_PER_GID, true));
};

const fromText = (text: string, layer: Rec, count: number): Uint32Array | FormatFailure => {
  const encoding = textOf(layer['encoding'], 'csv');
  if (encoding === 'csv') return fromNumbers(text.split(',').filter((part) => part.trim() !== ''), count);
  if (encoding !== 'base64') return bad(`The tile layer encoding ${encoding} is not supported.`);
  const inflated = inflateLayer(text, textOf(layer['compression'], ''), count * BYTES_PER_GID);
  return inflated instanceof Uint8Array ? fromBytes(inflated, count) : inflated;
};

const decodeGids = (layer: Rec, count: number): Uint32Array | FormatFailure => {
  const data = layer['data'];
  if (Array.isArray(data)) return fromNumbers(data as readonly unknown[], count);
  return typeof data === 'string' ? fromText(data, layer, count) : bad('A tile layer has no data. Infinite maps are not supported.');
};

export { decodeGids };
