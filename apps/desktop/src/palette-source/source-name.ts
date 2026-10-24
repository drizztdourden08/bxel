/* @layer renderer-app @kind logic */
import { CUSTOM_NAME, PALETTE_PRESETS } from './palette-source.constants';
import type { PaletteSource } from './palette-source.type';

const sourceName = (source: PaletteSource): string => {
  if (source.kind === 'custom') return CUSTOM_NAME;
  if (source.kind === 'file') return source.file?.name ?? CUSTOM_NAME;
  if (source.kind === 'set') return source.set?.name ?? CUSTOM_NAME;
  return PALETTE_PRESETS.find((each) => each.id === source.presetId)?.name ?? CUSTOM_NAME;
};

export { sourceName };
