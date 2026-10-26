/* @layer renderer-app @kind logic */
import { SAMPLE_FALLBACK, SAMPLE_RINGS } from './preset-facts.constants';

const samplePalette = (palette: readonly string[]): readonly string[] => {
  const visible = palette.length > 2 ? palette.slice(1) : palette;
  if (visible.length === 0) return SAMPLE_FALLBACK;
  if (visible.length <= SAMPLE_RINGS) return visible;
  return Array.from({ length: SAMPLE_RINGS }, (_, at) => visible[Math.round((at * (visible.length - 1)) / (SAMPLE_RINGS - 1))] as string);
};

export { samplePalette };
