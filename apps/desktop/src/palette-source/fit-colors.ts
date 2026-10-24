/* @layer renderer-app @kind logic */
import type { FittedColors, SourceColor } from './palette-source.type';

const fitColors = (colors: readonly SourceColor[], opaque: number): FittedColors => {
  const kept = colors.slice(0, Math.max(0, opaque));
  return { colors: kept, dropped: colors.length - kept.length };
};

export { fitColors };
