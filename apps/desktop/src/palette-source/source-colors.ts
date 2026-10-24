/* @layer renderer-app @kind logic */
import { CUSTOM_COLORS, PALETTE_PRESETS } from './palette-source.constants';
import type { PaletteSource, SourceColor } from './palette-source.type';

const presetColors = (presetId: string): readonly SourceColor[] =>
  (PALETTE_PRESETS.find((each) => each.id === presetId) ?? PALETTE_PRESETS[0])?.colors ?? [];

const sourceColors = (source: PaletteSource): readonly SourceColor[] => {
  if (source.kind === 'custom') return CUSTOM_COLORS;
  if (source.kind === 'file') return source.file?.colors ?? [];
  return presetColors(source.presetId);
};

export { sourceColors };
