/* @layer renderer-app @kind logic */
import { CHANNELS } from './bank-table.constants';
import { CHANNEL_MAX } from './blend-over.constants';
import type { BlendSource } from './blend-over.type';

const blendOver = (out: Uint8ClampedArray, at: number, source: BlendSource, alpha: number): void => {
  const { data, from } = source;
  const sa = ((data[from + 3] ?? 0) / CHANNEL_MAX) * alpha;
  if (sa <= 0) return;
  const da = (out[at + 3] ?? 0) / CHANNEL_MAX;
  const oa = sa + da * (1 - sa);
  for (let channel = 0; channel < CHANNELS - 1; channel += 1) {
    out[at + channel] = ((data[from + channel] ?? 0) * sa + (out[at + channel] ?? 0) * da * (1 - sa)) / oa;
  }
  out[at + CHANNELS - 1] = oa * CHANNEL_MAX;
};

export { blendOver };
